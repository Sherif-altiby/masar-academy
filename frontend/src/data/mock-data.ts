import { Course, Lesson, Subject, Teacher } from "@/types";

// Placeholder video used across all lessons in this design (Creative Commons,
// always-embeddable sample). Swap each lesson's `videoId` for real lecture
// videos when you wire this up to a real backend.
const PLACEHOLDER_VIDEO_ID = "aqz-KE-bpKQ";

export const SUBJECTS: Subject[] = [
  {
    id: "math",
    name: "الرياضيات",
    icon: "Sigma",
    description: "الجبر والهندسة وحل المسائل خطوة بخطوة.",
    color: "chart-1",
    courseCount: 12,
    studentCount: 3400,
  },
  {
    id: "science",
    name: "العلوم",
    icon: "FlaskConical",
    description: "الفيزياء والكيمياء والأحياء مشروحة بأمثلة واقعية.",
    color: "chart-2",
    courseCount: 9,
    studentCount: 2800,
  },
  {
    id: "english",
    name: "اللغة الإنجليزية",
    icon: "BookOpenText",
    description: "القواعد والفهم والتعبير الكتابي بأسلوب واضح.",
    color: "chart-3",
    courseCount: 7,
    studentCount: 2500,
  },
  {
    id: "arabic",
    name: "اللغة العربية",
    icon: "Languages",
    description: "قواعد النحو والأدب وأساسيات التعبير الكتابي.",
    color: "chart-4",
    courseCount: 6,
    studentCount: 2100,
  },
  {
    id: "computer",
    name: "علوم الحاسب",
    icon: "Code2",
    description: "منطق البرمجة وأساسيات الحاسوب من الصفر.",
    color: "chart-5",
    courseCount: 5,
    studentCount: 1600,
  },
  {
    id: "social",
    name: "الدراسات الاجتماعية",
    icon: "Globe2",
    description: "التاريخ والجغرافيا في قالب قصصي يسهل تذكّره.",
    color: "chart-1",
    courseCount: 4,
    studentCount: 1200,
  },
];

