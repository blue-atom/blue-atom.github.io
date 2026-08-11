(function () {
  'use strict';

  // Reveal timeline entries, the CTA block, and the stack section once each scrolls into view.
  var revealTargets = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach(function (el) { observer.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-revealed'); });
  }

  // Idle scroll cue: shows after 4s of stillness near the top, hides the instant the user scrolls.
  // Runs regardless of prefers-reduced-motion — the CSS hides only the travelling dot in that
  // case, the rail itself is still allowed to appear.
  var cue = document.getElementById('cue');
  var idleTimer;
  var armIdle = function () {
    clearTimeout(idleTimer);
    cue.classList.remove('is-idle');
    if (window.scrollY < 40) {
      idleTimer = setTimeout(function () { cue.classList.add('is-idle'); }, 4000);
    }
  };
  window.addEventListener('scroll', armIdle, { passive: true });
  armIdle();

  // Blue jay backdrop geometry: sits in the hero's right gutter on wide viewports,
  // moves behind the hero copy on narrow ones. Never hidden outright.
  var backdrop = document.getElementById('backdrop');
  var backdropImg = document.getElementById('backdropImg');
  var caption = backdrop.querySelector('.backdrop__caption');

  // Fixed constants (not the --gutter/--indent CSS custom properties): the
  // narrow/wide threshold this produces (~966px) sits well above the 640px
  // point where those tokens change, so the two systems don't interact.
  function layoutBackdrop() {
    var vw = window.innerWidth;
    var gutterStart = vw * 0.08 + 560;
    var available = vw * 0.97 - gutterStart;
    var narrow = available < 300;

    if (narrow) {
      var narrowWidth = Math.min(vw * 0.92, 560);
      backdrop.style.left = '';
      backdrop.style.right = '-6vw';
      backdrop.style.top = '9vh';
      backdrop.style.width = narrowWidth + 'px';
      backdrop.style.height = (narrowWidth * 0.76) + 'px';
      backdropImg.style.opacity = '0.2';
      caption.style.bottom = '-2px';
      caption.style.right = '9vw';
    } else {
      var wideWidth = Math.min(available, 620);
      backdrop.style.right = '';
      backdrop.style.left = gutterStart + 'px';
      backdrop.style.top = '14vh';
      backdrop.style.width = wideWidth + 'px';
      backdrop.style.height = (wideWidth * 0.76) + 'px';
      backdropImg.style.opacity = '0.5';
      caption.style.bottom = '-6px';
      caption.style.right = '4px';
    }
  }

  layoutBackdrop();
  window.addEventListener('resize', layoutBackdrop);
})();
