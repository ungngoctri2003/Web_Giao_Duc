(function () {
  'use strict';

  function getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function formatTimeSpent(seconds) {
    var m = Math.floor(seconds / 60);
    var s = seconds % 60;
    if (m === 0) return s + ' giây';
    return m + ' phút ' + s + ' giây';
  }

  function getGradeMessage(label) {
    if (label === 'Giỏi') return 'Xuất sắc! Bạn nắm vững kiến thức.';
    if (label === 'Khá') return 'Làm tốt! Ôn thêm một chút nữa nhé.';
    if (label === 'Trung bình') return 'Ổn rồi — xem lại các câu sai để tiến bộ.';
    return 'Đừng nản — thi lại và ôn kỹ hơn nhé.';
  }

  function renderResultDetails(details) {
    return details.map(function (item, index) {
      var statusClass = item.isCorrect ? 'correct' : 'incorrect';
      var statusLabel = item.isCorrect ? 'Đúng' : 'Sai';

      var userAnswerText = item.userAnswer !== undefined
        ? item.options[item.userAnswer]
        : 'Chưa trả lời';

      var correctAnswerText = item.options[item.correctAnswer];

      var correctRow = !item.isCorrect
        ? '<div class="result-answer-row is-correct">' +
            '<span class="result-answer-label">Đáp án đúng</span>' +
            '<span class="result-answer-value">' + correctAnswerText + '</span>' +
          '</div>'
        : '';

      return (
        '<article class="result-card ' + statusClass + ' reveal">' +
          '<div class="result-card-head">' +
            '<span class="result-card-num">Câu ' + (index + 1) + '</span>' +
            '<span class="result-card-badge ' + statusClass + '">' + statusLabel + '</span>' +
          '</div>' +
          '<p class="result-card-question">' + item.question + '</p>' +
          '<div class="result-card-answers">' +
            '<div class="result-answer-row is-user">' +
              '<span class="result-answer-label">Bạn chọn</span>' +
              '<span class="result-answer-value">' + userAnswerText + '</span>' +
            '</div>' +
            correctRow +
          '</div>' +
        '</article>'
      );
    }).join('');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var container = document.getElementById('resultContainer');
    var examId = getQueryParam('id');
    var isAuto = getQueryParam('auto') === '1';

    var resultData = sessionStorage.getItem('exam_result_current');
    if (!resultData) {
      if (container) {
        container.innerHTML =
          '<div class="empty-state">' +
            '<div class="empty-state-icon">📋</div>' +
            '<h3>Không có kết quả</h3>' +
            '<p style="margin: var(--spacing-md) 0;">Vui lòng làm bài thi trước khi xem kết quả.</p>' +
            '<a href="exams.html" class="btn btn-primary">Đến danh sách bài thi</a>' +
          '</div>';
      }
      return;
    }

    var result;
    try {
      result = JSON.parse(resultData);
    } catch (e) {
      container.innerHTML = '<div class="empty-state"><p>Lỗi đọc kết quả.</p></div>';
      return;
    }

    document.title = 'Kết quả: ' + result.examTitle + ' - MathUp VN';

    var wrongCount = result.total - result.correct;
    var autoAlert = isAuto
      ? '<div class="result-auto-alert reveal">' +
          '<span class="result-auto-alert-icon" aria-hidden="true">⏱</span>' +
          '<div>' +
            '<strong>Hết thời gian</strong>' +
            '<p>Bài thi đã được nộp tự động.</p>' +
          '</div>' +
        '</div>'
      : '';

    if (container) {
      container.innerHTML =
        autoAlert +

        '<div class="result-hero reveal-scale">' +
          '<div class="result-hero-inner">' +
            '<div class="result-score-ring-wrap">' +
              '<div class="result-score-ring ' + result.grade.class + ' is-animated" style="--score-percent: ' + result.percent + '">' +
                '<div class="result-score-center">' +
                  '<span class="result-score-value">' + result.percent + '%</span>' +
                  '<span class="result-score-label">' + result.grade.label + '</span>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div class="result-hero-content">' +
              '<span class="section-num">Kết quả bài thi</span>' +
              '<h1>Hoàn thành — <em>' + result.grade.label + '</em></h1>' +
              '<p class="result-exam-title">' + result.examTitle + '</p>' +
              '<p class="result-hero-message">' + getGradeMessage(result.grade.label) + '</p>' +
              '<div class="result-summary-chips">' +
                '<span class="result-chip">' +
                  '<span aria-hidden="true">✓</span> ' + result.correct + '/' + result.total + ' câu đúng' +
                '</span>' +
                '<span class="result-chip">' +
                  '<span aria-hidden="true">⏱</span> ' + formatTimeSpent(result.timeSpent) +
                '</span>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="result-stats reveal">' +
          '<div class="result-stat">' +
            '<span class="result-stat-icon correct" aria-hidden="true">✓</span>' +
            '<div class="result-stat-body">' +
              '<span class="result-stat-value">' + result.correct + '</span>' +
              '<span class="result-stat-label">Câu đúng</span>' +
            '</div>' +
          '</div>' +
          '<div class="result-stat">' +
            '<span class="result-stat-icon incorrect" aria-hidden="true">✗</span>' +
            '<div class="result-stat-body">' +
              '<span class="result-stat-value">' + wrongCount + '</span>' +
              '<span class="result-stat-label">Câu sai</span>' +
            '</div>' +
          '</div>' +
          '<div class="result-stat">' +
            '<span class="result-stat-icon time" aria-hidden="true">⏱</span>' +
            '<div class="result-stat-body">' +
              '<span class="result-stat-value result-stat-value-sm">' + formatTimeSpent(result.timeSpent) + '</span>' +
              '<span class="result-stat-label">Thời gian</span>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="result-actions reveal">' +
          '<a href="exam.html?id=' + (examId || result.examId) + '" class="btn btn-outline btn-lg">Thi lại</a>' +
          '<a href="exams.html" class="btn btn-primary btn-lg">Về danh sách đề</a>' +
        '</div>' +

        '<section class="result-breakdown reveal">' +
          '<div class="result-breakdown-head">' +
            '<div>' +
              '<h2>Chi tiết từng câu</h2>' +
              '<p class="result-breakdown-sub">' + result.correct + ' đúng · ' + wrongCount + ' sai · ' + result.total + ' câu</p>' +
            '</div>' +
            '<span class="result-breakdown-tag">' + result.total + ' câu</span>' +
          '</div>' +
          '<div class="result-list">' +
            renderResultDetails(result.details) +
          '</div>' +
        '</section>';
    }

    if (window.MathUpUI) {
      window.MathUpUI.initResultAnimations();
      window.MathUpUI.refreshReveal();
    }
  });
})();