export const TEACHERS: Teacher[] = [
  {
    id: "t1",
    name: "أحمد السيد",
    slug: "ahmed-el-sayed",
    avatarInitials: "أس",
    title: "مدرّس أول للرياضيات",
    subjectId: "math",
    subjectName: "الرياضيات",
    yearsExperience: 14,
    rating: 4.9,
    reviewCount: 312,
    studentCount: 1450,
    about:
      "قضى أحمد أكثر من عشر سنوات في تحويل الجبر والهندسة من مادة مرعبة إلى مادة يتطلع الطلاب لدراستها فعلاً. يقسّم كل درس إلى خطوات صغيرة قابلة للاختبار، مع اختبار قصير في نهاية كل درس حتى لا يفوت الطالب أي تفصيلة. يشتهر بالرد على أسئلة طلابه بنفسه، عادة في نفس اليوم.",
    credentials: [
      "بكالوريوس رياضيات، جامعة القاهرة",
      "14 عامًا من الخبرة في التدريس",
      "مؤلف سلسلة كتيبات 'الجبر ببساطة'",
    ],
    reviews: [
      {
        id: "r1",
        studentName: "يوسف م.",
        rating: 5,
        comment: "يشرح كل خطوة بوضوح والاختبارات تطابق نمط الامتحان فعلاً.",
        date: "2026-06-02",
      },
      {
        id: "r2",
        studentName: "نور أ.",
        rating: 5,
        comment: "ارتفعت درجاتي بشكل ملحوظ هذا الفصل الدراسي. أنصح به بشدة.",
        date: "2026-05-20",
      },
      {
        id: "r3",
        studentName: "كريم س.",
        rating: 4,
        comment: "مدرّس ممتاز، أتمنى لو كان هناك أوراق تدريب أكثر لكل درس.",
        date: "2026-04-11",
      },
    ],
  },
  {
    id: "t2",
    name: "منى فتحي",
    slug: "mona-fathy",
    avatarInitials: "من",
    title: "مدرّسة فيزياء وكيمياء",
    subjectId: "science",
    subjectName: "العلوم",
    yearsExperience: 10,
    rating: 4.8,
    reviewCount: 241,
    studentCount: 1120,
    about:
      "تؤمن منى بأن العلوم يجب أن تُرى لا أن تُحفظ فقط. يبدأ كل درس بتجربة قصيرة من واقع الحياة قبل الانتقال إلى المعادلات وراءها، ولهذا يقول طلابها دائمًا إن المفاهيم 'تترسخ' أخيرًا في حصتها. تحافظ على وتيرة ثابتة ومتوقعة لدوراتها، بإصدار درس جديد كل أسبوع.",
    credentials: [
      "ماجستير في الفيزياء التطبيقية، جامعة عين شمس",
      "10 أعوام من الخبرة في التدريس",
      "مراجعة سابقة للمناهج بوزارة التربية والتعليم",
    ],
    reviews: [
      {
        id: "r4",
        studentName: "ليلى ح.",
        rating: 5,
        comment: "أسلوب الشرح المعملي يجعل الكيمياء أقل تجريدًا بكثير.",
        date: "2026-06-10",
      },
      {
        id: "r5",
        studentName: "عمر ط.",
        rating: 5,
        comment: "أفضل مدرّسة فيزياء تعاملت معها. صبورة جدًا مع الأسئلة.",
        date: "2026-05-02",
      },
    ],
  },
  {
    id: "t3",
    name: "سارة إبراهيم",
    slug: "sara-ibrahim",
    avatarInitials: "سا",
    title: "مدرّسة لغة إنجليزية",
    subjectId: "english",
    subjectName: "اللغة الإنجليزية",
    yearsExperience: 8,
    rating: 4.7,
    reviewCount: 198,
    studentCount: 980,
    about:
      "تركّز سارة على الأمرين اللذين يرفعان الدرجات بأسرع شكل: دقة القواعد والثقة في الكتابة. تجمع دوراتها بين دروس قواعد قصيرة ومهام كتابة موجّهة، لتبني لدى الطلاب عادة تطبيق القواعد لا مجرد التعرف عليها في اختبار.",
    credentials: [
      "بكالوريوس آداب لغة إنجليزية، جامعة الإسكندرية",
      "حاصلة على شهادة CELTA",
      "8 أعوام من الخبرة في التدريس",
    ],
    reviews: [
      {
        id: "r6",
        studentName: "حبيبة ك.",
        rating: 5,
        comment: "تحسّنت مهارتي في كتابة المقالات بشكل كبير بعد دورة واحدة فقط.",
        date: "2026-05-28",
      },
      {
        id: "r7",
        studentName: "آدم ر.",
        rating: 4,
        comment: "شرح واضح، لكن الاختبارات قصيرة بعض الشيء.",
        date: "2026-04-30",
      },
    ],
  },
  {
    id: "t4",
    name: "حسن أبو الفتوح",
    slug: "hassan-aboul-fotouh",
    avatarInitials: "حأ",
    title: "مدرّس علوم حاسب",
    subjectId: "computer",
    subjectName: "علوم الحاسب",
    yearsExperience: 6,
    rating: 4.9,
    reviewCount: 156,
    studentCount: 740,
    about:
      "يعلّم حسن البرمجة بالطريقة التي كان يتمنى أن يتعلمها بها: ببناء أشياء صغيرة وفعلية منذ اليوم الأول. تنتقل دوراته من أساسيات الحاسوب إلى تمارين حقيقية لبناء المنطق البرمجي، مع اختبارات مصممة لاكتشاف نقاط الالتباس قبل ظهورها في الامتحان.",
    credentials: [
      "بكالوريوس هندسة حاسبات، جامعة القاهرة",
      "6 أعوام من الخبرة في التدريس",
      "مهندس برمجيات سابق",
    ],
    reviews: [
      {
        id: "r8",
        studentName: "ملك س.",
        rating: 5,
        comment: "فهمت أخيرًا الحلقات التكرارية والشروط بشكل صحيح.",
        date: "2026-06-15",
      },
    ],
  },
];

