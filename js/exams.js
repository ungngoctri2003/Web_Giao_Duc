(function () {
  'use strict';

  function isExamCompleted(examId) {
    return localStorage.getItem('exam_completed_' + examId) === 'true';
  }

  function getLastScore(examId) {
    var result = localStorage.getItem('exam_result_' + examId);
    if (!result) return null;
    try {
      return JSON.parse(result);
    } catch (e) {
      return null;
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var grid = document.getElementById('examsGrid');
    if (!grid) return;

    grid.innerHTML = EXAMS.map(function (exam, i) {
      var completed = isExamCompleted(exam.id);
      var lastScore = getLastScore(exam.id);
      var num = String(exam.id).padStart(2, '0');
      var statusBadge = completed
        ? '<span class="badge badge-secondary">Đã thi</span>'
        : '<span class="badge badge-accent">Sẵn sàng</span>';

      var scoreInfo = '';
      if (lastScore) {
        scoreInfo = '<div class="exam-score-pill">🏆 Điểm gần nhất: ' + lastScore.correct + '/' + lastScore.total + ' (' + lastScore.percent + '%)</div>';
      }

      return (
        '<div class="card exam-card reveal reveal-delay-' + (i + 1) + '">' +
          '<div class="card-img">' +
            '<span class="exam-card-stamp">Đề ' + num + '</span>' +
            '📋' +
          '</div>' +
          '<div class="card-body">' +
            '<div class="card-meta" style="margin-bottom: var(--spacing-sm);">' +
              '<span class="badge badge-primary">' + exam.grade + '</span>' +
              '<span class="badge ' + getDifficultyBadgeClass(exam.difficulty) + '">' + exam.difficulty + '</span>' +
              statusBadge +
            '</div>' +
            '<h3 class="card-title">' + exam.title + '</h3>' +
            '<p class="card-text">' + exam.description + '</p>' +
            scoreInfo +
            '<div class="exam-card-meta">' +
              '<div class="exam-card-meta-item">' +
                '<div class="value">' + exam.questions.length + '</div>' +
                '<div class="label">Câu hỏi</div>' +
              '</div>' +
              '<div class="exam-card-meta-item">' +
                '<div class="value">' + exam.duration + '</div>' +
                '<div class="label">Phút</div>' +
              '</div>' +
              '<div class="exam-card-meta-item">' +
                '<div class="value">' + exam.difficulty + '</div>' +
                '<div class="label">Mức độ</div>' +
              '</div>' +
            '</div>' +
            '<div class="exam-card-footer">' +
              '<a href="exam.html?id=' + exam.id + '" class="btn btn-primary">' +
                (completed ? 'Thi lại →' : 'Bắt đầu thi →') +
              '</a>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    if (window.MathUpUI) window.MathUpUI.refreshReveal();
  });
})();
