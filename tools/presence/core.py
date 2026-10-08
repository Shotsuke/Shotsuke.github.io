"""Public presence schema. Never serialize upstream responses or credentials."""
from datetime import datetime, timezone, timedelta
import json

TTL = 3600
ACTIVITIES = {'working', 'gaming', 'browsing', 'using', 'away'}
DEVICES = {'mac', 'windows'}


def timestamp(value):
    try:
        if not isinstance(value, str): return None
        parsed = datetime.fromisoformat(value.replace('Z', '+00:00'))
        return parsed.astimezone(timezone.utc) if parsed.tzinfo else None
    except (ValueError, TypeError):
        return None


def iso(value):
    return value.astimezone(timezone.utc).isoformat().replace('+00:00', 'Z')


def fresh(value, now):
    date = timestamp(value)
    return date is not None and -60 <= (now - date).total_seconds() < TTL


def metric(value, low, high):
    if not isinstance(value, dict): return None
    number = value.get('value')
    when = timestamp(value.get('sampled_at'))
    if type(number) is not int or not low <= number <= high or when is None: return None
    return {'value': number, 'sampled_at': iso(when)}


def computer(value, now):
    if not isinstance(value, dict) or value.get('device') not in DEVICES: return None
    if value.get('activity') not in ACTIVITIES or not fresh(value.get('sampled_at'), now): return None
    app = value.get('app')
    if not isinstance(app, str) or len(app) > 80 or any(ord(c) < 32 for c in app): return None
    # Reject URLs/paths even if a modified sender submits them as an application name.
    if any(x in app for x in ('://', '/', '\\', '\n')): return None
    return {'device': value['device'], 'app': app, 'activity': value['activity'],
            'sampled_at': iso(timestamp(value['sampled_at']))}


def clean_document(previous, now):
    previous = previous if isinstance(previous, dict) else {}
    health = previous.get('health') if isinstance(previous.get('health'), dict) else {}
    heart = metric(health.get('heart_rate'), 20, 250)
    steps = metric(health.get('steps'), 0, 200000)
    if steps:
        try:
            day = datetime.strptime(health['steps']['date'], '%Y-%m-%d').date().isoformat()
            steps['date'] = day
        except (KeyError, TypeError, ValueError): steps = None
    # Expired computers are kept for their last-seen timestamp, never their app/activity.
    devices = {}
    prior = previous.get('computers')
    if isinstance(prior, dict):
        for name in DEVICES:
            item = prior.get(name)
            valid = computer(item, now)
            if valid and valid['device'] == name: devices[name] = valid
            elif isinstance(item, dict) and timestamp(item.get('sampled_at')):
                devices[name] = {'device': name, 'app': '', 'activity': 'away',
                                 'sampled_at': iso(timestamp(item['sampled_at']))}
    manual = previous.get('manual')
    if not isinstance(manual, dict) or manual.get('activity') not in ACTIVITIES | {'sleeping'}:
        manual = None
    elif not timestamp(manual.get('expires_at')) or timestamp(manual['expires_at']) <= now:
        manual = None
    else:
        manual = {'activity': manual['activity'], 'expires_at': iso(timestamp(manual['expires_at']))}
    return {'version': 1, 'generated_at': iso(now), 'ttl_seconds': TTL,
            'health': {'heart_rate': heart, 'steps': steps}, 'computers': devices, 'manual': manual}


def merge(previous, now, *, incoming=None, health=None, override=None):
    result = clean_document(previous, now)
    if incoming is not None:
        sample = computer(incoming, now)
        if sample is None: raise ValueError('Invalid or expired computer sample')
        old = result['computers'].get(sample['device'])
        if old is None or timestamp(sample['sampled_at']) >= timestamp(old['sampled_at']):
            result['computers'][sample['device']] = sample
    if health:
        candidate = clean_document({'health': health}, now)['health']
        for name, value in candidate.items():
            old = result['health'].get(name)
            if value and timestamp(value['sampled_at']) <= now + timedelta(seconds=60):
                if old is None or timestamp(value['sampled_at']) >= timestamp(old['sampled_at']):
                    result['health'][name] = value
    if override:
        activity = override.get('activity')
        if activity == 'auto': result['manual'] = None
        elif activity in ACTIVITIES | {'sleeping'}:
            minutes = int(override.get('minutes', 60))
            if not 1 <= minutes <= 720: raise ValueError('Manual duration must be 1–720 minutes')
            result['manual'] = {'activity': activity, 'expires_at': iso(now + timedelta(minutes=minutes))}
        else: raise ValueError('Invalid override')
    return result


def public_json(value):
    return json.dumps(value, ensure_ascii=False, indent=2) + '\n'
