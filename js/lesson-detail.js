(function () {
  'use strict';

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
            '<span>' + opt + '</span>' +
          '</label>'
        );
      }).join('');

      return (
        '<div class="quiz-question" data-quiz-index="' + index + '">' +
          '<h4>Câu ' + (index + 1) + ': ' + q.question + '</h4>' +
          '<div class="quiz-options">' + optionsHtml + '</div>' +
          '<button class="btn btn-primary btn-sm check-quiz-btn" data-quiz="' + index + '" style="margin-top: var(--spacing-md);">Kiểm tra</button>' +
          '<div class="quiz-feedback" id="feedback_' + index + '" style="display:none;"></div>' +
        '</div>'
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
        status.textContent = '✓ Đã lưu ghi chú';
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
        '<div class="page-header reveal-scale">' +
          '<span class="section-num">Bài ' + lesson.id + '</span>' +
          '<h1>' + lesson.title + '</h1>' +
          '<div class="lesson-info">' +
            '<span class="badge badge-primary">' + lesson.grade + '</span>' +
            '<span class="badge badge-gray">' + lesson.topicLabel + '</span>' +
            '<span class="badge badge-secondary">' + lesson.duration + '</span>' +
          '</div>' +
          '<p>' + lesson.description + '</p>' +
        '</div>' +

        '<div class="lesson-layout">' +
          '<aside class="lesson-sidebar">' +
            '<div class="lesson-sidebar-title">Mục lục</div>' +
            '<nav class="lesson-nav">' +
              '<a href="#video" class="active">Video</a>' +
              '<a href="#docs">Tài liệu</a>' +
              '<a href="#notes">Ghi chú</a>' +
              '<a href="#quiz">Ôn tập</a>' +
            '</nav>' +
          '</aside>' +
          '<div class="lesson-main">' +

        '<div class="content-section" id="video">' +
          '<h2>Video bài giảng <span class="section-tag">Xem</span></h2>' +
          '<div class="video-wrapper">' +
            '<iframe src="' + lesson.videoUrl + '" title="' + lesson.title + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' +
          '</div>' +
        '</div>' +

        '<div class="content-section" id="docs">' +
          '<h2>Tài liệu tham khảo <span class="section-tag">PDF</span></h2>' +
          '<p style="margin-bottom: var(--spacing-md);">Tải tài liệu PDF để ôn tập thêm ngoài video bài giảng.</p>' +
          '<a href="' + lesson.pdfUrl + '" class="btn btn-outline" onclick="alert(\'Đây là tài liệu mẫu cho dự án demo.\'); return false;">' +
            '⬇ Tải tài liệu PDF' +
          '</a>' +
        '</div>' +

        '<div class="content-section" id="notes">' +
          '<h2>Ghi chú của bạn <span class="section-tag">Vở</span></h2>' +
          '<p style="margin-bottom: var(--spacing-md);">Ghi lại những điểm quan trọng trong bài học. Ghi chú sẽ được lưu tự động trên trình duyệt.</p>' +
          '<textarea id="noteTextarea" class="form-control" placeholder="Nhập ghi chú của bạn tại đây..."></textarea>' +
          '<div class="note-actions">' +
            '<button id="saveNoteBtn" class="btn btn-primary">Lưu ghi chú</button>' +
            '<span id="noteStatus" class="note-status"></span>' +
          '</div>' +
        '</div>' +

        '<div class="content-section" id="quiz">' +
          '<h2>Ôn tập nhanh <span class="section-tag">' + lesson.quiz.length + ' câu</span></h2>' +
          '<p style="margin-bottom: var(--spacing-lg);">Trả lời các câu hỏi sau để củng cố kiến thức vừa học.</p>' +
          renderQuiz(lesson) +
        '</div>' +

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
