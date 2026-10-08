(() => {
  'use strict';
  const body = document.body;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const getPreference = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const setPreference = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Private mode still works for this page. */ } };
  const motionButton = document.querySelector('.motion-button');
  const applyMotion = enabled => {
    body.dataset.motion = enabled ? 'on' : 'off';
    motionButton?.setAttribute('aria-pressed', String(enabled));
    if (motionButton) motionButton.title = enabled ? '关闭飘雪动画' : '开启飘雪动画';
  };
  applyMotion(!reduced.matches && (getPreference('polar-motion') || body.dataset.motion) === 'on');
  if (reduced.matches && motionButton) { motionButton.disabled = true; motionButton.title = '已遵循系统的减少动态效果设置'; }
  reduced.addEventListener('change', event => {
    if (motionButton) motionButton.disabled = event.matches;
    applyMotion(!event.matches && (getPreference('polar-motion') || 'on') === 'on');
  });
  motionButton?.addEventListener('click', () => {
    const enabled = body.dataset.motion !== 'on';
    applyMotion(enabled); setPreference('polar-motion', enabled ? 'on' : 'off');
  });
  const menuButton = document.querySelector('.menu-button');
  const menu = document.getElementById('site-nav');
  const closeMenu = () => { menu?.classList.remove('is-open'); menuButton?.setAttribute('aria-expanded', 'false'); menuButton?.setAttribute('aria-label', '打开导航'); };
  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? '关闭导航' : '打开导航');
    menu?.classList.toggle('is-open', open);
  });
  menu?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  const dialog = document.getElementById('search-dialog');
  const input = document.getElementById('search-input');
  const status = dialog?.querySelector('.search-status');
  const results = dialog?.querySelector('.search-results');
  let searchData = null;
  let searchRequest = null;
  let searchFailed = false;
  const renderSearch = () => {
    results.replaceChildren();
    const query = input.value.trim().toLocaleLowerCase();
    if (!searchData) { status.textContent = searchFailed ? '暂时无法读取文章。请检查连接后重试。' : '正在整理手记…'; return; }
    if (!query) { status.textContent = `共 ${searchData.length} 篇手记，试试“极光”“算法”或“零”。`; return; }
    const terms = query.split(/\s+/).filter(Boolean);
    const matches = searchData.map(post => {
      const title = post.title.toLocaleLowerCase();
      const text = (post.title + ' ' + post.categories.join(' ') + ' ' + post.content).toLocaleLowerCase();
      return {post, score:terms.every(term => text.includes(term)) ? (terms.every(term => title.includes(term)) ? 2 : 1) : 0};
    }).filter(item => item.score).sort((a,b) => b.score-a.score);
    status.textContent = matches.length ? `找到 ${matches.length} 篇来信${matches.length > 30 ? '，显示前 30 篇' : ''}。` : '没有找到这句话。换个关键词试试？';
    for (const {post} of matches.slice(0,30)) {
      const link = document.createElement('a'); link.className = 'search-result'; link.href = post.url;
      const heading = document.createElement('h3'); heading.textContent = post.title.replace(/\s*<[^>]*>\s*$/, '');
      const excerpt = document.createElement('p');
      const location = post.content.toLocaleLowerCase().indexOf(terms[0]);
      excerpt.textContent = location >= 0 ? (location > 35 ? '…' : '') + post.content.slice(Math.max(0,location-35),location+105) + '…' : post.excerpt;
      link.append(heading, excerpt); results.append(link);
    }
  };
  const loadSearch = () => {
    if (searchData || searchRequest) return searchRequest;
    searchFailed = false;
    searchRequest = fetch(body.dataset.searchUrl).then(response => {
      if (!response.ok) throw new Error('Search unavailable');
      return response.json();
    }).then(data => { searchData = data; renderSearch(); }).catch(() => {
      searchFailed = true; renderSearch();
      const retry = document.createElement('button'); retry.className = 'search-retry'; retry.textContent = '重新读取 →';
      retry.addEventListener('click', () => { loadSearch(); renderSearch(); }); results.append(retry);
    }).finally(() => { searchRequest = null; });
    return searchRequest;
  };
  const openSearch = () => {
    if (!dialog || dialog.open) return;
    closeMenu(); dialog.showModal(); body.style.overflow = 'hidden'; input.focus(); loadSearch(); renderSearch();
  };
  document.querySelectorAll('[data-open-search]').forEach(button => button.addEventListener('click', openSearch));
  document.querySelector('[data-close-search]')?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('close', () => { body.style.overflow = ''; });
  dialog?.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  let debounce;
  input?.addEventListener('input', () => { clearTimeout(debounce); debounce = setTimeout(renderSearch,100); });
  document.addEventListener('keydown', event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); openSearch(); }
  });
  let progress = null;
  const updateProgress = () => {
    const article = document.getElementById('article-content');
    if (!progress || !article) return;
    const rect = article.getBoundingClientRect();
    progress.style.transform = `scaleX(${Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - innerHeight)))})`;
  };
  let ticking = false;
  addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(() => { updateProgress(); ticking = false; }); }
  }, {passive:true});
  addEventListener('resize', updateProgress);
  const initPage = () => {
  const realmButton = document.querySelector('.realm-button');
  const applyRealm = realm => {
    body.dataset.realm = realm;
    if (realmButton) { realmButton.setAttribute('aria-pressed', String(realm === 'dawn')); realmButton.innerHTML = (realm === 'dawn' ? '切换至极夜' : '切换至余光') + ' <span aria-hidden="true">◐</span>'; }
  };
  if (realmButton) {
    applyRealm(getPreference('polar-realm') === 'dawn' ? 'dawn' : 'night');
    realmButton.addEventListener('click', () => { const realm = body.dataset.realm === 'dawn' ? 'night' : 'dawn'; applyRealm(realm); setPreference('polar-realm', realm); });
  }
    progress = document.querySelector('.reading-progress');
    updateProgress();
  };
  document.addEventListener('polar:before-navigate', () => { closeMenu(); if (dialog?.open) dialog.close(); });
  document.addEventListener('polar:page', initPage);
  document.addEventListener('polar:math', updateProgress);
  const modeButton = document.querySelector('.mode-button');
  const applyMode = mode => {
    const light = mode === 'light';
    document.documentElement.dataset.mode = light ? 'light' : 'dark';
    modeButton?.setAttribute('aria-pressed', String(light));
    modeButton?.setAttribute('aria-label', light ? '切换到暮色模式' : '切换到明亮模式');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', light ? '#f3f5f7' : '#35434d');
  };
  applyMode(document.documentElement.dataset.mode);
  modeButton?.addEventListener('click', () => {
    const mode = document.documentElement.dataset.mode === 'light' ? 'dark' : 'light';
    applyMode(mode); setPreference('shotsuke-mode', mode);
  });
  initPage();
})();
