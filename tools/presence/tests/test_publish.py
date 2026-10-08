"""Offline contract tests for Actions publication and concurrent writers."""
import asyncio
import base64
import contextlib
import io
import json
import os
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch
from urllib.error import HTTPError

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import publish


class PublisherTests(unittest.TestCase):
    def test_new_data_branch_contains_only_public_snapshot(self):
        calls = []
        def api(path, method='GET', data=None):
            calls.append((path, method, data))
            return {'sha': path.rsplit('/', 1)[-1]}
        with patch.object(publish, 'api', api):
            publish.write(None, {'version': 1})
        tree = next(data for path, method, data in calls if path == 'git/trees')
        self.assertEqual([entry['path'] for entry in tree['tree']], ['status.json'])
        commit = next(data for path, method, data in calls if path == 'git/commits')
        self.assertEqual(commit['parents'], [])
        self.assertEqual(calls[-1], ('git/refs', 'POST', {'ref': 'refs/heads/presence-data', 'sha': 'commits'}))

    def test_read_uses_immutable_commit(self):
        def api(path):
            if path == 'git/ref/heads/presence-data': return {'object': {'sha': 'HEAD123'}}
            self.assertEqual(path, 'contents/status.json?ref=HEAD123')
            return {'content': base64.b64encode(b'{"version":1}').decode()}
        with patch.object(publish, 'api', api):
            self.assertEqual(publish.current(), ('HEAD123', {'version': 1}))

    def test_device_report_refreshes_health_and_remerges_conflicts(self):
        now = publish.datetime.now(publish.timezone.utc).isoformat()
        mac = {'device':'mac','app':'Code','activity':'working','sampled_at':now}
        windows = {'device':'windows','app':'Firefox','activity':'browsing','sampled_at':now}
        writes = []
        def write(parent, document):
            writes.append((parent, document))
            if len(writes) == 1:
                error = HTTPError('https://api.github.com', 422, 'Conflict', {}, None)
                error.close()
                raise error
        with tempfile.TemporaryDirectory() as folder:
            event = Path(folder) / 'event.json'
            event.write_text(json.dumps({'client_payload': mac}))
            with patch.dict(os.environ, {'GITHUB_EVENT_NAME':'repository_dispatch','GITHUB_EVENT_PATH':str(event)}), \
                 patch.object(publish, 'current', side_effect=[('old', {}), ('new', {'computers': {'windows': windows}})]), \
                 patch.object(publish, 'write', write), patch.object(publish, 'collect', return_value=({'heart_rate': {'value': 77, 'sampled_at': now}}, 'ok')) as collect, \
                 contextlib.redirect_stdout(io.StringIO()):
                publish.main()
        collect.assert_awaited_once()
        self.assertEqual(writes[-1][1]['health']['heart_rate']['value'], 77)
        self.assertEqual(writes[-1][0], 'new')
        self.assertEqual(set(writes[-1][1]['computers']), {'mac', 'windows'})

    def test_health_failure_still_publishes_computer_and_keeps_old_sample_time(self):
        now = publish.datetime.now(publish.timezone.utc).isoformat()
        mac = {'device':'mac','app':'Code','activity':'working','sampled_at':now}
        old_heart = {'value':75,'sampled_at':'2026-10-08T03:40:00Z'}
        for failure in [TimeoutError(), RuntimeError('private upstream details')]:
            with self.subTest(failure=type(failure).__name__), tempfile.TemporaryDirectory() as folder:
                event = Path(folder) / 'event.json'
                event.write_text(json.dumps({'client_payload': mac}))
                output = io.StringIO()
                with patch.dict(os.environ, {'GITHUB_EVENT_NAME':'repository_dispatch','GITHUB_EVENT_PATH':str(event)}), \
                     patch.object(publish, 'current', return_value=('old', {'health': {'heart_rate': old_heart}})), \
                     patch.object(publish, 'write') as write, patch.object(publish, 'collect', side_effect=failure), \
                     contextlib.redirect_stdout(output):
                    publish.main()
                document = write.call_args.args[1]
                self.assertEqual(document['computers']['mac']['app'], 'Code')
                self.assertEqual(document['health']['heart_rate'], old_heart)
                self.assertNotIn('private upstream details', output.getvalue())

if __name__ == '__main__': unittest.main()
