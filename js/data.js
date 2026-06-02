const LESSONS = [
  {
    id: 1,
    title: 'Phương trình bậc nhất một ẩn',
    grade: 'Lớp 9',
    topic: 'dai-so',
    topicLabel: 'Đại số',
    duration: '25 phút',
    description: 'Tìm hiểu cách giải phương trình bậc nhất dạng ax + b = 0 và ứng dụng vào bài toán thực tế.',
    icon: '📐',
    videoUrl: 'https://www.youtube.com/embed/h5G2W0v9nkM',
    pdfUrl: '#',
    quiz: [
      {
        question: 'Nghiệm của phương trình 2x + 6 = 0 là:',
        options: ['x = 3', 'x = -3', 'x = 6', 'x = -6'],
        correct: 1,
        explain: '2x + 6 = 0 ⟹ 2x = -6 ⟹ x = -3'
      },
      {
        question: 'Phương trình 3x - 9 = 0 có nghiệm là:',
        options: ['x = -3', 'x = 0', 'x = 3', 'x = 9'],
        correct: 2,
        explain: '3x - 9 = 0 ⟹ 3x = 9 ⟹ x = 3'
      },
      {
        question: 'Phương trình nào sau đây có nghiệm x = 4?',
        options: ['x + 2 = 6', '2x = 6', 'x - 4 = 0', '3x = 9'],
        correct: 2,
        explain: 'x - 4 = 0 ⟹ x = 4'
      }
    ]
  },
  {
    id: 2,
    title: 'Phương trình bậc hai',
    grade: 'Lớp 9',
    topic: 'dai-so',
    topicLabel: 'Đại số',
    duration: '35 phút',
    description: 'Công thức nghiệm, biệt thức Delta và các trường hợp phương trình bậc hai có nghiệm.',
    icon: '📊',
    videoUrl: 'https://www.youtube.com/embed/KmgcEuv9VMA',
    pdfUrl: '#',
    quiz: [
      {
        question: 'Phương trình x² - 5x + 6 = 0 có nghiệm là:',
        options: ['x = 2 và x = 3', 'x = 1 và x = 6', 'x = -2 và x = -3', 'Vô nghiệm'],
        correct: 0,
        explain: 'x² - 5x + 6 = (x-2)(x-3) = 0 ⟹ x = 2 hoặc x = 3'
      },
      {
        question: 'Biệt thức Δ của phương trình x² + 2x + 1 = 0 bằng:',
        options: ['Δ = 4', 'Δ = 0', 'Δ = -4', 'Δ = 8'],
        correct: 1,
        explain: 'Δ = b² - 4ac = 4 - 4 = 0'
      },
      {
        question: 'Phương trình x² + 1 = 0 có:',
        options: ['Hai nghiệm phân biệt', 'Nghiệm kép', 'Vô nghiệm', 'Vô số nghiệm'],
        correct: 2,
        explain: 'x² + 1 = 0 ⟹ x² = -1, không có nghiệm thực'
      }
    ]
  },
  {
    id: 3,
    title: 'Định lý Pythagoras',
    grade: 'Lớp 8',
    topic: 'hinh-hoc',
    topicLabel: 'Hình học',
    duration: '30 phút',
    description: 'Khám phá mối quan hệ giữa ba cạnh trong tam giác vuông và ứng dụng tính toán.',
    icon: '📏',
    videoUrl: 'https://www.youtube.com/embed/FzEG52BEK8c?start=6',
    pdfUrl: '#',
    quiz: [
      {
        question: 'Tam giác vuông có hai cạnh góc vuông 3cm và 4cm. Cạnh huyền dài:',
        options: ['5 cm', '6 cm', '7 cm', '12 cm'],
        correct: 0,
        explain: 'c² = a² + b² = 9 + 16 = 25 ⟹ c = 5 cm'
      },
      {
        question: 'Cạnh huyền tam giác vuông dài 13cm, một cạnh góc vuông 5cm. Cạnh còn lại:',
        options: ['8 cm', '10 cm', '12 cm', '18 cm'],
        correct: 2,
        explain: 'b² = 13² - 5² = 169 - 25 = 144 ⟹ b = 12 cm'
      },
      {
        question: 'Định lý Pythagoras áp dụng cho tam giác:',
        options: ['Đều', 'Cân', 'Vuông', 'Nhọn'],
        correct: 2,
        explain: 'Định lý Pythagoras chỉ áp dụng cho tam giác vuông'
      }
    ]
  },
  {
    id: 4,
    title: 'Đạo hàm cơ bản',
    grade: 'Lớp 11',
    topic: 'giai-tich',
    topicLabel: 'Giải tích',
    duration: '40 phút',
    description: 'Khái niệm đạo hàm, quy tắc tính đạo hàm các hàm số cơ bản và ứng dụng.',
    icon: '📈',
    videoUrl: 'https://www.youtube.com/embed/aZ0_g9gAcSE',
    pdfUrl: '#',
    quiz: [
      {
        question: 'Đạo hàm của f(x) = x² là:',
        options: ["f'(x) = x", "f'(x) = 2x", "f'(x) = x²", "f'(x) = 2"],
        correct: 1,
        explain: "(x²)' = 2x theo quy tắc đạo hàm lũy thừa"
      },
      {
        question: "Đạo hàm của f(x) = 3x + 5 là:",
        options: ["f'(x) = 3", "f'(x) = 3x", "f'(x) = 5", "f'(x) = 8"],
        correct: 0,
        explain: "(3x + 5)' = 3"
      },
      {
        question: "Đạo hàm của f(x) = x³ tại x = 2 bằng:",
        options: ['6', '8', '12', '4'],
        correct: 2,
        explain: "f'(x) = 3x², f'(2) = 3 × 4 = 12"
      }
    ]
  }
];

