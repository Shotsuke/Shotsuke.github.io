#!/bin/sh
set -eu
TASK_SOURCE=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
TASK_DEST="$HOME/Library/Application Support/ShotsukePresence"
TASK_PLIST="$HOME/Library/LaunchAgents/io.shotsuke.presence.plist"
TASK_PYTHON=$(command -v python3)
command -v gh >/dev/null
command -v swiftc >/dev/null
mkdir -p "$TASK_DEST" "$HOME/Library/LaunchAgents"
chmod 700 "$TASK_DEST"
cp "$TASK_SOURCE/report.py" "$TASK_DEST/report.py"
[ -f "$TASK_DEST/config.json" ] || cp "$TASK_SOURCE/config.example.json" "$TASK_DEST/config.json"
swiftc "$TASK_SOURCE/frontmost.swift" -o "$TASK_DEST/frontmost"
"$TASK_PYTHON" - "$TASK_DEST" "$TASK_PLIST" "$TASK_PYTHON" <<'PY'
import os,plistlib,sys
from pathlib import Path
folder,plist,python=sys.argv[1:]
value={'Label':'io.shotsuke.presence','ProgramArguments':[python,folder+'/report.py'],
       'StartInterval':600,'RunAtLoad':True,'ProcessType':'Background',
       'EnvironmentVariables':{'PATH':'/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin'},
       'StandardOutPath':folder+'/report.log','StandardErrorPath':folder+'/error.log'}
# Preserve explicitly supplied proxy settings for background GitHub requests.
for key in ('HTTPS_PROXY', 'HTTP_PROXY', 'NO_PROXY'):
    if os.environ.get(key): value['EnvironmentVariables'][key] = os.environ[key]
Path(plist).write_bytes(plistlib.dumps(value))
PY
launchctl bootout "gui/$(id -u)" "$TASK_PLIST" 2>/dev/null || true
launchctl bootstrap "gui/$(id -u)" "$TASK_PLIST"
printf 'Mac reporter installed. Configuration: %s/config.json\n' "$TASK_DEST"
