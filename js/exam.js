(function () {
  'use strict';

  var exam = null;
  var currentQuestion = 0;
  var answers = {};
  var timerInterval = null;
  var timeRemaining = 0;
  var startTime = null;
  var shellReady = false;

  function getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function formatTime(seconds) {
    var m = Math.floor(seconds / 60);
    var s = seconds % 60;
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }

  function getSessionKey(key) {
    return 'exam_' + exam.id + '_' + key;
  }

  function saveAnswers() {
    sessionStorage.setItem(getSessionKey('answers'), JSON.stringify(answers));
  }

  function updateProgress() {
    var total = exam.questions.length;
    var answered = Object.keys(answers).length;
    var current = currentQuestion + 1;
    var percent = Math.round((answered / total) * 100);

    var progressText = document.getElementById('progressText');
    var progressPercent = document.getElementById('progressPercent');
    var progressFill = document.getElementById('progressFill');

    if (progressText) progressText.textContent = 'Câu ' + current + '/' + total;
    if (progressPercent) progressPercent.textContent = percent + '%';
    if (progressFill) progressFill.style.width = percent + '%';

    updateSidebarStats(answered, total);
  }

  function updateSidebarStats(answered, total) {
    var statsEl = document.getElementById('examSidebarStats');
    if (!statsEl) return;

    var unanswered = total - answered;
    statsEl.innerHTML =
      '<div class="exam-stat">' +
        '<span class="exam-stat-value">' + answered + '</span>' +
        '<span class="exam-stat-label">Đã trả lời</span>' +
      '</div>' +
      '<div class="exam-stat">' +
        '<span class="exam-stat-value">' + unanswered + '</span>' +
        '<span class="exam-stat-label">Chưa làm</span>' +
      '</div>' +
      '<div class="exam-stat">' +
        '<span class="exam-stat-value">' + total + '</span>' +
        '<span class="exam-stat-label">Tổng câu</span>' +
      '</div>';
  }

  function updateTimerDisplay() {
    var display = document.getElementById('timerDisplay');
    var timerEl = document.getElementById('examTimer');
    if (!display) return;

    display.textContent = formatTime(timeRemaining);

    if (timerEl) {
      timerEl.classList.remove('warning', 'danger');
      if (timeRemaining <= 60) {
        timerEl.classList.add('danger');
      } else if (timeRemaining <= 120) {
        timerEl.classList.add('warning');
      }
    }
  }

  function startTimer() {
    timeRemaining = exam.duration * 60;
    updateTimerDisplay();

    timerInterval = setInterval(function () {
      timeRemaining--;
      updateTimerDisplay();

      if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        submitExam(true);
      }
    }, 1000);
  }

  function renderQuestionDots() {
    return exam.questions.map(function (_, index) {
      var classes = 'question-dot';
      if (index === currentQuestion) classes += ' active';
      if (answers[index] !== undefined) classes += ' answered';
      return '<button type="button" class="' + classes + '" data-index="' + index + '" aria-label="Câu ' + (index + 1) + '">' + (index + 1) + '</button>';
    }).join('');
  }

  function bindQuestionDotEvents() {
    document.querySelectorAll('.question-dot').forEach(function (dot) {
      dot.addEventListener('click', function () {
        currentQuestion = parseInt(dot.dataset.index, 10);
        renderQuestion();
      });
    });
  }

  function renderOptionsHtml(q) {
    return q.options.map(function (opt, index) {
      var letter = String.fromCharCode(65 + index);
      var selectedClass = answers[currentQuestion] === index ? ' selected' : '';
      return (
        '<label class="exam-option' + selectedClass + '" data-option="' + index + '">' +
          '<input type="radio" name="exam_answer" value="' + index + '"' +
            (answers[currentQuestion] === index ? ' checked' : '') + '>' +
          '<span class="option-letter">' + letter + '</span>' +
          '<span class="option-text">' + opt + '</span>' +
          '<span class="option-check" aria-hidden="true">✓</span>' +
        '</label>'
      );
    }).join('');
  }

  function initExamShell() {
    var container = document.getElementById('examContainer');
    if (!container) return;

    container.innerHTML =
      '<div class="exam-session-header reveal-scale">' +
        '<div class="exam-session-header-inner">' +
          '<div class="exam-session-meta">' +
            '<span class="badge badge-primary">' + exam.grade + '</span>' +
            '<span class="badge ' + getDifficultyBadgeClass(exam.difficulty) + '">' + exam.difficulty + '</span>' +
            '<span class="exam-session-chip">' +
              '<span aria-hidden="true">⏱</span> ' + exam.duration + ' phút' +
            '</span>' +
            '<span class="exam-session-chip">' +
              '<span aria-hidden="true">📝</span> ' + exam.questions.length + ' câu hỏi' +
            '</span>' +
          '</div>' +
          '<h1 class="exam-session-title">' + exam.title + '</h1>' +
          '<p class="exam-session-desc">' + exam.description + '</p>' +
        '</div>' +
      '</div>' +

      '<div class="exam-layout">' +
        '<div class="exam-main-col">' +
          '<div class="exam-question-card" id="examQuestionCard"></div>' +
          '<div class="exam-nav" id="examNav"></div>' +
        '</div>' +
        '<aside class="exam-sidebar">' +
          '<div class="exam-sidebar-panel">' +
            '<div class="exam-sidebar-head">' +
              '<h3 class="exam-sidebar-title">Bản đồ câu hỏi</h3>' +
              '<p class="exam-sidebar-sub">Nhấn vào số để chuyển câu</p>' +
            '</div>' +
            '<div class="exam-sidebar-stats" id="examSidebarStats"></div>' +
            '<div class="question-dots exam-question-map" id="questionDots"></div>' +
            '<div class="exam-sidebar-legend">' +
              '<span class="legend-item"><i class="dot-legend current"></i> Đang làm</span>' +
              '<span class="legend-item"><i class="dot-legend answered"></i> Đã trả lời</span>' +
              '<span class="legend-item"><i class="dot-legend"></i> Chưa làm</span>' +
            '</div>' +
            '<button type="button" class="btn btn-outline btn-sm exam-sidebar-submit" id="sidebarSubmitBtn">Nộp bài thi</button>' +
          '</div>' +
        '</aside>' +
      '</div>';

    var sidebarSubmit = document.getElementById('sidebarSubmitBtn');
    if (sidebarSubmit) {
      sidebarSubmit.addEventListener('click', showSubmitModal);
    }

    shellReady = true;
  }

  function renderQuestionContent() {
    var q = exam.questions[currentQuestion];
    var cardEl = document.getElementById('examQuestionCard');
    var navEl = document.getElementById('examNav');
    var dotsEl = document.getElementById('questionDots');

    if (!cardEl || !navEl) return;

    cardEl.innerHTML =
      '<div class="exam-question-head">' +
        '<span class="exam-question-badge">Câu ' + (currentQuestion + 1) + ' / ' + exam.questions.length + '</span>' +
        (answers[currentQuestion] !== undefined
          ? '<span class="exam-question-status answered">Đã chọn đáp án</span>'
          : '<span class="exam-question-status">Chưa trả lời</span>') +
      '</div>' +
      '<h3 class="exam-question-text">' + q.question + '</h3>' +
      '<div class="exam-options-wrap">' +
        '<div class="answer-sheet-head">' +
          '<span>Chọn một đáp án</span>' +
          '<span>' + String.fromCharCode(65) + ' – ' + String.fromCharCode(64 + q.options.length) + '</span>' +
        '</div>' +
        '<div id="optionsContainer">' + renderOptionsHtml(q) + '</div>' +
      '</div>';

    navEl.innerHTML =
      '<button type="button" class="btn btn-outline exam-nav-prev" id="prevBtn"' +
        (currentQuestion === 0 ? ' disabled' : '') + '>' +
        '<span aria-hidden="true">←</span> Câu trước' +
      '</button>' +
      '<span class="exam-nav-indicator">' + (currentQuestion + 1) + ' / ' + exam.questions.length + '</span>' +
      '<button type="button" class="btn btn-primary exam-nav-next" id="nextBtn">' +
        (currentQuestion === exam.questions.length - 1 ? 'Xem lại bài' : 'Câu tiếp') +
        '<span aria-hidden="true">→</span>' +
      '</button>';

    if (dotsEl) {
      dotsEl.innerHTML = renderQuestionDots();
    }

    bindQuestionEvents();
    updateProgress();

    if (window.MathUpUI) window.MathUpUI.animateExamQuestion(cardEl);
  }

  function renderQuestion() {
    if (!shellReady) initExamShell();
    renderQuestionContent();
  }

  function bindQuestionEvents() {
    document.querySelectorAll('#optionsContainer .exam-option').forEach(function (opt) {
      opt.addEventListener('click', function () {
        var value = parseInt(opt.dataset.option, 10);
        answers[currentQuestion] = value;
        saveAnswers();

        document.querySelectorAll('#optionsContainer .exam-option').forEach(function (o) {
          o.classList.remove('selected');
        });
        opt.classList.add('selected');
        opt.querySelector('input').checked = true;

        updateProgress();
        updateQuestionDots();
      });
    });

    var prevBtn = document.getElementById('prevBtn');
    var nextBtn = document.getElementById('nextBtn');

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        if (currentQuestion > 0) {
          currentQuestion--;
          renderQuestionContent();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        if (currentQuestion < exam.questions.length - 1) {
          currentQuestion++;
          renderQuestionContent();
        }
      });
    }

    bindQuestionDotEvents();
  }

  function updateQuestionDots() {
    var dotsContainer = document.getElementById('questionDots');
    if (dotsContainer) {
      dotsContainer.innerHTML = renderQuestionDots();
      bindQuestionDotEvents();
    }

    var statusEl = document.querySelector('.exam-question-status');
    if (statusEl) {
      if (answers[currentQuestion] !== undefined) {
        statusEl.textContent = 'Đã chọn đáp án';
        statusEl.classList.add('answered');
      } else {
        statusEl.textContent = 'Chưa trả lời';
        statusEl.classList.remove('answered');
      }
    }
  }

  function calculateResult() {
    var correct = 0;
    var details = exam.questions.map(function (q, index) {
      var userAnswer = answers[index];
      var isCorrect = userAnswer === q.correct;
      if (isCorrect) correct++;
      return {
        question: q.question,
        options: q.options,
        userAnswer: userAnswer,
        correctAnswer: q.correct,
        isCorrect: isCorrect
      };
    });

    var total = exam.questions.length;
    var percent = Math.round((correct / total) * 100);
    var timeSpent = exam.duration * 60 - timeRemaining;

    return {
      examId: exam.id,
      examTitle: exam.title,
      correct: correct,
      total: total,
      percent: percent,
      timeSpent: timeSpent,
      details: details,
      grade: getGradeLabel(percent)
    };
  }

  function submitExam(autoSubmit) {
    if (timerInterval) clearInterval(timerInterval);

    var result = calculateResult();
    sessionStorage.setItem('exam_result_current', JSON.stringify(result));
    localStorage.setItem('exam_result_' + exam.id, JSON.stringify({
      correct: result.correct,
      total: result.total,
      percent: result.percent
    }));
    localStorage.setItem('exam_completed_' + exam.id, 'true');

    window.location.href = 'result.html?id=' + exam.id + (autoSubmit ? '&auto=1' : '');
  }

  function showSubmitModal() {
    var unanswered = exam.questions.length - Object.keys(answers).length;
    var modalText = document.getElementById('submitModalText');
    if (modalText && unanswered > 0) {
      modalText.textContent = 'Bạn còn ' + unanswered + ' câu chưa trả lời. Bạn chắc chắn muốn nộp bài?';
    } else if (modalText) {
      modalText.textContent = 'Bạn chắc chắn muốn nộp bài thi? Hành động này không thể hoàn tác.';
    }
    document.getElementById('submitModal').classList.add('open');
  }

  function hideSubmitModal() {
    document.getElementById('submitModal').classList.remove('open');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var examId = getQueryParam('id');
    exam = getExamById(examId);
    var container = document.getElementById('examContainer');

    if (!exam) {
      if (container) {
        container.innerHTML =
          '<div class="empty-state">' +
            '<div class="empty-state-icon">😕</div>' +
            '<h3>Không tìm thấy bài thi</h3>' +
            '<p style="margin: var(--spacing-md) 0;">Bài thi bạn tìm không tồn tại.</p>' +
            '<a href="exams.html" class="btn btn-primary">Quay lại danh sách</a>' +
          '</div>';
      }
      return;
    }

    document.title = exam.title + ' - MathUp VN';

    var barTitle = document.getElementById('examBarTitle');
    if (barTitle) barTitle.textContent = exam.title;

    startTime = Date.now();
    answers = {};
    sessionStorage.removeItem(getSessionKey('answers'));

    var examBar = document.getElementById('examBar');
    if (examBar) examBar.style.display = 'block';

    renderQuestion();
    startTimer();

    document.getElementById('submitExamBtn').addEventListener('click', showSubmitModal);
    document.getElementById('cancelSubmitBtn').addEventListener('click', hideSubmitModal);
    document.getElementById('confirmSubmitBtn').addEventListener('click', function () {
      hideSubmitModal();
      submitExam(false);
    });

    document.getElementById('submitModal').addEventListener('click', function (e) {
      if (e.target.id === 'submitModal') hideSubmitModal();
    });
  });
})();