const EXAMS = [
  {
    id: 1,
    title: 'Kiểm tra Đại số cơ bản',
    description: 'Đánh giá kiến thức về phương trình bậc nhất và bậc hai.',
    grade: 'Lớp 9',
    difficulty: 'Trung bình',
    duration: 15,
    questions: [
      {
        question: 'Nghiệm của phương trình 5x - 15 = 0 là:',
        options: ['x = 3', 'x = -3', 'x = 5', 'x = 15'],
        correct: 0
      },
      {
        question: 'Phương trình x² - 9 = 0 có nghiệm:',
        options: ['x = 3', 'x = ±3', 'x = 9', 'Vô nghiệm'],
        correct: 1
      },
      {
        question: 'Tập nghiệm của phương trình 2(x - 1) = 4 là:',
        options: ['{1}', '{2}', '{3}', '{4}'],
        correct: 2
      },
      {
        question: 'Phương trình x² + 4x + 4 = 0 có:',
        options: ['Hai nghiệm phân biệt', 'Nghiệm kép x = -2', 'Vô nghiệm', 'x = 2'],
        correct: 1
      },
      {
        question: 'Biệt thức Δ của x² - 3x + 2 = 0 bằng:',
        options: ['Δ = 0', 'Δ = 1', 'Δ = -1', 'Δ = 9'],
        correct: 1
      },
      {
        question: 'Phương trình |x| = 5 có nghiệm:',
        options: ['x = 5', 'x = -5', 'x = ±5', 'x = 0'],
        correct: 2
      },
      {
        question: 'Nghiệm của 3x + 2 = 3x + 5 là:',
        options: ['x = 1', 'x = 0', 'Vô nghiệm', 'Mọi x'],
        correct: 2
      },
      {
        question: 'Phương trình x² - 2x - 3 = 0 có nghiệm:',
        options: ['x = 1, x = 3', 'x = -1, x = 3', 'x = 1, x = -3', 'Vô nghiệm'],
        correct: 1
      }
    ]
  },
  {
    id: 2,
    title: 'Kiểm tra Hình học & Giải tích',
    description: 'Bài kiểm tra tổng hợp về hình học và đạo hàm cơ bản.',
    grade: 'Lớp 11',
    difficulty: 'Khó',
    duration: 20,
    questions: [
      {
        question: 'Tam giác vuông có cạnh góc vuông 6cm và 8cm. Diện tích bằng:',
        options: ['24 cm²', '48 cm²', '14 cm²', '96 cm²'],
        correct: 0
      },
      {
        question: 'Cạnh huyền tam giác vuông bằng 10cm, một cạnh góc vuông 6cm. Cạnh còn lại:',
        options: ['4 cm', '6 cm', '8 cm', '16 cm'],
        correct: 2
      },
      {
        question: "Đạo hàm của f(x) = x⁴ tại x = 1 bằng:",
        options: ['1', '2', '4', '8'],
        correct: 2
      },
      {
        question: "Đạo hàm của f(x) = 2x² + 3x - 1 là:",
        options: ["4x + 3", "2x + 3", "4x² + 3", "x² + 3x"],
        correct: 0
      },
      {
        question: 'Góc trong tam giác có tổng bằng:',
        options: ['90°', '180°', '270°', '360°'],
        correct: 1
      },
      {
        question: 'Diện tích tam giác vuông cạnh góc vuông a và b là:',
        options: ['a × b', 'ab/2', 'a + b', '2(a + b)'],
        correct: 1
      },
      {
        question: "f(x) = x³ - 3x. f'(1) bằng:",
        options: ['0', '3', '-3', '6'],
        correct: 0
      },
      {
        question: 'Tam giác có cạnh 3, 4, 5 là tam giác:',
        options: ['Nhọn', 'Tù', 'Vuông', 'Không tồn tại'],
        correct: 2
      },
      {
        question: "Đạo hàm của hằng số f(x) = 7 là:",
        options: ['7', '7x', '0', '1'],
        correct: 2
      },
      {
        question: 'Cạnh huyền tam giác vuông bằng 5cm, một cạnh 3cm. Cạnh còn lại:',
        options: ['2 cm', '4 cm', '6 cm', '8 cm'],
        correct: 1
      }
    ]
  }
];

const TOPICS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'dai-so', label: 'Đại số' },
  { id: 'hinh-hoc', label: 'Hình học' },
  { id: 'giai-tich', label: 'Giải tích' }
];

function toYouTubeEmbedUrl(url) {
  if (!url || typeof url !== 'string') return url;
  if (/youtube\.com\/embed\//.test(url)) return url;

  var idMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/);
  if (!idMatch) return url;

  var embed = 'https://www.youtube.com/embed/' + idMatch[1];
  var startMatch = url.match(/[?&]t=(\d+)/);
  if (startMatch) embed += '?start=' + startMatch[1];
  return embed;
}

function getLessonById(id) {
  return LESSONS.find(function (l) { return l.id === Number(id); });
}

function getExamById(id) {
  return EXAMS.find(function (e) { return e.id === Number(id); });
}

function getDifficultyBadgeClass(difficulty) {
  if (difficulty === 'Dễ') return 'badge-secondary';
  if (difficulty === 'Khó') return 'badge-danger';
  return 'badge-accent';
}

function getGradeLabel(percent) {
  if (percent >= 80) return { label: 'Giỏi', class: 'excellent' };
  if (percent >= 65) return { label: 'Khá', class: 'good' };
  if (percent >= 50) return { label: 'Trung bình', class: 'average' };
  return { label: 'Yếu', class: 'average' };
}
