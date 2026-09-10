/* =========================================================
   CONECTOWN 2026 — animations.js
   Sistema de reveal, entrada do hero, contadores e parallax.
   Vanilla JS. Sem bibliotecas externas.
   ========================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var supportsIO = 'IntersectionObserver' in window;

  /* ---------------------------------------------------------
     1. REVEAL ON SCROLL
     Elementos ficam visíveis por padrão; o estado inicial só
     é aplicado quando html.js-anim está presente (definido no
     <head> apenas se houver suporte a IntersectionObserver).
     --------------------------------------------------------- */
  function initReveal() {
    var selector = '.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-text';
    var items = document.querySelectorAll(selector);
    if (!items.length) return;

    // Delays escalonados dentro de containers .stagger
    document.querySelectorAll('.stagger').forEach(function (group) {
      var children = group.querySelectorAll(selector);
      children.forEach(function (child, i) {
        if (!child.hasAttribute('data-delay')) {
          child.style.setProperty('--reveal-delay', (i * 90) + 'ms');
        }
      });
    });

    // Delays explícitos via data-delay
    items.forEach(function (el) {
      var d = el.getAttribute('data-delay');
      if (d) el.style.setProperty('--reveal-delay', parseInt(d, 10) + 'ms');
    });

    if (!supportsIO || reduceMotion) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.08
    });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------------------------------------------------------
     2. ENTRADA DO HERO (sequência ao carregar)
     --------------------------------------------------------- */
  function initHero() {
    var steps = document.querySelectorAll('[data-hero-step]');
    var title = document.querySelector('.hero__title');

    if (reduceMotion || !root.classList.contains('js-anim')) {
      steps.forEach(function (s) { s.classList.add('is-in'); });
      if (title) title.classList.add('is-in');
      return;
    }

    steps.forEach(function (step) {
      var order = parseInt(step.getAttribute('data-hero-step'), 10) || 1;
      // headline entra logo após o eyebrow; o resto segue em cascata
      var delay = 120 + (order - 1) * 130;
      setTimeout(function () { step.classList.add('is-in'); }, delay);
    });

    if (title) setTimeout(function () { title.classList.add('is-in'); }, 240);
  }

  /* ---------------------------------------------------------
     3. CONTADORES NUMÉRICOS
     --------------------------------------------------------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) return;

    if (reduceMotion) { el.textContent = String(target); return; }

    var duration = 1300;
    var start = null;

    function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

    function frame(now) {
      if (start === null) start = now;
      var p = Math.min((now - start) / duration, 1);
      el.textContent = String(Math.round(easeOutQuart(p) * target));
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = String(target);
    }

    el.textContent = '0';
    requestAnimationFrame(frame);
  }

  function initCounters() {
    var counters = document.querySelectorAll('[data-count]:not([data-count-plain])');
    if (!counters.length) return;

    if (!supportsIO) {
      counters.forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { observer.observe(el); });
  }

  /* ---------------------------------------------------------
     BOOT
     --------------------------------------------------------- */
  function boot() {
    initReveal();
    initHero();
    initCounters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
