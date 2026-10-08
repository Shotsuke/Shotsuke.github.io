const {test} = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../source/js/navigation.js'), 'utf8');

// Unit tests for navigation's browser boundary; visual/media checks run separately.
function harness() {
  const handlers = {};
  const requests = [];
  const fallbacks = [];
  const commits = [];
  const location = {href:'https://example.test/', origin:'https://example.test', assign:url => fallbacks.push(url)};
  const audio = {paused:false, currentTime:42};
  const root = {dataset:{polarShell:'1'}, removeAttribute(){}};
  const status = {};
  const main = () => ({isConnected:true, setAttribute(){}, removeAttribute(){}, hasAttribute:()=>true, focus(){}, addEventListener(){},
    querySelectorAll:() => [], replaceWith(next){ current.isConnected = false; current = next; }});
  let current = main();
  const document = {
    documentElement:root, body:{className:'', dataset:{}}, title:'Home',
    getElementById:id => id === 'main' ? current : id === 'navigation-status' ? status : id === 'bgm' ? audio : null,
    querySelector:()=>null, querySelectorAll:()=>[], importNode:node=>node,
    addEventListener:(name,handler)=>{handlers[name]=handler;}, dispatchEvent(){}
  };
  const history = {state:null,
    replaceState(state, _, url){this.state=state;location.href=url;},
    pushState(state, _, url){this.state=state;location.href=url;commits.push(url);}
  };
  let uid = 0;
  const context = {
    document, location, history, URL, Event, AbortController, console,
    crypto:{randomUUID:()=>String(++uid)}, scrollX:0, scrollY:0,
    scrollTo(){}, setTimeout:()=>1, clearTimeout(){},
    addEventListener:(name,handler)=>{handlers[name]=handler;},
    fetch:(url,options)=>new Promise(resolve=>requests.push({url,options,resolve})),
    DOMParser:class {parseFromString(text){
      const page = JSON.parse(text);
      const next = main();
      next.querySelectorAll = selector => selector === 'script' ? page.scripts || [] : [];
      return {title:page.title, documentElement:root, body:{className:'reading-page', dataset:{math:'true'}},
        getElementById:id=>id === 'main' ? next : {querySelectorAll:()=>[]}, querySelector:()=>null};
    }},
    PolarMath:{render:()=>Promise.resolve()}
  };
  context.window = context;
  vm.runInNewContext(source, context);
  const click = (href, options={}) => {
    let prevented = false;
    const link = {href,target:options.target || '',hasAttribute:name=>name === 'download' && options.download};
    handlers.click({button:0, ...options,target:{closest:()=>link},preventDefault(){prevented=true;}});
    return prevented;
  };
  const respond = async (index, page) => {
    requests[index].resolve({ok:true,headers:{get:()=> 'text/html'},text:async()=>JSON.stringify(page)});
    await new Promise(setImmediate);
  };
  return {click, respond, requests, fallbacks, commits, document, audio};
}

test('legacy TeX data blocks navigate without reloading or touching the player', async () => {
  const h = harness();
  assert.equal(h.click('https://example.test/course/'), true);
  await h.respond(0,{title:'Course',scripts:[{type:'math/tex; mode=display',src:''}]});
  assert.equal(h.document.title,'Course');
  assert.deepEqual(h.fallbacks,[]);
  assert.strictEqual(h.document.getElementById('bgm'),h.audio);
  assert.deepEqual(h.audio,{paused:false,currentTime:42});
});

test('executable page scripts retain full-document loading', async () => {
  const h = harness();
  h.click('https://example.test/interactive/');
  await h.respond(0,{title:'Interactive',scripts:[{type:'module',src:''}]});
  assert.deepEqual(h.fallbacks,['https://example.test/interactive/']);
  assert.deepEqual(h.commits,[]);
});

test('a stale response cannot replace a newer destination', async () => {
  const h = harness();
  h.click('https://example.test/first/');
  h.click('https://example.test/second/');
  assert.equal(h.requests[0].options.signal.aborted,true);
  await h.respond(1,{title:'Second'});
  await h.respond(0,{title:'First'});
  assert.equal(h.document.title,'Second');
  assert.deepEqual(h.commits,['https://example.test/second/']);
  assert.deepEqual(h.fallbacks,[]);
});

test('external links, downloads, modified clicks and new tabs stay native', () => {
  const h = harness();
  for (const [url, options] of [
    ['https://elsewhere.test/',{}], ['https://example.test/file.pdf',{}],
    ['https://example.test/',{download:true}], ['https://example.test/',{metaKey:true}],
    ['https://example.test/',{ctrlKey:true}], ['https://example.test/',{target:'_blank'}]
  ]) assert.equal(h.click(url,options),false);
  assert.equal(h.requests.length,0);
});

test('returning to the current page cancels a pending destination', async () => {
  const h = harness();
  h.click('https://example.test/other/');
  h.click('https://example.test/');
  assert.equal(h.requests[0].options.signal.aborted,true);
  await h.respond(0,{title:'Other'});
  assert.equal(h.document.title,'Home');
  assert.deepEqual(h.commits,[]);
  assert.deepEqual(h.fallbacks,[]);
});
