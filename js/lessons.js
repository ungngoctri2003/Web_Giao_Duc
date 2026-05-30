(function () {
  'use strict';

  var currentFilter = 'all';

  function renderFilterTabs() {
    var container = document.getElementById('filterTabs');
    if (!container) return;

    container.innerHTML = TOPICS.map(function (topic) {
      return (
        '<button class="filter-tab' + (topic.id === currentFilter ? ' active' : '') + '" data-topic="' + topic.id + '">' +
          topic.label +
        '</button>'
      );
    }).join('');

    container.querySelectorAll('.filter-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        currentFilter = tab.dataset.topic;
        renderFilterTabs();
        renderLessons();
      });
    });
  }

  function updateLessonCount(count) {
    var el = document.getElementById('lessonCount');
    if (el) el.textContent = count + ' bài học';
  }

  function renderLessons() {
    var grid = document.getElementById('lessonsGrid');
    var empty = document.getElementById('emptyState');
    if (!grid) return;

    var filtered = currentFilter === 'all'
      ? LESSONS
      : LESSONS.filter(function (l) { return l.topic === currentFilter; });

    updateLessonCount(filtered.length);

    if (filtered.length === 0) {
      grid.style.display = 'none';
      if (empty) empty.style.display = 'block';
      return;
    }

    grid.style.display = 'grid';
    if (empty) empty.style.display = 'none';

    grid.innerHTML = filtered.map(function (lesson, i) {
      var num = String(lesson.id).padStart(2, '0');
      var delay = (i % 3) + 1;
      return (
        '<a href="lesson-detail.html?id=' + lesson.id + '" class="card lesson-card reveal reveal-delay-' + delay + '" style="text-decoration:none;color:inherit;">' +
          '<span class="card-stamp">Bài ' + num + '</span>' +
          '<div class="card-img topic-' + lesson.topic + '">' +
            lesson.icon +
            '<span class="topic-tag">' + lesson.topicLabel + '</span>' +
          '</div>' +
          '<div class="card-body">' +
            '<div class="card-meta" style="margin-bottom: var(--spacing-sm);">' +
              '<span class="badge badge-primary">' + lesson.grade + '</span>' +
            '</div>' +
            '<h3 class="card-title">' + lesson.title + '</h3>' +
            '<p class="card-text">' + lesson.description + '</p>' +
            '<div class="card-meta">' +
              '<span class="badge badge-secondary">' + lesson.duration + '</span>' +
              '<span class="badge badge-accent">' + lesson.quiz.length + ' câu ôn</span>' +
            '</div>' +
            '<span class="card-link-arrow">Đọc bài →</span>' +
          '</div>' +
        '</a>'
      );
    }).join('');

    if (window.MathUpUI) window.MathUpUI.refreshReveal();
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderFilterTabs();
    renderLessons();
  });
})();
