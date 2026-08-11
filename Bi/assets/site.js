/* 全站统一：日夜切换 + 图标同步
   无闪烁初始化在 <head> 内联（见注入脚本）；本文件仅负责按钮交互与图标。 */
(function () {
  var SUN = '☀️';   // 浅色时显示（点击去夜晚）
  var MOON = '\u{1F319}'; // 深色时显示（点击去白天）

  function btn() { return document.querySelector('.theme-toggle'); }

  function applyIcon() {
    var b = btn();
    if (!b) return;
    var t = document.documentElement.getAttribute('data-theme');
    var isLight = t === 'light';
    var ico = b.querySelector('.ico');
    if (ico) ico.textContent = isLight ? SUN : MOON;
    var label = isLight ? '切换到夜晚' : '切换到白天';
    b.setAttribute('aria-label', label);
    b.title = label;
  }

  function toggle() {
    var cur = document.documentElement.getAttribute('data-theme');
    var next = cur === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    applyIcon();
  }

  function init() {
    var b = btn();
    if (!b) return;
    applyIcon();
    b.addEventListener('click', toggle);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
