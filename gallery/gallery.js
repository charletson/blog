/* ============================================================
   gallery.js — Cloud Gallery 自动轮动逻辑（无依赖）
   功能：自动轮播 / 悬停暂停 / 左右箭头 / 圆点跳转 /
        键盘 ← → / 触屏滑动 / Ken Burns 由 CSS 完成
   ============================================================ */
(function () {
  'use strict';
  var root = document.getElementById('cloudGallery');
  if (!root) return;

  var slides = Array.prototype.slice.call(root.querySelectorAll('.cg-slide'));
  var dotsWrap = root.querySelector('.cg-dots');
  var idxEl = root.querySelector('.cg-index');
  var total = slides.length;
  if (!total) return;

  var interval = parseInt(root.getAttribute('data-interval'), 10) || 4500;
  var current = 0;
  var timer = null;

  // 生成圆点
  slides.forEach(function (_, i) {
    var b = document.createElement('button');
    b.className = 'cg-dot' + (i === 0 ? ' is-active' : '');
    b.setAttribute('aria-label', '第 ' + (i + 1) + ' 张');
    b.addEventListener('click', function () { go(i); restart(); });
    dotsWrap.appendChild(b);
  });
  var dots = Array.prototype.slice.call(dotsWrap.children);

  function render() {
    slides.forEach(function (s, i) { s.classList.toggle('is-active', i === current); });
    dots.forEach(function (d, i) { d.classList.toggle('is-active', i === current); });
    if (idxEl) {
      idxEl.textContent = (current + 1);
      var t = root.querySelector('.cg-total');
      if (t) t.textContent = ' / ' + total;
    }
  }
  function go(n) { current = (n + total) % total; render(); }
  function next() { go(current + 1); }
  function prev() { go(current - 1); }
  function start() {
    if (timer) clearInterval(timer);
    timer = setInterval(next, interval);
    root.classList.remove('is-paused');
  }
  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
    root.classList.add('is-paused');
  }
  function restart() { stop(); start(); }

  root.querySelector('.cg-next').addEventListener('click', function () { next(); restart(); });
  root.querySelector('.cg-prev').addEventListener('click', function () { prev(); restart(); });

  // 悬停暂停 / 离开恢复
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);

  // 键盘左右
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { next(); restart(); }
    else if (e.key === 'ArrowLeft') { prev(); restart(); }
  });

  // 触屏滑动
  var sx = 0, sy = 0;
  root.addEventListener('touchstart', function (e) {
    var t = e.changedTouches[0]; sx = t.clientX; sy = t.clientY; stop();
  }, { passive: true });
  root.addEventListener('touchend', function (e) {
    var t = e.changedTouches[0];
    var dx = t.clientX - sx, dy = t.clientY - sy;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { dx < 0 ? next() : prev(); }
    restart();
  }, { passive: true });

  // 页面隐藏时暂停，节省资源
  document.addEventListener('visibilitychange', function () {
    document.hidden ? stop() : start();
  });

  render();
  start();
})();
