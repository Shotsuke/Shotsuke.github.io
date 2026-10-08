(() => {
  'use strict';
  if (!window.fetch || !window.DOMParser || !history.pushState) return;
  const root = document.documentElement;
  const status = document.getElementById('navigation-status');
  const positions = new Map();
  let controller;
  let sequence = 0;
  let activeKey = history.state?.polarKey || crypto.randomUUID();
  let renderedURL = new URL(location.href);
  history.replaceState({...history.state, polarKey:activeKey}, '', location.href);
  history.scrollRestoration = 'manual';
  const remember = () => positions.set(activeKey, {x:scrollX, y:scrollY});
  addEventListener('scroll', remember, {passive:true});
  const sameDocument = url => url.pathname === renderedURL.pathname && url.search === renderedURL.search;
  const targetFor = url => {
    try { return url.hash ? document.getElementById(decodeURIComponent(url.hash.slice(1))) : null; }
    catch { return null; }
  };
  const restore = (url, position) => {
    const target = targetFor(url);
    if (position) scrollTo({left:position.x, top:position.y, behavior:'instant'});
    else if (target) target.scrollIntoView({behavior:'instant'});
    else scrollTo({top:0, left:0, behavior:'instant'});
  };
  const focusContent = url => {
    const target = targetFor(url) || document.getElementById('main');
    if (!target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1');
      target.addEventListener('blur', () => target.removeAttribute('tabindex'), {once:true});
    }
    target.focus({preventScroll:true});
  };
  const navigate = async (url, {pop=false, key=null} = {}) => {
    const id = ++sequence;
    controller?.abort();
    controller = new AbortController();
    const request = controller;
    const signal = request.signal;
    remember();
    const position = pop ? positions.get(key) : null;
    document.dispatchEvent(new Event('polar:before-navigate'));
    const commitHistory = () => {
      activeKey = key || crypto.randomUUID();
      if (!pop) history.pushState({polarKey:activeKey}, '', url.href);
      else if (!key) history.replaceState({...history.state, polarKey:activeKey}, '', url.href);
      renderedURL = url;
    };
    if (sameDocument(url)) {
      root.removeAttribute('data-navigating');
      document.getElementById('main').removeAttribute('aria-busy');
      status.textContent = '';
      commitHistory(); restore(url, position); focusContent(url); return;
    }
    root.dataset.navigating = 'true';
    document.getElementById('main').setAttribute('aria-busy', 'true');
    status.textContent = '正在翻页…';
    const timeout = setTimeout(() => request.abort(), 15000);
    try {
      const response = await fetch(url.href, {signal, headers:{Accept:'text/html'}});
      if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) throw new Error('Not a page');
      if (response.redirected) { location.assign(response.url); return; }
      const page = new DOMParser().parseFromString(await response.text(), 'text/html');
      const next = page.getElementById('main');
      if (!next || page.documentElement.dataset.polarShell !== root.dataset.polarShell) throw new Error('Different layout');
      // Pages with their own scripts retain normal document loading semantics.
      if ([...next.querySelectorAll('script')].some(script => script.src || !/^(math\/tex(?:;.*)?|application\/(?:ld\+)?json)$/i.test(script.type))) throw new Error('Page-specific scripts');
      if (id !== sequence) return;
      commitHistory();
      document.getElementById('main').replaceWith(document.importNode(next, true));
      document.title = page.title;
      document.body.className = page.body.className;
      document.body.dataset.math = page.body.dataset.math;
      for (const selector of ['meta[name="description"]', 'link[rel="canonical"]']) {
        const incoming = page.querySelector(selector);
        const current = document.querySelector(selector);
        if (incoming && current) current.replaceWith(document.importNode(incoming, true));
      }
      const nav = page.getElementById('site-nav');
      for (const link of document.querySelectorAll('#site-nav a')) {
        const incoming = [...nav.querySelectorAll('a')].find(item => item.getAttribute('href') === link.getAttribute('href'));
        if (incoming?.hasAttribute('aria-current')) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      }
      document.dispatchEvent(new Event('polar:page'));
      focusContent(url); restore(url, position);
      const initialScroll = scrollY;
      window.PolarMath?.render().then(() => {
        // Reposition after formula layout only if the reader has not scrolled.
        if (id === sequence && Math.abs(scrollY - initialScroll) < 2 && (position || url.hash)) restore(url, position);
      });
      status.textContent = document.title;
    } catch {
      if (id === sequence) location.assign(url.href);
    } finally {
      clearTimeout(timeout);
      if (id === sequence) {
        root.removeAttribute('data-navigating');
        document.getElementById('main').removeAttribute('aria-busy');
      }
    }
  };
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest?.('a[href]');
    if (!link || link.hasAttribute('download') || link.hasAttribute('data-no-pjax') || (link.target && link.target !== '_self')) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || !/^https?:$/.test(url.protocol)) return;
    if (!url.pathname.endsWith('/') && !/\.html?$/.test(url.pathname)) return;
    event.preventDefault();
    if (url.href === location.href && sameDocument(url)) {
      // Cancel an in-flight destination if the reader chooses the current page.
      ++sequence; controller?.abort();
      root.removeAttribute('data-navigating');
      document.getElementById('main').removeAttribute('aria-busy');
      document.dispatchEvent(new Event('polar:before-navigate'));
      status.textContent = '';
      restore(url); return;
    }
    navigate(url);
  });
  addEventListener('popstate', event => navigate(new URL(location.href), {pop:true, key:event.state?.polarKey}));
})();
