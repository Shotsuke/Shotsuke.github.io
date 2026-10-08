"""Read only heart rate and today's steps; no sleep inference from heart rate."""
from collections import defaultdict
from datetime import datetime, timezone
from zoneinfo import ZoneInfo
import json
import os
from core import iso


def sample_time(row):
    try: return datetime.fromtimestamp(float(row['time']), timezone.utc)
    except (KeyError, ValueError, TypeError, OverflowError): return None


def payload(row):
    try:
        value = row.get('value', {})
        value = json.loads(value) if isinstance(value, str) else value
        return value if isinstance(value, dict) else {}
    except (ValueError, TypeError): return {}


def summarize(heart_rows, step_rows, now):
    heart = []
    for row in heart_rows:
        when, bpm = sample_time(row), payload(row).get('bpm')
        if when and when <= now and type(bpm) is int and 20 <= bpm <= 250:
            heart.append((when, bpm))
    today = now.astimezone(ZoneInfo('Asia/Shanghai')).date().isoformat()
    sources = defaultdict(dict)
    for row in step_rows:
        when, steps = sample_time(row), payload(row).get('steps')
        if (when and when <= now and type(steps) is int and 0 <= steps <= 200000
                and when.astimezone(ZoneInfo('Asia/Shanghai')).date().isoformat() == today):
            # Multiple devices can record the same walk. Never add different sources together.
            sources[str(row.get('sid', 'unknown'))][when] = steps
    result = {}
    if heart:
        when, bpm = max(heart)
        result['heart_rate'] = {'value': bpm, 'sampled_at': iso(when)}
    if sources:
        when, total = max(((max(samples), sum(samples.values())) for samples in sources.values()),
                          key=lambda item: (item[1], item[0]))
        result['steps'] = {'value': total, 'sampled_at': iso(when), 'date': today}
    return result


async def collect(now):
    user, token = os.environ.get('MI_USER_ID'), os.environ.get('MI_PASS_TOKEN')
    if not user or not token: return {}, 'not_configured'
    from mi_fitness_mcp.adapters.mi_fitness_cloud import MiFitnessCloudAdapter
    adapter = MiFitnessCloudAdapter(user_id=user, pass_token=token, region='cn')
    adapter.request_retries = 1
    # Upstream exception messages are deliberately not copied into logs or public JSON.
    try:
        if not await adapter.connect(): return {}, 'unavailable'
        day = now.astimezone(ZoneInfo('Asia/Shanghai')).date().isoformat()
        hr = await adapter._fetch_key('heart_rate', day, day)
        steps = await adapter._fetch_key('steps', day, day)
        return summarize(hr, steps, now), 'ok'
    except Exception:
        return {}, 'unavailable'
    finally:
        await adapter._close_client()
