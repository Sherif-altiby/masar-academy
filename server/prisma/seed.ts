import "dotenv/config";

import { prisma } from "../src/db";
import { hashPassword } from "../src/utils/password";
import { getInitials } from "../src/utils/initials";

const PLACEHOLDER_VIDEO_ID = "aqz-KE-bpKQ";
const DEMO_PASSWORD = "password123";

async function seed() {
  console.log("🌱 Seeding Masar Academy database…");

  // -------------------------------------------------------------------
  // Subjects
  // -------------------------------------------------------------------
  const [math, science, english, , computer] = await Promise.all([
    prisma.subject.create({
      data: { name: "الرياضيات", icon: "Sigma", description: "الجبر والهندسة وحل المسائل خطوة بخطوة.", color: "chart-1" },
    }),
    prisma.subject.create({
      data: { name: "العلوم", icon: "FlaskConical", description: "الفيزياء والكيمياء والأحياء مشروحة بأمثلة واقعية.", color: "chart-2" },
    }),
    prisma.subject.create({
      data: { name: "اللغة الإنجليزية", icon: "BookOpenText", description: "القواعد والفهم والتعبير الكتابي بأسلوب واضح.", color: "chart-3" },
    }),
    prisma.subject.create({
      data: { name: "اللغة العربية", icon: "Languages", description: "قواعد النحو والأدب وأساسيات التعبير الكتابي.", color: "chart-4" },
    }),
    prisma.subject.create({
      data: { name: "علوم الحاسب", icon: "Code2", description: "منطق البرمجة وأساسيات الحاسوب من الصفر.", color: "chart-5" },
    }),
    prisma.subject.create({
      data: { name: "الدراسات الاجتماعية", icon: "Globe2", description: "التاريخ والجغرافيا في قالب قصصي يسهل تذكّره.", color: "chart-1" },
    }),
  ]);
  console.log("  ✓ 6 subjects");

  // -------------------------------------------------------------------
  // Teacher users + profiles
  // -------------------------------------------------------------------
  const passwordHash = await hashPassword(DEMO_PASSWORD);

  const teacherSeeds = [
    {
      fullName: "أحمد السيد",
      email: "ahmed.elsayed@masar-academy.com",
      slug: "ahmed-el-sayed",
      title: "مدرّس أول للرياضيات",
      subjectId: math.id,
      yearsExperience: 14,
      about:
        "قضى أحمد أكثر من عشر سنوات في تحويل الجبر والهندسة من مادة مرعبة إلى مادة يتطلع الطلاب لدراستها فعلاً. يقسّم كل درس إلى خطوات صغيرة قابلة للاختبار، مع اختبار قصير في نهاية كل درس حتى لا يفوت الطالب أي تفصيلة.",
      credentials: [
        "بكالوريوس رياضيات، جامعة القاهرة",
        "14 عامًا من الخبرة في التدريس",
        "مؤلف سلسلة كتيبات 'الجبر ببساطة'",
      ],
    },
    {
      fullName: "منى فتحي",
      email: "mona.fathy@masar-academy.com",
      slug: "mona-fathy",
      title: "مدرّسة فيزياء وكيمياء",
      subjectId: science.id,
      yearsExperience: 10,
      about:
        "تؤمن منى بأن العلوم يجب أن تُرى لا أن تُحفظ فقط. يبدأ كل درس بتجربة قصيرة من واقع الحياة قبل الانتقال إلى المعادلات وراءها.",
      credentials: [
        "ماجستير في الفيزياء التطبيقية، جامعة عين شمس",
        "10 أعوام من الخبرة في التدريس",
        "مراجعة سابقة للمناهج بوزارة التربية والتعليم",
      ],
    },
    {
      fullName: "سارة إبراهيم",
      email: "sara.ibrahim@masar-academy.com",
      slug: "sara-ibrahim",
      title: "مدرّسة لغة إنجليزية",
      subjectId: english.id,
      yearsExperience: 8,
      about:
        "تركّز سارة على الأمرين اللذين يرفعان الدرجات بأسرع شكل: دقة القواعد والثقة في الكتابة.",
      credentials: [
        "بكالوريوس آداب لغة إنجليزية، جامعة الإسكندرية",
        "حاصلة على شهادة CELTA",
        "8 أعوام من الخبرة في التدريس",
      ],
    },
    {
      fullName: "حسن أبو الفتوح",
      email: "hassan.aboulfotouh@masar-academy.com",
      slug: "hassan-aboul-fotouh",
      title: "مدرّس علوم حاسب",
      subjectId: computer.id,
      yearsExperience: 6,
      about:
        "يعلّم حسن البرمجة بالطريقة التي كان يتمنى أن يتعلمها بها: ببناء أشياء صغيرة وفعلية منذ اليوم الأول.",
      credentials: [
        "بكالوريوس هندسة حاسبات، جامعة القاهرة",
        "6 أعوام من الخبرة في التدريس",
        "مهندس برمجيات سابق",
      ],
    },
  ];

  const teacherProfilesById: Record<string, string> = {}; // slug -> teacherProfile.id

  for (const t of teacherSeeds) {
    const user = await prisma.user.create({
      data: {
        fullName: t.fullName,
        email: t.email,
        passwordHash,
        phone: "01000000000",
        role: "TEACHER",
        avatarInitials: getInitials(t.fullName),
      },
    });

    const profile = await prisma.teacherProfile.create({
      data: {
        userId: user.id,
        slug: t.slug,
        title: t.title,
        subjectId: t.subjectId,
        yearsExperience: t.yearsExperience,
        about: t.about,
        credentials: t.credentials,
      },
    });

    teacherProfilesById[t.slug] = profile.id;
  }
  console.log(`  ✓ ${teacherSeeds.length} teachers`);

  // -------------------------------------------------------------------
  // Demo student
  // -------------------------------------------------------------------
  await prisma.user.create({
    data: {
      fullName: "يوسف مصطفى",
      email: "youssef.mostafa@example.com",
      passwordHash,
      phone: "01000000001",
      parentPhone: "01000000002",
      level: "SEC_1",
      role: "STUDENT",
      avatarInitials: getInitials("يوسف مصطفى"),
    },
  });
  console.log("  ✓ 1 demo student");

  // -------------------------------------------------------------------
  // Courses + lessons + quizzes
  // -------------------------------------------------------------------
  async function createCourse(opts: {
    slug: string;
    title: string;
    description: string;
    subjectId: string;
    teacherId: string;
    level: "PRIMARY_5" | "PRIMARY_6" | "PREP_1" | "PREP_2" | "PREP_3" | "SEC_1" | "SEC_2" | "SEC_3";
    studentCount: number;
    rating: number;
  }) {
    return prisma.course.create({
      data: {
        slug: opts.slug,
        title: opts.title,
        description: opts.description,
        subjectId: opts.subjectId,
        teacherId: opts.teacherId,
        level: opts.level,
        studentCountCache: opts.studentCount,
        ratingCache: opts.rating,
      },
    });
  }

  async function createLesson(
    courseId: string,
    opts: {
      title: string;
      order: number;
      duration: string;
      isFree: boolean;
      description: string;
      hasPdf?: boolean;
      pdfPages?: number;
      quizDurationSeconds?: number;
    }
  ) {
    return prisma.lesson.create({
      data: {
        courseId,
        title: opts.title,
        order: opts.order,
        duration: opts.duration,
        isFree: opts.isFree,
        description: opts.description,
        videoId: PLACEHOLDER_VIDEO_ID,
        hasPdf: opts.hasPdf ?? false,
        pdfPages: opts.pdfPages,
        hasQuiz: Boolean(opts.quizDurationSeconds),
        quizDurationSeconds: opts.quizDurationSeconds,
      },
    });
  }

  async function createQuestion(
    lessonId: string,
    opts: {
      question: string;
      order: number;
      correctIndex: number;
      contentType?: "AR" | "EN" | "CODE";
      codeLanguage?: "PYTHON" | "JAVASCRIPT";
      imageUrl?: string;
      options: { text?: string; imageUrl?: string }[];
    }
  ) {
    await prisma.quizQuestion.create({
      data: {
        lessonId,
        question: opts.question,
        order: opts.order,
        correctIndex: opts.correctIndex,
        contentType: opts.contentType ?? "AR",
        codeLanguage: opts.codeLanguage,
        imageUrl: opts.imageUrl,
        options: {
          create: opts.options.map((o, i) => ({ text: o.text, imageUrl: o.imageUrl, order: i })),
        },
      },
    });
  }

  // --- Algebra Foundations ---------------------------------------------
  const algebra = await createCourse({
    slug: "algebra-foundations",
    title: "أساسيات الجبر",
    description: "رحلة من الصفر في التعبيرات الجبرية والمعادلات والمتباينات، بفيديو مشروح لكل درس واختبار قصير في نهايته.",
    subjectId: math.id,
    teacherId: teacherProfilesById["ahmed-el-sayed"],
    level: "PREP_1",
    studentCount: 520,
    rating: 4.9,
  });

  const algebraLesson1 = await createLesson(algebra.id, {
    title: "مقدمة في التعبيرات الجبرية",
    order: 1,
    duration: "18 دقيقة",
    isFree: true,
    description: "المتغيرات والحدود وكيفية قراءة التعبير الجبري.",
    hasPdf: true,
    pdfPages: 8,
    quizDurationSeconds: 180,
  });
  await createQuestion(algebraLesson1.id, {
    question: "ما هو المعامل في الحد 7x؟",
    order: 1,
    correctIndex: 1,
    imageUrl: "https://placehold.co/400x200?text=7x",
    options: [{ text: "x" }, { text: "7" }, { text: "7x" }, { text: "1" }],
  });
  await createQuestion(algebraLesson1.id, {
    question: "بسّط: 3x + 5x",
    order: 2,
    correctIndex: 0,
    options: [{ text: "8x" }, { text: "15x" }, { text: "8x^2" }, { text: "2x" }],
  });

  const algebraLesson2 = await createLesson(algebra.id, {
    title: "حل المعادلات ذات الخطوة الواحدة",
    order: 2,
    duration: "22 دقيقة",
    isFree: false,
    description: "عزل المتغير باستخدام العمليات العكسية.",
    hasPdf: true,
    pdfPages: 10,
    quizDurationSeconds: 150,
  });
  await createQuestion(algebraLesson2.id, {
    question: "حل من أجل x: x + 9 = 15",
    order: 1,
    correctIndex: 0,
    options: [{ text: "x = 6" }, { text: "x = 24" }, { text: "x = 9" }, { text: "x = 5" }],
  });

  await createLesson(algebra.id, {
    title: "حل المعادلات ذات الخطوتين",
    order: 3,
    duration: "25 دقيقة",
    isFree: false,
    description: "الجمع بين العمليات لحل المجهول.",
    hasPdf: true,
    pdfPages: 11,
  });

  // --- Geometry Essentials ----------------------------------------------
  const geometry = await createCourse({
    slug: "geometry-essentials",
    title: "أساسيات الهندسة",
    description: "الزوايا والمثلثات ومسائل المساحة موضحة بصريًا، مع اختبارات لترسيخ كل قاعدة.",
    subjectId: math.id,
    teacherId: teacherProfilesById["ahmed-el-sayed"],
    level: "PREP_2",
    studentCount: 410,
    rating: 4.8,
  });

  const geometryLesson1 = await createLesson(geometry.id, {
    title: "الزوايا وأنواعها",
    order: 1,
    duration: "16 دقيقة",
    isFree: true,
    description: "الزوايا الحادة والمنفرجة والقائمة والمنعكسة.",
    hasPdf: true,
    pdfPages: 7,
    quizDurationSeconds: 120,
  });
  await createQuestion(geometryLesson1.id, {
    question: "أي الأشكال التالية دائرة؟",
    order: 1,
    correctIndex: 1,
    options: [
      { imageUrl: "https://placehold.co/160x160?text=Square" },
      { imageUrl: "https://placehold.co/160x160?text=Circle" },
      { imageUrl: "https://placehold.co/160x160?text=Triangle" },
      { imageUrl: "https://placehold.co/160x160?text=Rectangle" },
    ],
  });

  await createLesson(geometry.id, {
    title: "خصائص المثلثات",
    order: 2,
    duration: "20 دقيقة",
    isFree: false,
    description: "مجموع الزوايا وأنواع المثلثات ومتباينة المثلث.",
    hasPdf: true,
    pdfPages: 9,
  });

  // --- Physics Fundamentals ----------------------------------------------
  const physics = await createCourse({
    slug: "physics-fundamentals",
    title: "أساسيات الفيزياء",
    description: "الحركة والقوة والطاقة موضحة من خلال أمثلة يومية واختبارات قصيرة لكل محطة.",
    subjectId: science.id,
    teacherId: teacherProfilesById["mona-fathy"],
    level: "SEC_1",
    studentCount: 380,
    rating: 4.8,
  });

  const physicsLesson1 = await createLesson(physics.id, {
    title: "الوحدات والقياس",
    order: 1,
    duration: "15 دقيقة",
    isFree: true,
    description: "الوحدات الدولية وكيفية التحويل بينها.",
    hasPdf: true,
    pdfPages: 6,
    quizDurationSeconds: 150,
  });
  await createQuestion(physicsLesson1.id, {
    question: "الوحدة الدولية للكتلة هي:",
    order: 1,
    correctIndex: 1,
    options: [{ text: "جرام" }, { text: "كيلوجرام" }, { text: "رطل" }, { text: "نيوتن" }],
  });

  await createLesson(physics.id, {
    title: "قوانين نيوتن للحركة",
    order: 2,
    duration: "26 دقيقة",
    isFree: false,
    description: "القوانين الثلاثة التي تفسر حركة الأجسام.",
    hasPdf: true,
    pdfPages: 12,
  });

  // --- Grammar in Practice ------------------------------------------------
  const grammar = await createCourse({
    slug: "grammar-in-practice",
    title: "القواعد في التطبيق",
    description: "الأزمنة وبناء الجملة والأخطاء الشائعة، مع اختبار بعد كل وحدة لترسيخها.",
    subjectId: english.id,
    teacherId: teacherProfilesById["sara-ibrahim"],
    level: "PREP_3",
    studentCount: 300,
    rating: 4.7,
  });

  const grammarLesson1 = await createLesson(grammar.id, {
    title: "زمن المضارع والماضي",
    order: 1,
    duration: "17 دقيقة",
    isFree: true,
    description: "تكوين واستخدام المضارع والماضي بشكل صحيح.",
    hasPdf: true,
    pdfPages: 7,
    quizDurationSeconds: 90,
  });
  await createQuestion(grammarLesson1.id, {
    question: "Choose the correct tense: She ___ to school yesterday.",
    order: 1,
    correctIndex: 2,
    contentType: "EN",
    options: [{ text: "go" }, { text: "goes" }, { text: "went" }, { text: "going" }],
  });

  // --- Intro to Programming ------------------------------------------------
  const programming = await createCourse({
    slug: "intro-to-programming",
    title: "مقدمة في منطق البرمجة",
    description: "المتغيرات والشروط والحلقات التكرارية عبر مسائل عملية صغيرة واختبارات.",
    subjectId: computer.id,
    teacherId: teacherProfilesById["hassan-aboul-fotouh"],
    level: "SEC_1",
    studentCount: 260,
    rating: 4.9,
  });

  await createLesson(programming.id, {
    title: "ما هي الخوارزمية؟",
    order: 1,
    duration: "14 دقيقة",
    isFree: true,
    description: "التفكير على شكل خطوات قبل كتابة أي كود.",
    hasPdf: true,
    pdfPages: 6,
  });

  const programmingLesson2 = await createLesson(programming.id, {
    title: "المتغيرات وأنواع البيانات",
    order: 2,
    duration: "19 دقيقة",
    isFree: true,
    description: "تخزين البيانات وتسميتها داخل البرنامج.",
    hasPdf: true,
    pdfPages: 8,
    quizDurationSeconds: 90,
  });
  await createQuestion(programmingLesson2.id, {
    question: "أي كلمة مفتاحية تُستخدم للتحقق من شرط في معظم اللغات؟",
    order: 1,
    correctIndex: 1,
    options: [{ text: "loop" }, { text: "if" }, { text: "print" }, { text: "var" }],
  });

  const programmingLesson3 = await createLesson(programming.id, {
    title: "الحلقات التكرارية في التطبيق",
    order: 3,
    duration: "23 دقيقة",
    isFree: false,
    description: "تكرار الإجراءات باستخدام for و while.",
    hasPdf: true,
    pdfPages: 10,
    quizDurationSeconds: 120,
  });
  await createQuestion(programmingLesson3.id, {
    question: "for i in range(3):\n    print(i)\n\nWhat does this code print?",
    order: 1,
    correctIndex: 0,
    contentType: "CODE",
    codeLanguage: "PYTHON",
    options: [{ text: "0 1 2" }, { text: "1 2 3" }, { text: "0 1 2 3" }, { text: "Error" }],
  });
  await createQuestion(programmingLesson3.id, {
    question:
      "let total = 0;\nfor (let i = 1; i <= 3; i++) {\n  total += i;\n}\nconsole.log(total);\n\nWhat is logged?",
    order: 2,
    correctIndex: 1,
    contentType: "CODE",
    codeLanguage: "JAVASCRIPT",
    options: [{ text: "3" }, { text: "6" }, { text: "1" }, { text: "undefined" }],
  });

  console.log("  ✓ 5 courses with lessons and quizzes");

  console.log("\n✅ Seed complete!");
  console.log(`\nDemo accounts (password for all: "${DEMO_PASSWORD}"):`);
  console.log("  Teacher: ahmed.elsayed@masar-academy.com");
  console.log("  Teacher: mona.fathy@masar-academy.com");
  console.log("  Teacher: sara.ibrahim@masar-academy.com");
  console.log("  Teacher: hassan.aboulfotouh@masar-academy.com");
  console.log("  Student: youssef.mostafa@example.com");
}

seed()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
