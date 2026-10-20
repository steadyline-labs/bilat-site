/* Tema seçimi: ?tema=a|b|c|saat > kayıtlı tercih > sistem (açık: B, koyu: C). Senkron yüklenir, ilk boyamadan önce çalışır. */
(function () {
  var KEY = 'bilat-tema', root = document.documentElement;
  function byHour() { var h = new Date().getHours(); return (h >= 6 && h < 8) || (h >= 17 && h < 20) ? 'a' : (h >= 8 && h < 17) ? 'b' : 'c'; }
  function apply(pref) {
    if (pref === 'a' || pref === 'b' || pref === 'c') root.setAttribute('data-theme', pref);
    else if (pref === 'saat') root.setAttribute('data-theme', byHour());
    else root.removeAttribute('data-theme');
    root.setAttribute('data-tema-tercih', pref || 'sistem');
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
