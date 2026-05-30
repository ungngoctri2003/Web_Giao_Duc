(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initScrollReveal() {
    var items = document.querySelectorAll('.reveal:not(.is-visible), .reveal-scale:not(.is-visible)');
    if (!items.length) return;

    if (prefersReduced || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    items.forEach(function (el) { observer.observe(el); });
  }

  function initLessonSidebar() {
    var sidebar = document.querySelector('.lesson-nav');
    if (!sidebar) return;

    var links = sidebar.querySelectorAll('a[href^="#"]');
    var sections = [];

    links.forEach(function (link) {
      var id = link.getAttribute('href').slice(1);
      var section = document.getElementById(id);
      if (section) sections.push({ link: link, section: section });
    });

    if (!sections.length) return;

    function setActive(id) {
      links.forEach(function (l) {
        l.classList.toggle('active', l.getAttribute('href') === '#' + id);
      });
    }

    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.getElementById(link.getAttribute('href').slice(1));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setActive(link.getAttribute('href').slice(1));
        }
      });
    });

    if ('IntersectionObserver' in window) {
      var sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      }, { threshold: 0.35, rootMargin: '-20% 0px -55% 0px' });

      sections.forEach(function (s) { sectionObserver.observe(s.section); });
    }
  }

  function initChalkTyping() {
    var el = document.querySelector('.math-line');
    if (!el || prefersReduced) return;

    var text = el.textContent.trim();
    el.textContent = '';
    el.classList.add('typing');

    var i = 0;
    var speed = 38;

    function type() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        el.classList.add('done');
      }
    }

    setTimeout(type, 600);
  }

  function initStatCounters() {
    var stats = document.querySelectorAll('[data-count]');
    if (!stats.length) return;

    function animateCounter(el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      if (prefersReduced || isNaN(target)) {
        el.textContent = target + suffix;
        return;
      }

      var duration = 1200;
      var start = 0;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.floor(start + (target - start) * eased);
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
    }

    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      stats.forEach(function (s) { obs.observe(s); });
    } else {
      stats.forEach(animateCounter);
    }
  }

  function initButtonRipple() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.btn');
      if (!btn || prefersReduced) return;

      var rect = btn.getBoundingClientRect();
      var ripple = document.createElement('span');
      ripple.className = 'ripple';
      var size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', function () { ripple.remove(); });
    });
  }

  function initResultAnimations() {
    var score = document.querySelector('.score-circle');
    var report = document.querySelector('.report-band');
    if (score) score.classList.add('is-animated');
    if (report) report.classList.add('is-animated');
  }

  function animateExamQuestion(card) {
    if (!card || prefersReduced) return;
    card.classList.remove('is-entering');
    void card.offsetWidth;
    card.classList.add('is-entering');
  }

  function refreshReveal() {
    initScrollReveal();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initScrollReveal();
    initLessonSidebar();
    initChalkTyping();
    initStatCounters();
    initButtonRipple();
  });

  window.MathUpUI = {
    refreshReveal: refreshReveal,
    initLessonSidebar: initLessonSidebar,
    animateExamQuestion: animateExamQuestion,
    initResultAnimations: initResultAnimations
  };
})();
