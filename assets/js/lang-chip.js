/* Chip de idioma: abre/cierra el menú y conserva el #ancla de la sección en la que está el visitante */
(function () {
  'use strict';
  function close() {
    document.querySelectorAll('.lang-dropdown.open').forEach(function (d) {
      d.classList.remove('open');
      var b = d.previousElementSibling; if (b && b.setAttribute) b.setAttribute('aria-expanded', 'false');
    });
  }
  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('[data-lang-chip] .lang-btn') : null;
    if (btn) {
      e.preventDefault(); e.stopPropagation();
      var dd = btn.nextElementSibling, was = dd.classList.contains('open');
      close();
      if (!was) { dd.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
      return;
    }
    var opt = e.target.closest ? e.target.closest('[data-lang-chip] .lang-option') : null;
    if (opt && location.hash) { opt.setAttribute('href', opt.getAttribute('href').split('#')[0] + location.hash); return; }
    close();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
})();
