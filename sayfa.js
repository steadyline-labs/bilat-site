/* İçerik sayfaları: mağaza yönlendirme, alt indirme barı, mod sekmeleri, içindekiler. */
(function () {
  var ua = navigator.userAgent || '';
  var ios = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var android = /Android/i.test(ua);
  var dl = document.getElementById('indir');
  var gp = dl && dl.querySelector('.gp-badge'), as = dl && dl.querySelector('.as-badge');
  function goTo(el) {
    if (!el) return;
    var top = el.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }
  // Android: Google Play, iPhone/iPad: App Store, masaüstü: iki mağazanın da olduğu indirme bölümü
  document.querySelectorAll('[data-dl]').forEach(function (a) {
    if (android && gp) a.href = gp.href;
    else if (ios && as) a.href = as.href;
    else a.addEventListener('click', function (e) { e.preventDefault(); goTo(dl); });
  });
  // Dar ekranda kaydırınca alttan indirme barı
  var bar = document.querySelector('.gx-bar');
  if (bar) {
    var limit = +bar.getAttribute('data-after') || 480;
    var onScroll = function () { bar.classList.toggle('on', window.scrollY > limit); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  // Oyun modları sekmeleri (dar ekran)
  document.querySelectorAll('.gx-modes').forEach(function (m) {
    var tabs = document.querySelectorAll('[data-tab]');
    tabs.forEach(function (b) {
      b.addEventListener('click', function () {
        m.setAttribute('data-on', b.getAttribute('data-tab'));
        tabs.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      });
    });
  });
  // İçindekiler: Kaynaklar bağlantısı açılır bölümü de açar
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    var id = a.getAttribute('href').slice(1);
    if (!id || a.hasAttribute('data-dl')) return;
    a.addEventListener('click', function (e) {
      var el = document.getElementById(id);
      if (!el || a.classList.contains('skip')) return;
      e.preventDefault();
      if (el.tagName === 'DETAILS') el.open = true;
      goTo(el);
      if (history.replaceState) history.replaceState(null, '', '#' + id);
    });
  });
  if (location.hash === '#kaynaklar') { var k = document.getElementById('kaynaklar'); if (k && k.tagName === 'DETAILS') k.open = true; }
})();
