/* Public snapshots only. No account credentials, local device APIs, or page history. */
(function (scope) {
  'use strict';
  const HOUR = 3600000;
  const labels = { working: '工作', gaming: '打游戏', browsing: '浏览网页', using: '使用电脑', away: '离开电脑', sleeping: '睡觉', unknown: '状态不明', offline: '暂时失联' };
  const time = value => typeof value === 'string' ? Date.parse(value) : NaN;
  const fresh = (sample, now) => Number.isFinite(time(sample)) && now - time(sample) >= -60000 && now - time(sample) < HOUR;
  const age = (sample, now) => {
    if (!Number.isFinite(time(sample))) return '时间未知';
    const minutes = Math.max(0, Math.floor((now - time(sample)) / 60000));
    return minutes < 1 ? '刚刚采样' : `${minutes} 分钟前${fresh(sample, now) ? '' : ' · 已过期'}`;
  };
  function stateOf(data, now) {
    if (!data || data.version !== 1) return 'unknown';
    const manual = data.manual;
    if (manual && labels[manual.activity] && time(manual.expires_at) > now) return manual.activity;
    const computers = Object.values(data.computers || {}).filter(item => item && fresh(item.sampled_at, now) && labels[item.activity]);
    const active = computers.filter(item => item.activity !== 'away').sort((a, b) => time(b.sampled_at) - time(a.sampled_at));
    if (active.length) return active[0].activity;
    if (computers.length) return 'away';
    const health = Object.values(data.health || {}).filter(Boolean);
    // A pulse is not evidence of being awake, and old sleep records are not a live sleep signal.
    if (health.some(item => fresh(item.sampled_at, now))) return 'unknown';
    return health.length || Object.keys(data.computers || {}).length ? 'offline' : 'unknown';
  }
  function view(data, now) {
    const activity = stateOf(data, now);
    const health = data?.health || {};
    const heart = health.heart_rate;
    const steps = health.steps;
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(now));
    const validHeart = Number.isInteger(heart?.value) && heart.value >= 20 && heart.value <= 250;
    const validSteps = Number.isInteger(steps?.value) && steps.value >= 0 && steps.value <= 200000;
    const result = {
      activity, title: '小㊗️正在：' + labels[activity],
      heart: validHeart ? `${heart.value} 次/分` : '暂无数据',
      heartTime: validHeart ? age(heart.sampled_at, now) : '',
      steps: validSteps && steps.date === today ? steps.value.toLocaleString('zh-CN') + ' 步' : '今日暂无数据',
      stepsTime: validSteps && steps.date === today ? age(steps.sampled_at, now) : '',
      devices: {}
    };
    for (const name of ['mac', 'windows']) {
      const item = data?.computers?.[name];
      const valid = item && fresh(item.sampled_at, now);
      result.devices[name] = {
        text: !item ? '尚未上报' : !valid ? '已过期' : item.activity === 'away' ? '离开电脑' : String(item.app || '应用未知').slice(0, 80),
        detail: item ? `${valid ? (labels[item.activity] || '状态不明') + ' · ' : ''}${age(item.sampled_at, now)}` : ''
      };
    }
    return result;
  }
  if (typeof module === 'object' && module.exports) module.exports = { fresh, stateOf, view };
  if (!scope.document) return;
  const root = document.querySelector('[data-presence]');
  if (!root) return;
  const button = root.querySelector('button');
  const panel = root.querySelector('.presence-card');
  let snapshot = null, pinned = false, fetching = false, unavailable = false;
  function open(value) {
    panel.hidden = !value;
    button.setAttribute('aria-expanded', String(value));
  }
  root.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') open(true); });
  root.addEventListener('pointerleave', () => { if (!pinned && !root.contains(document.activeElement)) open(false); });
  button.addEventListener('focus', () => open(true));
  button.addEventListener('click', () => { pinned = !pinned; open(pinned); });
  root.addEventListener('focusout', event => { if (!root.contains(event.relatedTarget)) { pinned = false; open(false); } });
  document.addEventListener('pointerdown', event => { if (!root.contains(event.target)) { pinned = false; open(false); } });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { pinned = false; open(false); } });
  window.addEventListener('scroll', () => { pinned = false; open(false); }, { passive: true });
  function cell(selector, text, detail) {
    const element = root.querySelector(selector);
    element.replaceChildren(document.createTextNode(text));
    if (detail) { const small = document.createElement('small'); small.textContent = detail; element.append(small); }
  }
  function render() {
    const model = view(snapshot, Date.now());
    root.dataset.state = model.activity;
    root.querySelector('.presence-title').textContent = model.title;
    button.setAttribute('aria-label', model.title + '；查看近况');
    cell('[data-presence-heart]', model.heart, model.heartTime);
    cell('[data-presence-steps]', model.steps, model.stepsTime);
    for (const [name, item] of Object.entries(model.devices)) cell('[data-presence-' + name + ']', item.text, item.detail);
    root.querySelector('[data-presence-note]').textContent = unavailable ? '暂未取得新数据；以上保留原采样时间。' : '约每 10 分钟更新，超过 1 小时标记过期。';
  }
  async function refresh() {
    render();
    if (fetching || document.hidden) return;
    fetching = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const url = new URL(root.dataset.url, location.href);
      url.searchParams.set('t', String(Math.floor(Date.now() / 60000)));
      const response = await fetch(url, { cache: 'no-store', credentials: 'omit', signal: controller.signal });
      if (!response.ok) throw new Error('Snapshot unavailable');
      const text = await response.text();
      if (text.length > 16384) throw new Error('Snapshot too large');
      const next = JSON.parse(text);
      if (next.version !== 1) throw new Error('Unsupported snapshot');
      snapshot = next; unavailable = false;
    } catch { unavailable = true; }
    finally { clearTimeout(timeout); fetching = false; render(); }
  }
  refresh();
  setInterval(refresh, 60000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
})(typeof window !== 'undefined' ? window : globalThis);
