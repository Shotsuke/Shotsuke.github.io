"""Send one app-only snapshot to GitHub Actions. Standard library only."""
import argparse
from datetime import datetime, timezone
import json
from pathlib import Path
import shutil
import subprocess
import sys


def classify(sample, config):
    app = str(sample.get('app', ''))[:80]
    process = str(sample.get('process', ''))
    names = {app.casefold(), process.casefold()}
    def matches(key):
        return bool(names & {str(x).casefold() for x in config.get(key, [])})
    # Hidden apps produce only an away snapshot; no private app name reaches GitHub.
    if (not app or matches('private_apps') or any(x in app for x in ('/', '\\', '://'))
            or any(ord(c) < 32 for c in app)
            or float(sample.get('idle_seconds', 86400)) >= config.get('idle_after_seconds', 300)
            or names & {'loginwindow', 'com.apple.loginwindow', 'lockapp', 'logonui'}):
        return 'away', ''
    # Browsers always stay browsing, even if accidentally added to a work/game list.
    for key, activity in [('browser_apps', 'browsing'), ('gaming_apps', 'gaming'), ('working_apps', 'working')]:
        if matches(key): return activity, app
    return 'using', app


def make_payload(sample, config, now):
    activity, app = classify(sample, config)
    return {'device': config['device'], 'activity': activity, 'app': app,
            'sampled_at': now.astimezone(timezone.utc).isoformat().replace('+00:00', 'Z')}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--config', type=Path, default=Path(__file__).with_name('config.json'))
    parser.add_argument('--dry-run', action='store_true')
    parser.add_argument('--fixture', type=Path, help='Synthetic sample for offline tests')
    args = parser.parse_args()
    config = json.loads(args.config.read_text())
    if config.get('device') not in ('mac', 'windows'): raise ValueError('Invalid device name')
    if args.fixture:
        if not args.dry_run: raise ValueError('Fixtures require --dry-run')
        sample = json.loads(args.fixture.read_text())
    elif sys.platform == 'darwin':
        output = subprocess.check_output([str(Path(__file__).with_name('frontmost'))], timeout=10)
        sample = json.loads(output)
    else:
        raise RuntimeError('On Windows use report-windows.ps1')
    payload = make_payload(sample, config, datetime.now(timezone.utc))
    if args.dry_run:
        print(json.dumps(payload, ensure_ascii=False, indent=2)); return
    gh = shutil.which('gh')
    if not gh: raise RuntimeError('Install GitHub CLI and sign in before running the reporter')
    repo = config['repository']
    if repo != 'Shotsuke/Shotsuke.github.io': raise ValueError('Unexpected repository; review destination')
    body = json.dumps({'event_type': 'computer-presence', 'client_payload': payload})
    result = subprocess.run([gh, 'api', f'repos/{repo}/dispatches', '--method', 'POST', '--input', '-'],
                            input=body, text=True, capture_output=True, timeout=45)
    if result.returncode: raise RuntimeError('GitHub report failed; check gh auth status and network')
    print('Presence snapshot submitted.')


if __name__ == '__main__':
    try: main()
    except Exception as error:
        print('Reporter:', str(error), file=sys.stderr)
        raise SystemExit(1)
