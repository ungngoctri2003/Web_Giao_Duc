(function () {
  'use strict';

  var FONT_LINK = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;0,9..144,800;1,9..144,600;1,9..144,700&family=Be+Vietnam+Pro:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap';

  function getBasePath() {
    return window.location.pathname.includes('/pages/') ? '../' : './';
  }

  function getCurrentPage() {
    var filename = window.location.pathname.split('/').pop() || 'index.html';
    if (filename === '' || filename.endsWith('/')) filename = 'index.html';
    return filename;
  }

  function renderHeader() {
    var base = getBasePath();
    var current = getCurrentPage();
    var isHome = current === 'index.html' || current === '';

    var navHtml = '';

    var navItemsDetailed = [
      { href: base + 'index.html', label: 'Trang chủ', icon: '🏠', page: 'index.html' },
      { href: base + 'pages/lessons.html', label: 'Bài học', icon: '📖', page: 'lessons.html' },
      { href: base + 'pages/exams.html', label: 'Bài thi', icon: '📝', page: 'exams.html' }
    ];

    navHtml = navItemsDetailed.map(function (item) {
      var isActive = current === item.page ||
        (isHome && item.page === 'index.html') ||
        (current === 'lesson-detail.html' && item.page === 'lessons.html') ||
        ((current === 'exam.html' || current === 'result.html') && item.page === 'exams.html');
      return (
        '<a href="' + item.href + '" class="nav-link' + (isActive ? ' active' : '') + '">' +
          '<span class="nav-icon" aria-hidden="true">' + item.icon + '</span>' +
          '<span class="nav-label">' + item.label + '</span>' +
        '</a>'
      );
    }).join('');

    return (
      '<header class="site-header" id="siteHeader">' +
        '<div class="container header-inner">' +
          '<a href="' + base + 'index.html" class="logo logo-image">' +
            '<img src="' + base + 'assets/images/logo.png" alt="MathUp" class="logo-img" width="140" height="48">' +
          '</a>' +
          '<button class="menu-toggle" id="menuToggle" aria-label="Mở menu">' +
            '<span></span><span></span><span></span>' +
          '</button>' +
          '<nav class="nav-menu" id="navMenu">' + navHtml + '</nav>' +
          '<div class="header-actions">' +
            '<a href="' + base + 'pages/lessons.html" class="btn btn-primary btn-sm header-cta">' +
              '<span class="header-cta-icon">→</span> Vào học' +
            '</a>' +
          '</div>' +
        '</div>' +
        '<div class="header-rule" aria-hidden="true"></div>' +
      '</header>'
    );
  }

  function renderFooter() {
    var base = getBasePath();
    var year = new Date().getFullYear();

    return (
      '<footer class="site-footer">' +
        '<div class="container footer-inner">' +
          '<div class="footer-grid">' +
            '<div class="footer-brand">' +
              '<a href="' + base + 'index.html" class="logo logo-image footer-logo">' +
                '<img src="' + base + 'assets/images/logo.png" alt="MathUp" class="logo-img footer-logo-img" width="140" height="48">' +
              '</a>' +
              '<p class="footer-tagline">Học và luyện thi Toán trực tuyến — video bài giảng, ghi chú và bài thi có thời gian.</p>' +
            '</div>' +
            '<div class="footer-col">' +
              '<h3 class="footer-col-title">Khám phá</h3>' +
              '<nav class="footer-nav" aria-label="Điều hướng chân trang">' +
                '<a href="' + base + 'index.html">Trang chủ</a>' +
                '<a href="' + base + 'pages/lessons.html">Bài học</a>' +
                '<a href="' + base + 'pages/exams.html">Bài thi</a>' +
              '</nav>' +
            '</div>' +
            '<div class="footer-col">' +
              '<h3 class="footer-col-title">Liên hệ</h3>' +
              '<ul class="footer-contact-list">' +
                '<li class="footer-contact-item">' +
                  '<span class="footer-contact-icon" aria-hidden="true">' +
                    '<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" stroke-width="1.4"/><path d="M2.5 14c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>' +
                  '</span>' +
                  '<span>Đặng Yến Nhi</span>' +
                '</li>' +
                '<li class="footer-contact-item">' +
                  '<span class="footer-contact-icon" aria-hidden="true">' +
                    '<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M3.5 2.5h2.2l1 2.4-1.4 1.2a8.5 8.5 0 004.8 4.8l1.2-1.4 2.4 1v2.2a1.2 1.2 0 01-1.1 1.2C7.2 13.3 2.7 8.8 2.3 3.6a1.2 1.2 0 011.2-1.1z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>' +
                  '</span>' +
                  '<a href="tel:0944206289">0944206289</a>' +
                '</li>' +
                '<li class="footer-contact-item">' +
                  '<span class="footer-contact-icon" aria-hidden="true">' +
                    '<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="3.5" width="13" height="9" rx="1.2" stroke="currentColor" stroke-width="1.3"/><path d="M1.5 4.5l6.5 4.5 6.5-4.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>' +
                  '</span>' +
                  '<a href="mailto:dangyennhi104@gmail.com">dangyennhi104@gmail.com</a>' +
                '</li>' +
              '</ul>' +
            '</div>' +
          '</div>' +
          '<div class="footer-bottom">' +
            '<p class="footer-copy">© ' + year + ' MathUp VN · dự án học tập</p>' +
            '<a href="#site-header" class="footer-back-top" aria-label="Lên đầu trang">↑</a>' +
          '</div>' +
        '</div>' +
      '</footer>'
    );
  }

  function initHeaderScroll() {
    var header = document.getElementById('siteHeader');
    if (!header) return;

    function onScroll() {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function initMobileMenu() {
    var toggle = document.getElementById('menuToggle');
    var menu = document.getElementById('navMenu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function () {
      toggle.classList.toggle('active');
      menu.classList.toggle('open');
    });

    menu.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.classList.remove('active');
        menu.classList.remove('open');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var headerEl = document.getElementById('site-header');
    var footerEl = document.getElementById('site-footer');

    if (headerEl) {
      headerEl.innerHTML = renderHeader();
      initMobileMenu();
      initHeaderScroll();
    }
    if (footerEl) {
      footerEl.innerHTML = renderFooter();
    }
  });
})();