export const COURSES: Course[] = [
  {
    id: "c1",
    slug: "algebra-foundations",
    title: "أساسيات الجبر",
    subjectId: "math",
    teacherId: "t1",
    level: "prep-1",
    description:
      "رحلة من الصفر في التعبيرات الجبرية والمعادلات والمتباينات، بفيديو مشروح لكل درس واختبار قصير في نهايته.",
    lessonCount: 4,
    studentCount: 520,
    rating: 4.9,
    price: 0,
    lessons: [
      {
        id: "l1",
        title: "مقدمة في التعبيرات الجبرية",
        order: 1,
        duration: "18 دقيقة",
        isFree: true,
        description: "المتغيرات والحدود وكيفية قراءة التعبير الجبري.",
        videoId: PLACEHOLDER_VIDEO_ID,
        hasPdf: true,
        pdfPages: 8,
        hasQuiz: true,
        quizDurationSeconds: 180,
        quiz: [
          {
            id: "q1",
            question: "ما هو المعامل في الحد 7x؟",
            contentType: "ar",
            imageUrl: "https://placehold.co/400x200?text=7x",
            options: [
              { text: "x" },
              { text: "7" },
              { text: "7x" },
              { text: "1" },
            ],
            correctIndex: 1,
          },
          {
            id: "q2",
            question: "بسّط: 3x + 5x",
            contentType: "ar",
            options: [
              { text: "8x" },
              { text: "15x" },
              { text: "8x^2" },
              { text: "2x" },
            ],
            correctIndex: 0,
          },
          {
            id: "q3",
            question: "أي مما يلي متغير؟",
            contentType: "ar",
            options: [
              { text: "5" },
              { text: "x" },
              { text: "+" },
              { text: "=" },
            ],
            correctIndex: 1,
          },
        ],
      },
      {
        id: "l3",
        title: "حل المعادلات ذات الخطوة الواحدة",
        order: 2,
        duration: "22 دقيقة",
        isFree: false,
        description: "عزل المتغير باستخدام العمليات العكسية.",
        videoId: PLACEHOLDER_VIDEO_ID,
        hasPdf: true,
        pdfPages: 10,
        hasQuiz: true,
        quizDurationSeconds: 150,
        quiz: [
          {
            id: "q4",
            question: "حل من أجل x: x + 9 = 15",
            contentType: "ar",
            options: [
              { text: "x = 6" },
              { text: "x = 24" },
              { text: "x = 9" },
              { text: "x = 5" },
            ],
            correctIndex: 0,
          },
          {
            id: "q5",
            question: "حل من أجل x: 4x = 20",
            contentType: "ar",
            options: [
              { text: "x = 4" },
              { text: "x = 16" },
              { text: "x = 5" },
              { text: "x = 24" },
            ],
            correctIndex: 2,
          },
        ],
      },
      {
        id: "l5",
        title: "حل المعادلات ذات الخطوتين",
        order: 3,
        duration: "25 دقيقة",
        isFree: false,
        description: "الجمع بين العمليات لحل المجهول.",
        videoId: PLACEHOLDER_VIDEO_ID,
        hasPdf: true,
        pdfPages: 11,
      },
      {
        id: "l6",
        title: "مقدمة في المتباينات",
        order: 4,
        duration: "20 دقيقة",
        isFree: false,
        description: "قراءة المتباينات البسيطة وتمثيلها بيانيًا.",
        videoId: PLACEHOLDER_VIDEO_ID,
        hasPdf: true,
        pdfPages: 9,
      },
    ],
  },
  {
    id: "c2",
    slug: "geometry-essentials",
    title: "أساسيات الهندسة",
    subjectId: "math",
    teacherId: "t1",
    level: "prep-2",
    description:
      "الزوايا والمثلثات ومسائل المساحة موضحة بالفيديو، مع اختبارات لترسيخ كل قاعدة.",
    lessonCount: 3,
    studentCount: 410,
    rating: 4.8,
    price: 0,
    lessons: [
      {
        id: "l7",
        title: "الزوايا وأنواعها",
        order: 1,
        duration: "16 دقيقة",
        isFree: true,
        description: "الزوايا الحادة والمنفرجة والقائمة والمنعكسة.",
        videoId: PLACEHOLDER_VIDEO_ID,
        hasPdf: true,
        pdfPages: 7,
        hasQuiz: true,
        quizDurationSeconds: 120,
        quiz: [
          {
            id: "q6",
            question: "الزاوية الأكبر من 90° والأصغر من 180° تسمى:",
            contentType: "ar",
            imageUrl: "https://placehold.co/500x300?text=Angle+Diagram",
            options: [
              { text: "حادة" },
              { text: "منفرجة" },
              { text: "قائمة" },
              { text: "منعكسة" },
            ],
            correctIndex: 1,
          },
          {
            id: "q7",
            question: "الزاوية القائمة تقاس بـ:",
            contentType: "ar",
            options: [
              { text: "45°" },
              { text: "90°" },
              { text: "180°" },
              { text: "360°" },
            ],
            correctIndex: 1,
          },
        ],
      },
      {
        id: "l9",
        title: "خصائص المثلثات",
        order: 2,
        duration: "20 دقيقة",
        isFree: false,
        description: "مجموع الزوايا وأنواع المثلثات ومتباينة المثلث.",
        videoId: PLACEHOLDER_VIDEO_ID,
        hasPdf: true,
        pdfPages: 9,
      },
      {
        id: "l10",
        title: "المحيط والمساحة",
        order: 3,
        duration: "19 دقيقة",
        isFree: false,
        description: "حساب المحيط والمساحة للأشكال الشائعة.",
        videoId: PLACEHOLDER_VIDEO_ID,
        hasPdf: true,
        pdfPages: 8,
        hasQuiz: true,
        quizDurationSeconds: 180,
        quiz: [
          {
            id: "q8",
            question: "مجموع الزوايا الداخلية في المثلث يساوي:",
            contentType: "ar",
            options: [
              { text: "90°" },
              { text: "180°" },
              { text: "270°" },
              { text: "360°" },
            ],
            correctIndex: 1,
          },
          {
            id: "q9",
            question: "مساحة مستطيل أضلاعه 4 و 6 تساوي:",
            contentType: "ar",
            options: [
              { text: "10" },
              { text: "20" },
              { text: "24" },
              { text: "48" },
            ],
            correctIndex: 2,
          },
          {
            id: "q9b",
            question: "أي الأشكال التالية دائرة؟",
            contentType: "ar",
            options: [
              { imageUrl: "https://placehold.co/160x160?text=Square" },
              { imageUrl: "https://placehold.co/160x160?text=Circle" },
              { imageUrl: "https://placehold.co/160x160?text=Triangle" },
              { imageUrl: "https://placehold.co/160x160?text=Rectangle" },
            ],
            correctIndex: 1,
          },
        ],
      },
    ],
  },
  {
    id: "c3",
    slug: "physics-fundamentals",
    title: "أساسيات الفيزياء",
    subjectId: "science",
    teacherId: "t2",
    level: "sec-1",
    description:
      "الحركة والقوة والطاقة موضحة بالفيديو من خلال أمثلة يومية واختبارات قصيرة لكل محطة.",
    lessonCount: 3,
    studentCount: 380,
    rating: 4.8,
    price: 0,
    lessons: [
      {
        id: "l12",
        title: "الوحدات والقياس",
        order: 1,
        duration: "15 دقيقة",
        isFree: true,
        description: "الوحدات الدولية وكيفية التحويل بينها.",
        videoId: PLACEHOLDER_VIDEO_ID,
        hasPdf: true,
        pdfPages: 6,
        hasQuiz: true,
        quizDurationSeconds: 150,
        quiz: [
          {
            id: "q10",
            question: "الوحدة الدولية للكتلة هي:",
            contentType: "ar",
            options: [
              { text: "جرام" },
              { text: "كيلوجرام" },
              { text: "رطل" },
              { text: "نيوتن" },
            ],
            correctIndex: 1,
          },
          {
            id: "q11",
            question: "1 كم يساوي:",
            contentType: "ar",
            options: [
              { text: "10 م" },
              { text: "100 م" },
              { text: "1,000 م" },
              { text: "10,000 م" },
            ],
            correctIndex: 2,
          },
        ],
      },
      {
        id: "l14",
        title: "السرعة والسرعة المتجهة والتسارع",
        order: 2,
        duration: "24 دقيقة",
        isFree: false,
        description: "الفرق بين السرعة والسرعة المتجهة وكيفية عمل التسارع.",
        videoId: PLACEHOLDER_VIDEO_ID,
        hasPdf: true,
        pdfPages: 10,
      },
      {
        id: "l15",
        title: "قوانين نيوتن للحركة",
        order: 3,
        duration: "26 دقيقة",
        isFree: false,
        description: "القوانين الثلاثة التي تفسر حركة الأجسام.",
        videoId: PLACEHOLDER_VIDEO_ID,
        hasPdf: true,
        pdfPages: 12,
        hasQuiz: true,
        quizDurationSeconds: 120,
        quiz: [
          {
            id: "q12",
            question: "الجسم المتحرك يبقى متحركًا إلا إذا أثرت عليه:",
            contentType: "ar",
            options: [
              { text: "الجاذبية فقط" },
              { text: "قوة خارجية" },
              { text: "الزمن" },
              { text: "الكتلة" },
            ],
            correctIndex: 1,
          },
        ],
      },
    ],
  },
  {
    id: "c4",
    slug: "grammar-in-practice",
    title: "القواعد في التطبيق",
    subjectId: "english",
    teacherId: "t3",
    level: "prep-3",
    description:
      "الأزمنة وبناء الجملة والأخطاء الشائعة، بفيديو شرح واختبار بعد كل وحدة لترسيخها.",
    lessonCount: 2,
    studentCount: 300,
    rating: 4.7,
    price: 0,
    lessons: [
      {
        id: "l17",
        title: "زمن المضارع والماضي",
        order: 1,
        duration: "17 دقيقة",
        isFree: true,
        description: "تكوين واستخدام المضارع والماضي بشكل صحيح.",
        videoId: PLACEHOLDER_VIDEO_ID,
        hasPdf: true,
        pdfPages: 7,
        hasQuiz: true,
        quizDurationSeconds: 90,
        quiz: [
          {
            id: "q13",
            question: "Choose the correct tense: She ___ to school yesterday.",
            contentType: "en",
            options: [
              { text: "go" },
              { text: "goes" },
              { text: "went" },
              { text: "going" },
            ],
            correctIndex: 2,
          },
        ],
      },
      {
        id: "l19",
        title: "بناء الجملة",
        order: 2,
        duration: "20 دقيقة",
        isFree: false,
        description: "الفاعل والمسند وبناء جمل كاملة.",
        videoId: PLACEHOLDER_VIDEO_ID,
        hasPdf: true,
        pdfPages: 8,
        hasQuiz: true,
        quizDurationSeconds: 90,
        quiz: [
          {
            id: "q14",
            question: "Which of the following is a complete sentence?",
            contentType: "en",
            options: [
              { text: "Running fast." },
              { text: "The dog ran fast." },
              { text: "Fast the dog." },
              { text: "Dog fast running." },
            ],
            correctIndex: 1,
          },
        ],
      },
    ],
  },
  {
    id: "c5",
    slug: "intro-to-programming",
    title: "مقدمة في منطق البرمجة",
    subjectId: "computer",
    teacherId: "t4",
    level: "sec-1",
    description:
      "المتغيرات والشروط والحلقات التكرارية عبر فيديوهات ومسائل عملية صغيرة واختبارات.",
    lessonCount: 3,
    studentCount: 260,
    rating: 4.9,
    price: 0,
    lessons: [
      {
        id: "l21",
        title: "ما هي الخوارزمية؟",
        order: 1,
        duration: "14 دقيقة",
        isFree: true,
        description: "التفكير على شكل خطوات قبل كتابة أي كود.",
        videoId: PLACEHOLDER_VIDEO_ID,
        hasPdf: true,
        pdfPages: 6,
      },
      {
        id: "l22",
        title: "المتغيرات وأنواع البيانات",
        order: 2,
        duration: "19 دقيقة",
        isFree: true,
        description: "تخزين البيانات وتسميتها داخل البرنامج.",
        videoId: PLACEHOLDER_VIDEO_ID,
        hasPdf: true,
        pdfPages: 8,
        hasQuiz: true,
        quizDurationSeconds: 90,
        quiz: [
          {
            id: "q15",
            question: "أي كلمة مفتاحية تُستخدم للتحقق من شرط في معظم اللغات؟",
            contentType: "ar",
            options: [
              { text: "loop" },
              { text: "if" },
              { text: "print" },
              { text: "var" },
            ],
            correctIndex: 1,
          },
        ],
      },
      {
        id: "l24",
        title: "الحلقات التكرارية في التطبيق",
        order: 3,
        duration: "23 دقيقة",
        isFree: false,
        description: "تكرار الإجراءات باستخدام for و while.",
        videoId: PLACEHOLDER_VIDEO_ID,
        hasPdf: true,
        pdfPages: 10,
        hasQuiz: true,
        quizDurationSeconds: 120,
        quiz: [
          {
            id: "q16",
            question: "for i in range(3):\n    print(i)\n\nWhat does this code print?",
            contentType: "code",
            codeLanguage: "python",
            options: [
              { text: "0 1 2" },
              { text: "1 2 3" },
              { text: "0 1 2 3" },
              { text: "Error" },
            ],
            correctIndex: 0,
          },
          {
            id: "q17",
            question: "let total = 0;\nfor (let i = 1; i <= 3; i++) {\n  total += i;\n}\nconsole.log(total);\n\nWhat is logged?",
            contentType: "code",
            codeLanguage: "javascript",
            options: [
              { text: "3" },
              { text: "6" },
              { text: "1" },
              { text: "undefined" },
            ],
            correctIndex: 1,
          },
        ],
      },
    ],
  },
];

export function getSubjectById(id: string): Subject | undefined {
  return SUBJECTS.find((s) => s.id === id);
}

export function getTeacherBySlug(slug: string): Teacher | undefined {
  return TEACHERS.find((t) => t.slug === slug);
}

export function getTeacherById(id: string): Teacher | undefined {
  return TEACHERS.find((t) => t.id === id);
}

export function getCoursesByTeacher(teacherId: string): Course[] {
  return COURSES.filter((c) => c.teacherId === teacherId);
}

export function getCourseBySlug(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}

export function getLessonById(
  courseSlug: string,
  lessonId: string
): { course: Course; lesson: Lesson } | undefined {
  const course = getCourseBySlug(courseSlug);
  if (!course) return undefined;
  const lesson = course.lessons.find((l) => l.id === lessonId);
  if (!lesson) return undefined;
  return { course, lesson };
}
