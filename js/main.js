/* =========================================================
   CONECTOWN 2026 — main.js
   Header, menu mobile, scrollspy, countdown e entrada do
   botão de WhatsApp. Vanilla JS, sem bibliotecas.
   ========================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     1. HEADER — estado ao rolar
     --------------------------------------------------------- */
  function initHeader() {
    var header = document.querySelector('[data-header]');
    if (!header) return;

    var ticking = false;

    function update() {
      header.classList.toggle('is-scrolled', window.scrollY > 40);
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });

    update();
  }

  /* ---------------------------------------------------------
     2. MENU MOBILE
     --------------------------------------------------------- */
  function initMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var nav = document.getElementById('nav-principal');
    var backdrop = document.querySelector('[data-menu-backdrop]');
    if (!toggle || !nav) return;

    var isOpen = false;
    var lastFocused = null;

    function open() {
      isOpen = true;
      lastFocused = document.activeElement;
      nav.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Fechar menu de navegação');
      document.body.classList.add('is-locked');
      if (backdrop) { backdrop.hidden = false; requestAnimationFrame(function () { backdrop.classList.add('is-open'); }); }
      var first = nav.querySelector('a');
      if (first) first.focus({ preventScroll: true });
    }

    function close() {
      if (!isOpen) return;
      isOpen = false;
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menu de navegação');
      document.body.classList.remove('is-locked');
      if (backdrop) {
        backdrop.classList.remove('is-open');
        setTimeout(function () { if (!isOpen) backdrop.hidden = true; }, 300);
      }
      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus({ preventScroll: true });
      }
    }

    toggle.addEventListener('click', function () { isOpen ? close() : open(); });
    if (backdrop) backdrop.addEventListener('click', close);

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) close();

      // Focus trap simples enquanto o menu estiver aberto
      if (e.key === 'Tab' && isOpen) {
        var focusables = nav.querySelectorAll('a[href], button:not([disabled])');
        if (!focusables.length) return;
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    // Fecha o menu se a viewport voltar ao desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1100 && isOpen) close();
    });
  }

  /* ---------------------------------------------------------
     3. LINKS PARA O TOPO
     O hero fica sob o header fixo; rolar até ele deixaria a página
     alguns pixels abaixo de zero. Estes links vão ao topo absoluto.
     --------------------------------------------------------- */
  function initTopLinks() {
    document.querySelectorAll('a[href="#inicio"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduz ? 'auto' : 'smooth' });
        if (history.replaceState) history.replaceState(null, '', '#inicio');
      });
    });
  }

  /* ---------------------------------------------------------
     4. SCROLLSPY — link ativo na navegação
     --------------------------------------------------------- */
  function initScrollSpy() {
    if (!('IntersectionObserver' in window)) return;

    var links = Array.prototype.slice.call(document.querySelectorAll('.nav__link[href^="#"]'));
    if (!links.length) return;

    var map = {};
    var sections = [];

    links.forEach(function (link) {
      var id = link.getAttribute('href').slice(1);
      var section = document.getElementById(id);
      if (!section) return;
      map[id] = link;
      sections.push(section);
    });

    if (!sections.length) return;

    var visible = {};

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visible[entry.target.id] = entry.isIntersecting ? entry.intersectionRatio : 0;
      });

      var bestId = null;
      var bestRatio = 0;
      Object.keys(visible).forEach(function (id) {
        if (visible[id] > bestRatio) { bestRatio = visible[id]; bestId = id; }
      });

      links.forEach(function (l) { l.classList.remove('is-active'); });
      if (bestId && map[bestId]) map[bestId].classList.add('is-active');
    }, {
      rootMargin: '-30% 0px -45% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    });

    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ---------------------------------------------------------
     5. COUNTDOWN
     Data oficial de início: 07/11/2026, 08h (horário de Brasília).
     Corrige o alvo incorreto do site anterior (06/11 18h).
     --------------------------------------------------------- */
  function initCountdown() {
    var box = document.querySelector('[data-countdown]');
    if (!box) return;

    var target = new Date(box.getAttribute('data-countdown')).getTime();
    if (isNaN(target)) return;

    var fields = {
      days: box.querySelector('[data-cd="days"]'),
      hours: box.querySelector('[data-cd="hours"]'),
      minutes: box.querySelector('[data-cd="minutes"]'),
      seconds: box.querySelector('[data-cd="seconds"]')
    };
    var grid = box.querySelector('.countdown__grid');
    var done = box.querySelector('[data-cd-done]');
    var timer = null;

    function pad(n) { return n < 10 ? '0' + n : String(n); }

    function tick() {
      var diff = target - Date.now();

      if (diff <= 0) {
        if (timer) clearInterval(timer);
        if (grid) grid.hidden = true;
        if (done) done.hidden = false;
        return;
      }

      var s = Math.floor(diff / 1000);
      var d = Math.floor(s / 86400);
      var h = Math.floor((s % 86400) / 3600);
      var m = Math.floor((s % 3600) / 60);
      var sec = s % 60;

      if (fields.days) fields.days.textContent = String(d);
      if (fields.hours) fields.hours.textContent = pad(h);
      if (fields.minutes) fields.minutes.textContent = pad(m);
      if (fields.seconds) fields.seconds.textContent = pad(sec);
    }

    tick();
    timer = setInterval(tick, 1000);

    // Pausa o timer quando a aba não está visível (economia de recursos)
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        if (timer) { clearInterval(timer); timer = null; }
      } else if (!timer) {
        tick();
        timer = setInterval(tick, 1000);
      }
    });
  }

  /* ---------------------------------------------------------
     5. BOTÃO DE WHATSAPP — entrada suave
     --------------------------------------------------------- */
  function initWhatsApp() {
    var wa = document.querySelector('[data-wa]');
    if (!wa) return;
    setTimeout(function () { wa.classList.add('is-in'); }, 900);
  }

  /* ---------------------------------------------------------
     BOOT
     --------------------------------------------------------- */
  function boot() {
    initHeader();
    initMenu();
    initTopLinks();
    initScrollSpy();
    initCountdown();
    initWhatsApp();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
