import importlib.util
import json
from pathlib import Path
import sys
import unittest
from datetime import datetime, timedelta, timezone
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from core import merge, fresh, public_json
from health import summarize
spec = importlib.util.spec_from_file_location('report', Path(__file__).resolve().parents[1] / 'agents/report.py')
report = importlib.util.module_from_spec(spec); spec.loader.exec_module(report)

class PresenceTests(unittest.TestCase):
    def setUp(self):
        self.now = datetime(2026, 10, 8, 4, 0, tzinfo=timezone.utc)
        self.at = self.now.isoformat()
        self.sample = {'device':'mac','app':'Code','activity':'working','sampled_at':self.at}
    def test_boundary_and_future(self):
        self.assertTrue(fresh((self.now-timedelta(seconds=3599)).isoformat(),self.now))
        self.assertFalse(fresh((self.now-timedelta(hours=1)).isoformat(),self.now))
        self.assertFalse(fresh((self.now+timedelta(minutes=5)).isoformat(),self.now))
    def test_allowlist(self):
        s={**self.sample,'url':'https://secret.example','window_title':'private','token':'SECRET'}
        doc=merge({'user_id':'PRIVATE','passToken':'SECRET'},self.now,incoming=s)
        text=public_json(doc)
        for private in ['PRIVATE','SECRET','window_title','secret.example']: self.assertNotIn(private,text)
    def test_separate_devices_and_replay(self):
        doc=merge({},self.now,incoming=self.sample)
        doc=merge(doc,self.now,incoming={**self.sample,'device':'windows','app':'Game','activity':'gaming'})
        doc=merge(doc,self.now,incoming={**self.sample,'sampled_at':(self.now-timedelta(minutes=5)).isoformat(),'app':'Old'})
        self.assertEqual(doc['computers']['mac']['app'],'Code')
        self.assertEqual(doc['computers']['windows']['app'],'Game')
    def test_failed_refresh_keeps_sample_age(self):
        old={'health':{'heart_rate':{'value':75,'sampled_at':(self.now-timedelta(hours=2)).isoformat()}}}
        doc=merge(old,self.now,health={})
        self.assertFalse(fresh(doc['health']['heart_rate']['sampled_at'],self.now))
    def test_expired_app_hidden(self):
        doc=merge({},self.now,incoming=self.sample)
        doc=merge(doc,self.now+timedelta(hours=1))
        self.assertEqual(doc['computers']['mac']['app'],'')
    def test_manual_expires(self):
        doc=merge({},self.now,override={'activity':'sleeping','minutes':60})
        self.assertIsNone(merge(doc,self.now+timedelta(hours=1))['manual'])
    def test_reject_titles_disguised_as_urls(self):
        with self.assertRaises(ValueError): merge({},self.now,incoming={**self.sample,'app':'https://private.test'})
    def test_steps_do_not_double_count_sources_or_duplicate_rows(self):
        def row(sid, steps, stamp): return {'sid':sid,'time':stamp,'value':json.dumps({'steps':steps})}
        stamp=int(self.now.timestamp())
        data=[row('a',12,stamp),row('a',12,stamp),row('b',10,stamp),row('a',500,stamp-86400)]
        health=summarize([],data,self.now)
        self.assertEqual(health['steps']['value'],12)
        self.assertEqual(health['steps']['date'],'2026-10-08')
    def test_heart_timestamp_is_sample_not_upload_time(self):
        stamp=int(self.now.timestamp())-600
        health=summarize([{'time':stamp,'update_time':int(self.now.timestamp()),'value':{'bpm':75}}],[],self.now)
        self.assertEqual(datetime.fromisoformat(health['heart_rate']['sampled_at'].replace('Z','+00:00')).timestamp(),stamp)
    def test_private_and_browser_classification(self):
        cfg={'device':'mac','private_apps':['Messages'],'browser_apps':['Safari'],'gaming_apps':['Safari'],'working_apps':['Code'],'idle_after_seconds':300}
        self.assertEqual(report.classify({'app':'Messages','idle_seconds':0},cfg),('away',''))
        self.assertEqual(report.classify({'app':'Safari','idle_seconds':0},cfg),('browsing','Safari'))
        self.assertEqual(report.classify({'app':'Code','idle_seconds':300},cfg),('away',''))
        result=report.make_payload({'app':'Code','idle_seconds':0,'url':'private','title':'secret'},cfg,self.now)
        self.assertEqual(set(result),{'device','activity','app','sampled_at'})

if __name__=='__main__': unittest.main()
