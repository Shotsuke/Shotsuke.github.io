(() => {
  'use strict';
  let loading;
  let queue = Promise.resolve();
  window.MathJax = {
    tex: {inlineMath:[['$','$'],['\\(','\\)']], displayMath:[['$$','$$'],['\\[','\\]']], processEscapes:true},
    svg: {fontCache:'global'},
    options: {skipHtmlTags:['script','noscript','style','textarea','pre','code']},
    startup: {typeset:false}
  };
  const load = () => {
    if (!loading) loading = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = document.body.dataset.mathSrc;
      script.onload = () => window.MathJax.startup.promise.then(resolve, reject);
      script.onerror = () => { script.remove(); loading = null; reject(new Error('MathJax unavailable')); };
      document.head.append(script);
    });
    return loading;
  };
  const render = () => {
    const main = document.getElementById('main');
    const enabled = document.body.dataset.math === 'true';
    queue = queue.catch(() => {}).then(async () => {
      if (!main.isConnected) return;
      if (enabled) {
        // Kramed also emits legacy math/tex data blocks; MathJax 3 needs delimiters.
        for (const script of main.querySelectorAll('script[type^="math/tex"]')) {
          const display = script.type.includes('mode=display');
          script.replaceWith(document.createTextNode((display ? '\\[' : '\\(') + script.textContent + (display ? '\\]' : '\\)')));
        }
        await load();
      }
      if (!main.isConnected) return;
      window.MathJax.typesetClear?.();
      if (enabled) await window.MathJax.typesetPromise([main]);
      if (main.isConnected) document.dispatchEvent(new Event('polar:math'));
    }).catch(error => console.warn('公式暂时无法排版：', error.message));
    return queue;
  };
  window.PolarMath = {render};
  render();
})();
