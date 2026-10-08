(() => {
  'use strict';
  // This element lives outside #main and is never replaced by navigation.
  const audio = document.getElementById('bgm');
  const radio = document.querySelector('.night-radio');
  if (!audio || !radio) return;
  const button = radio.querySelector('.bgm-toggle');
  const volume = document.getElementById('bgm-volume');
  const status = document.getElementById('bgm-status');
  const title = document.getElementById('radio-title');
  const read = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const write = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
  let wanted = read('shotsuke-bgm') !== 'off';
  const savedVolume = read('shotsuke-bgm-volume');
  if (savedVolume !== null && Number.isFinite(Number(savedVolume))) volume.value = Math.max(0, Math.min(100, Number(savedVolume)));
  audio.volume = Number(volume.value) / 100;
  const sync = () => {
    const playing = !audio.paused;
    radio.dataset.playing = String(playing);
    button.setAttribute('aria-pressed', String(playing));
    button.setAttribute('aria-label', playing ? '暂停背景音乐' : '播放背景音乐');
  };
  const gestures = ['pointerdown', 'keydown', 'touchstart'];
  const disarm = () => gestures.forEach(type => removeEventListener(type, resume, true));
  function resume(event) {
    if (event.target instanceof Element && event.target.closest('.night-radio')) return;
    disarm();
    if (wanted && audio.paused) play();
  }
  const failed = () => {
    title.textContent = '点击重试';
    status.textContent = '音乐暂时无法加载。可以点击播放重试，或前往 ghostpia 官网收听。';
    sync();
  };
  const play = async () => {
    title.textContent = '正在调频…';
    status.textContent = '正在加载音乐。';
    try {
      if (audio.error) audio.load();
      await audio.play();
      if (!wanted) { audio.pause(); return; }
      title.textContent = '雪夜电台';
      status.textContent = '正在播放 ghostpia 官网背景音乐。';
      disarm();
    } catch (error) {
      if (!wanted || error.name === 'AbortError') return;
      if (error.name === 'NotAllowedError') {
        title.textContent = '雪夜电台';
        status.textContent = '点击播放按钮或页面后开始播放。';
        gestures.forEach(type => addEventListener(type, resume, {capture:true, passive:true}));
      } else failed();
    }
    sync();
  };
  button.addEventListener('click', () => {
    disarm();
    if (!audio.paused) {
      wanted = false; write('shotsuke-bgm', 'off'); audio.pause();
    } else {
      wanted = true; write('shotsuke-bgm', 'on'); play();
    }
  });
  audio.addEventListener('play', sync);
  audio.addEventListener('pause', () => { sync(); status.textContent = '音乐已暂停。'; });
  audio.addEventListener('error', failed);
  volume.addEventListener('input', () => {
    audio.volume = Number(volume.value) / 100;
    write('shotsuke-bgm-volume', volume.value);
  });
  sync();
  if (wanted) play();
})();
