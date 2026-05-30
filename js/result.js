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

  function renderResultDetails(details) {
    return details.map(function (item, index) {
      var statusClass = item.isCorrect ? 'correct' : 'incorrect';
      var statusIcon = item.isCorrect ? '✓' : '✗';

      var userAnswerText = item.userAnswer !== undefined
        ? item.options[item.userAnswer]
        : 'Chưa trả lời';

      var correctAnswerText = item.options[item.correctAnswer];

      return (
        '<div class="result-item ' + statusClass + ' reveal">' +
          '<div class="result-item-number">' + statusIcon + '</div>' +
          '<div class="result-item-content">' +
            '<p><span class="answer-label">Câu ' + (index + 1) + ':</span> ' + item.question + '</p>' +
            '<p><span class="answer-label">Bạn chọn:</span> ' + userAnswerText + '</p>' +
            (!item.isCorrect
              ? '<p><span class="answer-label">Đáp án đúng:</span> ' + correctAnswerText + '</p>'
              : '') +
          '</div>' +
        '</div>'
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

    var autoAlert = isAuto
      ? '<div class="alert alert-info" style="margin-bottom: var(--spacing-xl);">⏱ Hết thời gian! Bài thi đã được nộp tự động.</div>'
      : '';

    if (container) {
      container.innerHTML =
        autoAlert +
        '<div class="report-band">' +
          'Bạn đạt <strong>' + result.correct + '/' + result.total + '</strong> câu · xếp loại <strong>' + result.grade.label + '</strong>' +
        '</div>' +

        '<div class="result-header">' +
          '<span class="section-num">Kết quả</span>' +
          '<h1>Xong bài — <em>' + result.grade.label + '</em></h1>' +
          '<p>' + result.examTitle + '</p>' +
        '</div>' +

        '<div class="grade-stamp-wrap"><div class="grade-stamp">' + result.grade.label + '</div></div>' +

        '<div class="score-circle ' + result.grade.class + '">' +
          '<div class="score-value">' + result.percent + '%</div>' +
          '<div class="score-label">' + result.grade.label + '</div>' +
        '</div>' +

        '<div class="result-meta">' +
          '<div class="result-meta-item">' +
            '<div class="value">' + result.correct + '/' + result.total + '</div>' +
            '<div class="label">Câu đúng</div>' +
          '</div>' +
          '<div class="result-meta-item">' +
            '<div class="value">' + result.percent + '%</div>' +
            '<div class="label">Tỷ lệ đúng</div>' +
          '</div>' +
          '<div class="result-meta-item">' +
            '<div class="value">' + formatTimeSpent(result.timeSpent) + '</div>' +
            '<div class="label">Thời gian làm bài</div>' +
          '</div>' +
        '</div>' +

        '<div class="result-actions">' +
          '<a href="exam.html?id=' + (examId || result.examId) + '" class="btn btn-outline btn-lg">Làm lại</a>' +
          '<a href="exams.html" class="btn btn-primary btn-lg">Về danh sách bài thi</a>' +
        '</div>' +

        '<div class="content-section result-breakdown">' +
          '<h2>Chi tiết từng câu <span class="section-tag">' + result.total + ' câu</span></h2>' +
          renderResultDetails(result.details) +
        '</div>';
    }

    if (window.MathUpUI) {
      window.MathUpUI.initResultAnimations();
      window.MathUpUI.refreshReveal();
    }
  });
})();
