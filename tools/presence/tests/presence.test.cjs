const {test}=require('node:test');
const assert=require('node:assert/strict');
const {fresh,stateOf,view}=require('../../../themes/polar-night/source/js/presence.js');
const now=Date.parse('2026-10-08T04:00:00Z');
const ago=m=>new Date(now-m*60000).toISOString();
test('one-hour expiry is per sample, never publication time',()=>{
 const data={version:1,generated_at:ago(0),health:{heart_rate:{value:75,sampled_at:ago(61)}}};
 assert.equal(stateOf(data,now),'offline');
 assert.equal(fresh(ago(60),now),false);
 assert.match(view(data,now).heartTime,/已过期/);
});
test('fresh pulse never implies awake or asleep',()=>{
 assert.equal(stateOf({version:1,health:{heart_rate:{value:75,sampled_at:ago(1)}}},now),'unknown');
});
test('fresh active device wins over an idle device',()=>{
 assert.equal(stateOf({version:1,computers:{mac:{activity:'working',sampled_at:ago(5)},windows:{activity:'away',sampled_at:ago(1)}}},now),'working');
});
test('manual status expires and future computer time is rejected',()=>{
 const data={version:1,manual:{activity:'sleeping',expires_at:ago(0)},computers:{mac:{activity:'gaming',sampled_at:ago(-10)}}};
 assert.equal(stateOf(data,now),'offline');
 data.manual.expires_at=ago(-5);assert.equal(stateOf(data,now),'sleeping');
});
test('Shanghai midnight hides yesterday steps, including a fresh zero',()=>{
 const data={version:1,health:{steps:{value:0,date:'2026-10-08',sampled_at:ago(1)}}};
 assert.equal(view(data,now).steps,'0 步');
 assert.equal(view(data,Date.parse('2026-10-08T16:01:00Z')).steps,'今日暂无数据');
});
test('expired computers do not expose old app as current',()=>{
 const data={version:1,computers:{mac:{activity:'working',app:'Code',sampled_at:ago(60)}}};
 assert.equal(view(data,now).devices.mac.text,'已过期');
});
