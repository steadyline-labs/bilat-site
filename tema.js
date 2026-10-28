/* Tema seçimi: ?tema=a|b|c|saat > kayıtlı tercih > koyu mod ise gece > saate göre (oyundaki gibi). Senkron yüklenir, ilk boyamadan önce çalışır. */
(function () {
  var KEY = 'bilat-tema', root = document.documentElement;
  var NAMES = { a: 'Gün batımı', b: 'Gündüz', c: 'Gece' };
  var darkQ = window.matchMedia ? matchMedia('(prefers-color-scheme: dark)') : null;
  function byHour() { var h = new Date().getHours(); return (h >= 6 && h < 8) || (h >= 17 && h < 20) ? 'a' : (h >= 8 && h < 17) ? 'b' : 'c'; }
  // Otomatik: cihaz koyu moddaysa gece, değilse saate göre
  function auto() { return darkQ && darkQ.matches ? 'c' : byHour(); }
  function apply(pref) {
    if (pref !== 'a' && pref !== 'b' && pref !== 'c') pref = 'saat';
    root.setAttribute('data-theme', pref === 'saat' ? auto() : pref);
    root.setAttribute('data-tema-tercih', pref);
    // iOS Safari tints the status bar with theme-color: keep it in step with the active sky
    var sky = { a: '#3B2F63', b: '#62B0E6', c: '#070D26' }[root.getAttribute('data-theme')];
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) { m.setAttribute('content', sky); m.removeAttribute('media'); });
  }
  var q = new URLSearchParams(location.search).get('tema'), saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  apply(q || saved);
  document.addEventListener('DOMContentLoaded', function () {
    var btns = document.querySelectorAll('[data-tema]');
    var pick = document.querySelector('.sky-pick');
    var toggle = pick && pick.querySelector('.sky-btn');
    var menu = pick && pick.querySelector('.sky-menu');
    function sync() {
      var cur = root.getAttribute('data-tema-tercih'), now = NAMES[root.getAttribute('data-theme')];
      btns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-tema') === cur)); });
      var label = cur === 'saat' ? 'Otomatik' : NAMES[cur];
      document.querySelectorAll('.sky-name').forEach(function (n) { n.textContent = label; });
      document.querySelectorAll('.sky-now').forEach(function (n) { n.textContent = now; });
      if (toggle) toggle.setAttribute('aria-label', 'Gökyüzü teması: ' + label + (cur === 'saat' ? ', şu an ' + now : ''));
    }
    function open(v) {
      if (!menu) return;
      menu.hidden = !v;
      toggle.setAttribute('aria-expanded', String(v));
      if (v) (menu.querySelector('[aria-pressed="true"]') || menu.querySelector('button')).focus();
    }
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var v = b.getAttribute('data-tema');
        try { localStorage.setItem(KEY, v); } catch (e) {}
        apply(v); sync();
        if (menu && menu.contains(b)) { open(false); toggle.focus(); }
      });
    });
    if (toggle) {
      toggle.addEventListener('click', function () { open(menu.hidden); });
      document.addEventListener('click', function (e) { if (!menu.hidden && !pick.contains(e.target)) open(false); });
      pick.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !menu.hidden) { open(false); toggle.focus(); }
      });
      pick.addEventListener('focusout', function (e) { if (!menu.hidden && e.relatedTarget && !pick.contains(e.relatedTarget)) open(false); });
    }
    sync();
    if (darkQ && darkQ.addEventListener) darkQ.addEventListener('change', function () {
      if (root.getAttribute('data-tema-tercih') === 'saat') { apply('saat'); sync(); }
    });
  });
})();
