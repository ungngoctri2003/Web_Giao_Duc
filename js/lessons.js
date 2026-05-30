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
      return window.MathUpUI.renderLessonCard(lesson, {
        index: i,
        hrefPrefix: 'lesson-detail.html?id=',
        showQuiz: true
      });
    }).join('');

    if (window.MathUpUI) window.MathUpUI.refreshReveal();
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderFilterTabs();
    renderLessons();
  });
})();
