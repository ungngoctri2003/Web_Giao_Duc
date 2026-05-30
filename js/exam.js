(function () {
  'use strict';

  var exam = null;
  var currentQuestion = 0;
  var answers = {};
  var timerInterval = null;
  var timeRemaining = 0;
  var startTime = null;

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
      return '<button class="' + classes + '" data-index="' + index + '">' + (index + 1) + '</button>';
    }).join('');
  }

  function renderQuestion() {
    var q = exam.questions[currentQuestion];
    var container = document.getElementById('examContainer');
    if (!container) return;

    var optionsHtml = q.options.map(function (opt, index) {
      var letter = String.fromCharCode(65 + index);
      var selectedClass = answers[currentQuestion] === index ? ' selected' : '';
      return (
        '<label class="exam-option' + selectedClass + '" data-option="' + index + '">' +
          '<input type="radio" name="exam_answer" value="' + index + '"' +
            (answers[currentQuestion] === index ? ' checked' : '') + '>' +
          '<span class="option-letter">' + letter + '</span>' +
          '<span class="option-text">' + opt + '</span>' +
        '</label>'
      );
    }).join('');

    container.innerHTML =
      '<div class="page-header">' +
        '<span class="section-num">Đang thi</span>' +
        '<h1>' + exam.title + '</h1>' +
        '<p>' + exam.description + '</p>' +
      '</div>' +

      '<div class="exam-question-card">' +
        '<h3>Câu ' + (currentQuestion + 1) + ' · ' + q.question + '</h3>' +
        '<div class="answer-sheet">' +
          '<div class="answer-sheet-head">' +
            '<span>Phiếu trả lời</span>' +
            '<span>Câu ' + (currentQuestion + 1) + '/' + exam.questions.length + '</span>' +
          '</div>' +
          '<div id="optionsContainer">' + optionsHtml + '</div>' +
        '</div>' +
      '</div>' +

      '<div class="answer-sheet" style="margin-bottom: var(--spacing-lg);">' +
        '<div class="answer-sheet-head"><span>Điều hướng câu</span></div>' +
        '<div class="question-dots" id="questionDots">' + renderQuestionDots() + '</div>' +
      '</div>' +

      '<div class="exam-nav">' +
        '<button class="btn btn-outline" id="prevBtn"' + (currentQuestion === 0 ? ' disabled' : '') + '>← Câu trước</button>' +
        '<button class="btn btn-primary" id="nextBtn">' +
          (currentQuestion === exam.questions.length - 1 ? 'Xem lại' : 'Câu tiếp →') +
        '</button>' +
      '</div>';

    bindQuestionEvents();
    updateProgress();

    var card = document.querySelector('.exam-question-card');
    if (window.MathUpUI) window.MathUpUI.animateExamQuestion(card);
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
          renderQuestion();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        if (currentQuestion < exam.questions.length - 1) {
          currentQuestion++;
          renderQuestion();
        }
      });
    }

    document.querySelectorAll('.question-dot').forEach(function (dot) {
      dot.addEventListener('click', function () {
        currentQuestion = parseInt(dot.dataset.index, 10);
        renderQuestion();
      });
    });
  }

  function updateQuestionDots() {
    var dotsContainer = document.getElementById('questionDots');
    if (dotsContainer) {
      dotsContainer.innerHTML = renderQuestionDots();
      document.querySelectorAll('.question-dot').forEach(function (dot) {
        dot.addEventListener('click', function () {
          currentQuestion = parseInt(dot.dataset.index, 10);
          renderQuestion();
        });
      });
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
