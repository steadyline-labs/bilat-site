/* Tema seçimi: ?tema=a|b|c|saat > kayıtlı tercih > sistem (açık: B, koyu: C). Senkron yüklenir, ilk boyamadan önce çalışır. */
(function () {
  var KEY = 'bilat-tema', root = document.documentElement;
  function byHour() { var h = new Date().getHours(); return (h >= 6 && h < 8) || (h >= 17 && h < 20) ? 'a' : (h >= 8 && h < 17) ? 'b' : 'c'; }
  function apply(pref) {
    if (pref === 'a' || pref === 'b' || pref === 'c') root.setAttribute('data-theme', pref);
    else if (pref === 'saat') root.setAttribute('data-theme', byHour());
    else root.removeAttribute('data-theme');
    root.setAttribute('data-tema-tercih', pref || 'sistem');
    // iOS Safari tints the status bar with theme-color: keep it in step with a manually chosen sky
    var sky = { a: '#3B2F63', b: '#62B0E6', c: '#070D26' }[root.getAttribute('data-theme')];
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) {
      if (!m.hasAttribute('data-media')) m.setAttribute('data-media', m.getAttribute('media') || '');
      if (sky) { m.setAttribute('content', sky); m.removeAttribute('media'); }
      else { m.setAttribute('content', m.getAttribute('data-media').indexOf('dark') > -1 ? '#070D26' : '#62B0E6'); m.setAttribute('media', m.getAttribute('data-media')); }
    });
  }
  var q = new URLSearchParams(location.search).get('tema'), saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  apply(q || saved);
  document.addEventListener('DOMContentLoaded', function () {
    var btns = document.querySelectorAll('[data-tema]');
    function sync() { var cur = root.getAttribute('data-tema-tercih'); btns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-tema') === cur)); }); }
    btns.forEach(function (b) { b.addEventListener('click', function () { var v = b.getAttribute('data-tema'); try { v === 'sistem' ? localStorage.removeItem(KEY) : localStorage.setItem(KEY, v); } catch (e) {} apply(v); sync(); }); });
    sync();
  });
})();
