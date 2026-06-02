(function () {
  'use strict';

  var OPTION_LETTERS = ['A', 'B', 'C', 'D'];

  function getQueryParam(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  function getNoteKey(lessonId) {
    return 'note_lesson_' + lessonId;
  }

  function saveNote(lessonId, content) {
    localStorage.setItem(getNoteKey(lessonId), content);
  }

  function loadNote(lessonId) {
    return localStorage.getItem(getNoteKey(lessonId)) || '';
  }

  function renderQuiz(lesson) {
    return lesson.quiz.map(function (q, index) {
      var optionsHtml = q.options.map(function (opt, optIndex) {
        return (
          '<label class="quiz-option" data-quiz="' + index + '" data-option="' + optIndex + '">' +
            '<input type="radio" name="quiz_' + index + '" value="' + optIndex + '">' +
            '<span class="quiz-option-letter">' + OPTION_LETTERS[optIndex] + '</span>' +
            '<span class="quiz-option-text">' + opt + '</span>' +
          '</label>'
        );
      }).join('');

      return (
        '<article class="quiz-question" data-quiz-index="' + index + '">' +
          '<div class="quiz-question-head">' +
            '<span class="quiz-question-num">Câu ' + (index + 1) + '</span>' +
            '<h4>' + q.question + '</h4>' +
          '</div>' +
          '<div class="quiz-options">' + optionsHtml + '</div>' +
          '<div class="quiz-question-actions">' +
            '<button class="btn btn-primary btn-sm check-quiz-btn" data-quiz="' + index + '">Kiểm tra</button>' +
            '<div class="quiz-feedback" id="feedback_' + index + '" style="display:none;"></div>' +
          '</div>' +
        '</article>'
      );
    }).join('');
  }

  function initQuizHandlers(lesson) {
    document.querySelectorAll('.check-quiz-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var quizIndex = parseInt(btn.dataset.quiz, 10);
        var question = lesson.quiz[quizIndex];
        var selected = document.querySelector('input[name="quiz_' + quizIndex + '"]:checked');
        var feedback = document.getElementById('feedback_' + quizIndex);

        if (!selected) {
          feedback.style.display = 'block';
          feedback.className = 'quiz-feedback incorrect';
          feedback.textContent = 'Vui lòng chọn một đáp án trước khi kiểm tra.';
          return;
        }

        var selectedIndex = parseInt(selected.value, 10);
        var isCorrect = selectedIndex === question.correct;

        document.querySelectorAll('[data-quiz="' + quizIndex + '"].quiz-option').forEach(function (opt, i) {
          opt.classList.remove('selected', 'correct', 'incorrect');
          if (i === question.correct) {
            opt.classList.add('correct');
          } else if (i === selectedIndex && !isCorrect) {
            opt.classList.add('incorrect');
          }
        });

        feedback.style.display = 'block';
        feedback.className = 'quiz-feedback ' + (isCorrect ? 'correct' : 'incorrect');
        feedback.textContent = (isCorrect ? '✓ Chính xác! ' : '✗ Chưa đúng. ') + question.explain;
      });
    });

    document.querySelectorAll('.quiz-option').forEach(function (opt) {
      opt.addEventListener('click', function () {
        var quizIndex = opt.dataset.quiz;
        document.querySelectorAll('[data-quiz="' + quizIndex + '"].quiz-option').forEach(function (o) {
          o.classList.remove('selected');
        });
        opt.classList.add('selected');
        opt.querySelector('input').checked = true;
      });
    });
  }

  function initNoteHandler(lessonId) {
    var textarea = document.getElementById('noteTextarea');
    var saveBtn = document.getElementById('saveNoteBtn');
    var status = document.getElementById('noteStatus');

    if (!textarea || !saveBtn) return;

    textarea.value = loadNote(lessonId);

    saveBtn.addEventListener('click', function () {
      saveNote(lessonId, textarea.value);
      if (status) {
        status.textContent = '✓ Đã lưu';
        status.classList.add('show');
        setTimeout(function () {
          status.classList.remove('show');
        }, 2500);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var lessonId = getQueryParam('id');
    var lesson = getLessonById(lessonId);
    var container = document.getElementById('lessonContent');
    var breadcrumb = document.getElementById('breadcrumb');
    var num = lesson ? String(lesson.id).padStart(2, '0') : '';

    if (!lesson) {
      if (container) {
        container.innerHTML =
          '<div class="empty-state">' +
            '<div class="empty-state-icon">😕</div>' +
            '<h3>Không tìm thấy bài học</h3>' +
            '<p style="margin: var(--spacing-md) 0;">Bài học bạn tìm không tồn tại hoặc đã bị xóa.</p>' +
            '<a href="lessons.html" class="btn btn-primary">Quay lại danh sách</a>' +
          '</div>';
      }
      return;
    }

    document.title = lesson.title + ' - MathUp VN';

    if (breadcrumb) {
      breadcrumb.innerHTML =
        '<a href="../index.html">Trang chủ</a>' +
        '<span class="breadcrumb-sep">›</span>' +
        '<a href="lessons.html">Bài học</a>' +
        '<span class="breadcrumb-sep">›</span>' +
        '<span class="breadcrumb-current">' + lesson.title + '</span>';
    }

    if (container) {
      container.innerHTML =
        '<header class="lesson-compact-header reveal-scale topic-' + lesson.topic + '">' +
          '<div class="lesson-compact-inner">' +
            '<div class="lesson-compact-icon" aria-hidden="true">' + lesson.icon + '</div>' +
            '<div class="lesson-compact-content">' +
              '<div class="lesson-compact-topline">' +
                '<span class="section-num">Bài ' + num + ' · ' + lesson.topicLabel + '</span>' +
                '<div class="lesson-info">' +
                  '<span class="badge badge-gray">' + lesson.grade + '</span>' +
                  '<span class="badge badge-secondary">' + lesson.duration + '</span>' +
                  '<span class="badge badge-accent">' + lesson.quiz.length + ' câu ôn</span>' +
                '</div>' +
              '</div>' +
              '<h1 class="lesson-compact-title">' + lesson.title + '</h1>' +
              '<p class="lesson-compact-desc">' + lesson.description + '</p>' +
            '</div>' +
            '<a href="lessons.html" class="btn btn-ghost btn-sm lesson-compact-back">← Danh sách</a>' +
          '</div>' +
        '</header>' +

        '<div class="lesson-layout">' +
          '<aside class="lesson-sidebar reveal">' +
            '<nav class="lesson-nav" aria-label="Mục lục bài học">' +
              '<a href="#video" class="active">' +
                '<span class="lesson-nav-icon" aria-hidden="true">▶</span>' +
                '<span class="lesson-nav-label">Video</span>' +
              '</a>' +
              '<a href="#docs">' +
                '<span class="lesson-nav-icon" aria-hidden="true">📄</span>' +
                '<span class="lesson-nav-label">Tài liệu</span>' +
              '</a>' +
              '<a href="#notes">' +
                '<span class="lesson-nav-icon" aria-hidden="true">✎</span>' +
                '<span class="lesson-nav-label">Ghi chú</span>' +
              '</a>' +
              '<a href="#quiz">' +
                '<span class="lesson-nav-icon" aria-hidden="true">✓</span>' +
                '<span class="lesson-nav-label">Ôn tập</span>' +
              '</a>' +
            '</nav>' +
          '</aside>' +

          '<div class="lesson-main">' +
            '<section class="lesson-panel lesson-panel-compact reveal" id="video">' +
              '<h2 class="lesson-panel-title"><span aria-hidden="true">▶</span> Video bài giảng</h2>' +
              '<div class="video-wrapper lesson-video">' +
                '<iframe src="' + toYouTubeEmbedUrl(lesson.videoUrl) + '" title="' + lesson.title + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>' +
              '</div>' +
            '</section>' +

            '<div class="lesson-split-grid">' +
              '<section class="lesson-panel lesson-panel-compact reveal reveal-delay-1" id="docs">' +
                '<h2 class="lesson-panel-title"><span aria-hidden="true">📄</span> Tài liệu PDF</h2>' +
                '<div class="lesson-doc-card">' +
                  '<div class="lesson-doc-icon" aria-hidden="true">PDF</div>' +
                  '<div class="lesson-doc-body">' +
                    '<h3>Tài liệu bài ' + num + '</h3>' +
                    '<p>Tóm tắt lý thuyết và ví dụ.</p>' +
                  '</div>' +
                  '<a href="' + lesson.pdfUrl + '" class="btn btn-outline btn-sm" onclick="alert(\'Đây là tài liệu mẫu cho dự án demo.\'); return false;">Tải</a>' +
                '</div>' +
              '</section>' +

              '<section class="lesson-panel lesson-panel-compact reveal reveal-delay-2" id="notes">' +
                '<h2 class="lesson-panel-title"><span aria-hidden="true">✎</span> Ghi chú</h2>' +
                '<textarea id="noteTextarea" class="form-control lesson-note-input" placeholder="Ghi công thức, mẹo nhớ..."></textarea>' +
                '<div class="note-actions">' +
                  '<button id="saveNoteBtn" class="btn btn-primary btn-sm">Lưu</button>' +
                  '<span id="noteStatus" class="note-status"></span>' +
                '</div>' +
              '</section>' +
            '</div>' +

            '<section class="lesson-panel lesson-panel-compact reveal reveal-delay-3" id="quiz">' +
              '<div class="lesson-panel-title-row">' +
                '<h2 class="lesson-panel-title"><span aria-hidden="true">✓</span> Ôn tập nhanh</h2>' +
                '<span class="lesson-panel-tag">' + lesson.quiz.length + ' câu</span>' +
              '</div>' +
              '<div class="lesson-quiz-list">' + renderQuiz(lesson) + '</div>' +
            '</section>' +
          '</div>' +
        '</div>';
    }

    initNoteHandler(lesson.id);
    initQuizHandlers(lesson);
    if (window.MathUpUI) {
      window.MathUpUI.initLessonSidebar();
      window.MathUpUI.refreshReveal();
    }
  });
})();
