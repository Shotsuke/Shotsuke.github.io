"""Actions entrypoint. Publish a whitelisted snapshot on a separate data branch."""
import asyncio
import base64
from datetime import datetime, timezone
import json
import logging
import os
from pathlib import Path
import urllib.request
import urllib.error
from core import merge, public_json
from health import collect

BRANCH = 'presence-data'
REPO = os.environ.get('GITHUB_REPOSITORY', 'Shotsuke/Shotsuke.github.io')
TOKEN = os.environ.get('GH_TOKEN', '')


def api(path, method='GET', data=None):
    request = urllib.request.Request('https://api.github.com/repos/' + REPO + '/' + path,
        data=json.dumps(data).encode() if data is not None else None, method=method,
        headers={'Authorization': 'Bearer ' + TOKEN, 'Accept': 'application/vnd.github+json',
                 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'shotsuke-presence'})
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.load(response)


def current():
    try:
        ref = api('git/ref/heads/' + BRANCH)
    except urllib.error.HTTPError as error:
        if error.code == 404: return None, {}
        raise
    sha = ref['object']['sha']
    entry = api('contents/status.json?ref=' + sha)
    return sha, json.loads(base64.b64decode(entry['content']))


def write(parent, document):
    content = public_json(document)
    blob = api('git/blobs', 'POST', {'content': content, 'encoding': 'utf-8'})
    tree = api('git/trees', 'POST', {'tree': [
        {'path': 'status.json', 'mode': '100644', 'type': 'blob', 'sha': blob['sha']}]})
    commit = api('git/commits', 'POST', {'message': 'Update public presence snapshot',
        'tree': tree['sha'], 'parents': [parent] if parent else []})
    if parent:
        api('git/refs/heads/' + BRANCH, 'PATCH', {'sha': commit['sha'], 'force': False})
    else:
        api('git/refs', 'POST', {'ref': 'refs/heads/' + BRANCH, 'sha': commit['sha']})


async def refresh_health(now):
    # A stalled health request must not prevent computer presence from being published.
    try:
        return await asyncio.wait_for(collect(now), timeout=45)
    except Exception:
        return {}, 'unavailable'


def main():
    logging.disable(logging.CRITICAL)
    now = datetime.now(timezone.utc)
    event = json.loads(Path(os.environ['GITHUB_EVENT_PATH']).read_text())
    event_name = os.environ['GITHUB_EVENT_NAME']
    incoming = event.get('client_payload') if event_name == 'repository_dispatch' else None
    override = event.get('inputs') if event_name == 'workflow_dispatch' else None
    if override and override.get('activity') == 'keep': override = None
    # Device reports also refresh health: GitHub cron can be delayed or skipped.
    health, status = asyncio.run(refresh_health(now))
    # Retry a ref conflict using the latest snapshot so two device reports cannot overwrite each other.
    for attempt in range(3):
        parent, old = current()
        document = merge(old, now, incoming=incoming, health=health, override=override)
        try:
            write(parent, document)
            break
        except urllib.error.HTTPError as error:
            if error.code not in (409, 422) or attempt == 2: raise
    print('Public snapshot updated; health source:', status)
    if status == 'unavailable':
        print('::warning::Mi Fitness refresh unavailable. Previous sample times preserved; re-login may be required.')
    if status == 'not_configured':
        print('::warning::Mi Fitness secrets are not configured yet.')


if __name__ == '__main__':
    try: main()
    except Exception as error:
        # Avoid printing response bodies, headers, or auth/session details.
        print('Presence update failed:', type(error).__name__)
        raise SystemExit(1)
