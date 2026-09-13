/**
 * سكريبت تعبئة بيانات Prisma (TypeScript)
 * -------------------------------
 * يقوم بتعبئة: 5 مواد دراسية، 10 معلمين (User + TeacherProfile)، 15 طالبًا،
 * حوالي 20 دورة تدريبية، دروسًا لكل دورة، أسئلة/خيارات اختبارات لبعض
 * الدروس، تسجيلات (Enrollments)، محاولات اختبارات (QuizAttempts)،
 * تقييمات المعلمين، تقييمات المنصة، وعدد قليل من (RefreshTokens).
 *
 * طريقة الاستخدام (Prisma ORM 7 يتطلب driver adapter — هذا السكريبت يستخدم Postgres):
 *   npm install @prisma/client @prisma/adapter-pg bcryptjs dotenv
 *   npm install -D typescript tsx @types/node @types/bcryptjs
 *   npx tsx prisma/seed.ts
 *
 * تأكد من ضبط DATABASE_URL في ملف .env الخاص بك — هذا السكريبت يقوم بتحميله
 * بنفسه عبر `dotenv/config` لأن tsx/node لا يحمّلان .env تلقائيًا كما تفعل
 * واجهة سطر أوامر Prisma.
 *
 * أو قم بربطه كأمر seed رسمي في package.json:
 *   "prisma": { "seed": "tsx prisma/seed.ts" }
 * ثم شغّل: npx prisma db seed
 */

import "dotenv/config";
import {
  PrismaClient,
  EducationLevel,
  Grade,
  Level,
  ContentType,
  CodeLanguage,
  Lesson,
  Subject,
  TeacherProfile,
  User,
  Enrollment,
} from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// Prisma ORM 7 أزالت محرك الاستعلامات المدمج — أصبح الآن مطلوبًا استخدام
// driver adapter للاتصال بقاعدة البيانات. استبدل PrismaPg بالـ adapter
// المناسب لمزود مصدر البيانات لديك إذا لم يكن PostgreSQL (مثل
// @prisma/adapter-mysql، @prisma/adapter-libsql، @prisma/adapter-planetscale).
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ---------------------------------------------------------------------------
// دوال مساعدة
// ---------------------------------------------------------------------------

const uuid = (): string => crypto.randomUUID();

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals = 1): number {
  const val = Math.random() * (max - min) + min;
  return parseFloat(val.toFixed(decimals));
}

function randomChoice<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

function randomSubset<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, arr.length));
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// صورة غلاف افتراضية لكل دورة (بدون الحاجة لمفتاح API).
// يُستخدم الـ slug كـ seed لموقع picsum.photos، لذا فإن إعادة تشغيل
// السكريبت بنفس الـ slug يعطي دائمًا نفس الصورة — استبدل هذا برابط
// CDN حقيقي عندما تتوفر صور دورات فعلية.
function courseImageUrl(slug: string): string {
  return `https://picsum.photos/seed/${encodeURIComponent(slug)}/800/450`;
}

// نفس الفكرة، بمقاس مناسب لصورة مصغّرة لفيديو الدرس.
function lessonThumbnailUrl(seed: string): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/640/360`;
}

// صورة رمزية افتراضية (صورة شخص) للمستخدمين/المعلمين.
function avatarUrl(seed: string): string {
  return `https://i.pravatar.cc/300?u=${encodeURIComponent(seed)}`;
}

function initials(fullName: string): string {
  return fullName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ---------------------------------------------------------------------------
// بيانات مرجعية ثابتة
// ---------------------------------------------------------------------------

interface SubjectSeed {
  name: string;
  icon: string;
  color: string;
  description: string;
  // رابط صورة حقيقي محدد يدويًا لكل مادة (بدلاً من صورة عشوائية من picsum.photos)
  imageUrl: string;
}

const SUBJECTS_DATA: SubjectSeed[] = [
  {
    name: "الرياضيات",
    icon: "calculator",
    color: "#3B82F6",
    description:
      "الجبر والهندسة والتفاضل والتكامل وأساسيات حل المسائل لكل المراحل الدراسية.",
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Mathematics_concept_collage.jpg",
  },
  {
    name: "الفيزياء",
    icon: "atom",
    color: "#8B5CF6",
    description:
      "الميكانيكا والكهرباء والموجات والفيزياء الحديثة موضّحة بتجارب حقيقية.",
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Physics-collage-01.jpg",
  },
  {
    name: "الكيمياء",
    icon: "flask",
    color: "#10B981",
    description:
      "الكيمياء العضوية وغير العضوية والفيزيائية بفهم قائم على التجارب المعملية.",
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Chemistry_Laboratory_-_Bench.jpg",
  },
  {
    name: "الأحياء",
    icon: "dna",
    color: "#F59E0B",
    description: "بيولوجيا الخلية والوراثة وعلم وظائف الأعضاء والبيئة بأسلوب مرئي.",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Biology.jpg",
  },
  {
    name: "علوم الحاسب",
    icon: "code",
    color: "#EF4444",
    description:
      "أساسيات البرمجة والخوارزميات والتفكير الحاسوبي.",
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Programming_code.jpg",
  },
];

interface TeacherSeed {
  fullName: string;
  subjectIndex: number;
  title: string;
  yearsExperience: number;
  credentials: string[];
  about: string;
}

// معلمان لكل مادة (10 إجمالًا)، رقم الفهرس يشير إلى SUBJECTS_DATA
const TEACHERS_DATA: TeacherSeed[] = [
  {
    fullName: "Ahmed El-Sayed",
    subjectIndex: 0,
    title: "مدرّس رياضيات أول",
    yearsExperience: 12,
    credentials: ["جامعة القاهرة - بكالوريوس رياضيات", "مدرّب معتمد في مواد STEM"],
    about:
      "قضى أحمد أكثر من عقد في مساعدة الطلاب على إتقان الرياضيات من خلال أساليب مبسطة ومركّزة على الامتحانات.",
  },
  {
    fullName: "Mona Fathy",
    subjectIndex: 0,
    title: "قائدة منهج الرياضيات",
    yearsExperience: 9,
    credentials: ["جامعة عين شمس - ماجستير رياضيات تطبيقية"],
    about:
      "تتخصص منى في تبسيط مواضيع التفاضل والتكامل والجبر المتقدمة إلى دروس سهلة الفهم.",
  },
  {
    fullName: "Karim Abdel Rahman",
    subjectIndex: 1,
    title: "مدرّس فيزياء",
    yearsExperience: 10,
    credentials: ["جامعة الإسكندرية - بكالوريوس فيزياء"],
    about:
      "يقرّب كريم الفيزياء من الطلاب من خلال العروض العملية ومجموعات مسائل من واقع الحياة.",
  },
  {
    fullName: "Nourhan Adel",
    subjectIndex: 1,
    title: "مدرّسة فيزياء وعلوم تطبيقية",
    yearsExperience: 7,
    credentials: ["جامعة المنصورة - بكالوريوس فيزياء", "معتمدة في فيزياء البكالوريا الدولية"],
    about:
      "تركّز نورهان على الفهم المفاهيمي قبل حفظ القوانين.",
  },
  {
    fullName: "Youssef Hassan",
    subjectIndex: 2,
    title: "مدرّس كيمياء",
    yearsExperience: 14,
    credentials: ["جامعة القاهرة - ماجستير كيمياء"],
    about:
      "درّس يوسف الكيمياء لآلاف الطلاب في المرحلة الثانوية والبكالوريا.",
  },
  {
    fullName: "Salma Ibrahim",
    subjectIndex: 2,
    title: "متخصصة في الكيمياء العضوية",
    yearsExperience: 8,
    credentials: ["جامعة حلوان - بكالوريوس كيمياء"],
    about: "تجعل سلمى آليات الكيمياء العضوية سهلة الفهم من خلال خرائط تفاعل مرئية.",
  },
  {
    fullName: "Omar Khaled",
    subjectIndex: 3,
    title: "مدرّس أحياء",
    yearsExperience: 11,
    credentials: ["جامعة القاهرة - بكالوريوس أحياء"],
    about:
      "تمزج دروس عمر بين البيولوجيا الجزيئية والرسوم التوضيحية الواضحة وتقنيات الحفظ.",
  },
  {
    fullName: "Heba Mostafa",
    subjectIndex: 3,
    title: "مدرّسة أحياء ووراثة",
    yearsExperience: 6,
    credentials: ["جامعة الزقازيق - بكالوريوس أحياء"],
    about: "تُعنى هبة بتدريس علم الوراثة وفسيولوجيا الإنسان بشغف.",
  },
  {
    fullName: "Tarek Nabil",
    subjectIndex: 4,
    title: "مدرّس علوم حاسب",
    yearsExperience: 9,
    credentials: ["الجامعة الألمانية بالقاهرة - بكالوريوس علوم حاسب"],
    about:
      "يدرّس طارق أساسيات البرمجة باستخدام Python وJavaScript عبر التعلم القائم على المشاريع.",
  },
  {
    fullName: "Dina Samir",
    subjectIndex: 4,
    title: "مدرّسة برمجيات وخوارزميات",
    yearsExperience: 5,
    credentials: ["جامعة القاهرة - بكالوريوس هندسة حاسبات"],
    about:
      "تركّز دينا على التفكير الخوارزمي وممارسات البرمجة النظيفة للمبتدئين.",
  },
];

const STUDENT_NAMES: string[] = [
  "Malak Sherif", "Ziad Mahmoud", "Farida Adly", "Hassan Fouad",
  "Jana Wael", "Adam Ashraf", "Rana Tamer", "Yousef Emad",
  "Laila Nasser", "Mostafa Reda", "Habiba Amr", "Ali Osama",
  "Nada Waleed", "Mahmoud Sami", "Sara Gamal",
];

const EDUCATION_LEVELS: EducationLevel[] = ["PREPARATORY", "SECONDARY", "BACCALAUREATE"];

const GRADES_BY_LEVEL: Record<EducationLevel, Grade[]> = {
  PREPARATORY: ["PREP_1", "PREP_2", "PREP_3"],
  SECONDARY: ["SEC_1", "SEC_2", "SEC_3_MATH", "SEC_3_SCIENCE", "SEC_3_LITERATURE"],
  BACCALAUREATE: [
    "BAC_1",
    "BAC_2_ENGINEERING_CS",
    "BAC_2_MEDICINE_LIFE",
    "BAC_2_BUSINESS",
    "BAC_2_ARTS",
  ],
};

const COURSE_LEVELS: Level[] = [
  "PRIMARY_5",
  "PRIMARY_6",
  "PREP_1",
  "PREP_2",
  "PREP_3",
  "SEC_1",
  "SEC_2",
  "SEC_3",
];

const COURSE_TITLE_TEMPLATES: string[] = [
  "أساسيات {subject} الكاملة",
  "دورة إتقان {subject}",
  "{subject} للمبتدئين",
  "معسكر {subject} المتقدم",
  "التحضير لامتحان {subject}",
  "التعمق في {subject}",
];

const LESSON_TITLES: string[] = [
  "مقدمة ونظرة عامة",
  "شرح المفاهيم الأساسية",
  "أمثلة محلولة",
  "أخطاء شائعة يجب تجنبها",
  "مسائل تدريبية",
  "تطبيقات متقدمة",
  "أسئلة على نمط الامتحان",
  "ملخص ومراجعة الفصل",
];

// أنواع مساعدة محلية للكائنات التي نبنيها أثناء التنفيذ
type TeacherWithRelations = TeacherProfile & { subject: Subject; user: User };
type CourseWithTeacher = {
  id: string;
  teacher: TeacherWithRelations;
  [key: string]: unknown;
};
type EnrollmentWithRelations = Enrollment & {
  course: CourseWithTeacher;
  student: User;
  lessons: Lesson[];
};

// ---------------------------------------------------------------------------
// منطق التعبئة الرئيسي
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log("Cleaning existing data...");
  // الحذف بترتيب آمن حسب الاعتمادية بين الجداول
  await prisma.quiz_options.deleteMany();
  await prisma.quiz_questions.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.teacherReview.deleteMany();
  await prisma.platformReview.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.course.deleteMany();
  await prisma.teacherProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.subject.deleteMany();

  const passwordHash = await bcrypt.hash("Password123!", 10);

  // --- المواد الدراسية ------------------------------------------------------------
  console.log("Creating subjects...");
  const subjects: Subject[] = [];
  for (const s of SUBJECTS_DATA) {
    const subject = await prisma.subject.create({
      data: s, // s.imageUrl already contains the real image link
    });
    subjects.push(subject);
  }

  // --- المعلمون (User + TeacherProfile) ------------------------------------
  console.log("Creating teachers...");
  const teacherProfiles: TeacherWithRelations[] = [];
  for (const t of TEACHERS_DATA) {
    const subject = subjects[t.subjectIndex];
    const email = `${slugify(t.fullName)}@eduplatform.test`;

    const user = await prisma.user.create({
      data: {
        fullName: t.fullName,
        email,
        passwordHash,
        phone: `01${randomInt(0, 2)}${randomInt(10000000, 99999999)}`,
        role: "TEACHER",
        avatarInitials: initials(t.fullName),
        avatarUrl: avatarUrl(email),
      },
    });

    const teacherProfile = await prisma.teacherProfile.create({
      data: {
        userId: user.id,
        slug: slugify(t.fullName),
        title: t.title,
        subjectId: subject.id,
        yearsExperience: t.yearsExperience,
        about: t.about,
        avatarUrl: avatarUrl(`teacher-${slugify(t.fullName)}`),
        credentials: t.credentials,
        // حقول الـ cache يتم إعادة حسابها في نهاية السكريبت
      },
    });

    teacherProfiles.push({ ...teacherProfile, subject, user });
  }

  // --- الطلاب --------------------------------------------------------------
  console.log("Creating students...");
  const students: User[] = [];
  for (const fullName of STUDENT_NAMES) {
    const educationLevel: EducationLevel = randomChoice(EDUCATION_LEVELS);
    const grade: Grade = randomChoice(GRADES_BY_LEVEL[educationLevel]);
    const email = `${slugify(fullName)}@student.test`;

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash,
        phone: `01${randomInt(0, 2)}${randomInt(10000000, 99999999)}`,
        parentPhone:
          Math.random() > 0.3
            ? `01${randomInt(0, 2)}${randomInt(10000000, 99999999)}`
            : null,
        educationLevel,
        grade,
        role: "STUDENT",
        avatarInitials: initials(fullName),
        avatarUrl: avatarUrl(email),
      },
    });

    students.push(user);
  }

  // --- الدورات + الدروس + الاختبارات -----------------------------------------
  console.log("Creating courses, lessons and quizzes...");
  const courses: CourseWithTeacher[] = [];
  const lessonsByCourse: Record<string, Lesson[]> = {};

  for (const teacher of teacherProfiles) {
    const coursesForTeacher = randomInt(2, 3);

    for (let c = 0; c < coursesForTeacher; c++) {
      const titleTemplate = randomChoice(COURSE_TITLE_TEMPLATES);
      const title = titleTemplate.replace("{subject}", teacher.subject.name);
      const uniqueTitle = `${title} (${teacher.user.fullName.split(" ")[0]}${
        c > 0 ? ` ${c + 1}` : ""
      })`;

      const courseSlug = `${slugify(uniqueTitle)}-${randomInt(100, 999)}`;

      const course = await prisma.course.create({
        data: {
          slug: courseSlug,
          title: uniqueTitle,
          description: `دورة شاملة في ${teacher.subject.name} تغطي كل ما يحتاجه الطلاب، يقدّمها ${teacher.user.fullName}.`,
          imageUrl: courseImageUrl(courseSlug),
          subjectId: teacher.subject.id,
          teacherId: teacher.id,
          level: randomChoice(COURSE_LEVELS),
          price: randomChoice([0, 150, 250, 350, 500]),
        },
      });

      const courseWithTeacher: CourseWithTeacher = { ...course, teacher };
      courses.push(courseWithTeacher);

      // الدروس
      const lessonCount = randomInt(4, 8);
      const shuffledTitles = randomSubset(LESSON_TITLES, lessonCount);
      const lessons: Lesson[] = [];

      for (let l = 0; l < lessonCount; l++) {
        const hasQuiz = Math.random() > 0.4;
        const hasPdf = Math.random() > 0.5;

        const lesson = await prisma.lesson.create({
          data: {
            courseId: course.id,
            title: shuffledTitles[l] || `الدرس ${l + 1}`,
            order: l + 1,
            duration: `${randomInt(5, 25)}:${String(randomInt(0, 59)).padStart(2, "0")}`,
            isFree: l === 0, // الدرس الأول مجاني كمعاينة
            description: `في هذا الدرس، يستكشف الطلاب ${(
              shuffledTitles[l] || "الموضوع"
            )} ضمن مادة ${teacher.subject.name}.`,
            videoId: `vid_${uuid().slice(0, 12)}`,
            thumbnailUrl: lessonThumbnailUrl(`${course.slug}-lesson-${l + 1}`),
            hasPdf,
            pdfUrl: hasPdf ? `https://cdn.eduplatform.test/pdfs/${uuid()}.pdf` : null,
            pdfPages: hasPdf ? randomInt(3, 20) : null,
            hasQuiz,
            quizDurationSeconds: hasQuiz ? randomInt(300, 900) : null,
          },
        });

        lessons.push(lesson);

        // أسئلة وخيارات الاختبار للدروس التي تحتوي على اختبار
        if (hasQuiz) {
          const questionCount = randomInt(3, 5);

          for (let q = 0; q < questionCount; q++) {
            const contentType: ContentType =
              teacher.subject.name === "علوم الحاسب" && Math.random() > 0.5
                ? "CODE"
                : "AR";

            const question = await prisma.quiz_questions.create({
              data: {
                id: uuid(),
                lesson_id: lesson.id,
                question: `السؤال ${q + 1}: ما الصحيح بخصوص "${lesson.title}" في مادة ${teacher.subject.name}؟`,
                content_type: contentType,
                code_language:
                  contentType === "CODE"
                    ? randomChoice<CodeLanguage>(["PYTHON", "JAVASCRIPT"])
                    : null,
                correct_index: 0, // يُحدَّد بعد إنشاء الخيارات أدناه
                order: q + 1,
              },
            });

            const optionCount = 4;
            const correctIndex = randomInt(0, optionCount - 1);

            for (let o = 0; o < optionCount; o++) {
              await prisma.quiz_options.create({
                data: {
                  id: uuid(),
                  question_id: question.id,
                  text:
                    o === correctIndex
                      ? `الإجابة الصحيحة للسؤال ${q + 1}`
                      : `خيار غير صحيح ${o + 1}`,
                  order: o + 1,
                },
              });
            }

            await prisma.quiz_questions.update({
              where: { id: question.id },
              data: { correct_index: correctIndex },
            });
          }
        }
      }

      lessonsByCourse[course.id] = lessons;
    }
  }

  // --- التسجيلات -----------------------------------------------------------
  console.log("Creating enrollments...");
  const enrollments: EnrollmentWithRelations[] = [];

  for (const student of students) {
    const enrollCount = randomInt(2, 5);
    const chosenCourses = randomSubset(courses, enrollCount);

    for (const course of chosenCourses) {
      const lessons = lessonsByCourse[course.id];
      const completedCount = randomInt(0, lessons.length);
      const completedLessonIds = lessons.slice(0, completedCount).map((l) => l.id);
      const progress = Math.round((completedCount / lessons.length) * 100);

      const enrollment = await prisma.enrollment.create({
        data: {
          userId: student.id,
          courseId: course.id,
          progress,
          completedLessonIds,
        },
      });

      enrollments.push({ ...enrollment, course, student, lessons });
    }
  }

  // --- محاولات الاختبارات -----------------------------------------------------------
  console.log("Creating quiz attempts...");
  for (const enr of enrollments) {
    const quizLessons = enr.lessons.filter(
      (l) => l.hasQuiz && enr.completedLessonIds.includes(l.id)
    );

    for (const lesson of quizLessons) {
      const questions = await prisma.quiz_questions.findMany({
        where: { lesson_id: lesson.id },
        include: { quiz_options: true },
      });
      if (questions.length === 0) continue;

      const totalQuestions = questions.length;
      const correctCount = randomInt(Math.ceil(totalQuestions * 0.3), totalQuestions);
      const score = Math.round((correctCount / totalQuestions) * 100);

      const answers = questions.map((q, idx: number) => ({
        questionId: q.id,
        selectedIndex:
          idx < correctCount
            ? q.correct_index
            : (q.correct_index + 1) % q.quiz_options.length,
        isCorrect: idx < correctCount,
      }));

      await prisma.quizAttempt.create({
        data: {
          userId: enr.student.id,
          lessonId: lesson.id,
          score,
          correctCount,
          totalQuestions,
          answers,
          timedOut: Math.random() > 0.85,
        },
      });
    }
  }

  // --- تقييمات المعلمين ---------------------------------------------------------
  console.log("Creating teacher reviews...");
  const reviewedPairs = new Set<string>();
  for (const enr of enrollments) {
    const key = `${enr.course.teacher.id}:${enr.student.id}`;
    if (reviewedPairs.has(key)) continue;
    if (Math.random() > 0.6) continue; // ليس كل طالب يكتب تقييمًا

    reviewedPairs.add(key);
    await prisma.teacherReview.create({
      data: {
        teacherId: enr.course.teacher.id,
        studentId: enr.student.id,
        rating: randomInt(3, 5),
        comment: randomChoice<string | null>([
          "يشرح المفاهيم بوضوح شديد، أنصح به بشدة!",
          "مدرّس رائع، والدروس سهلة المتابعة.",
          "ساعدني كثيرًا في تحسين درجاتي.",
          "دورة جيدة لكنها تحتاج إلى مزيد من المسائل التدريبية.",
          null,
        ]),
      },
    });
  }

  // --- تقييمات المنصة ----------------------------------------------------
  console.log("Creating platform reviews...");
  const reviewedStudents = randomSubset(students, Math.ceil(students.length * 0.6));
  for (const student of reviewedStudents) {
    await prisma.platformReview.create({
      data: {
        studentId: student.id,
        rating: randomInt(3, 5),
        comment: randomChoice<string | null>([
          "أحب المنصة، سهلة الاستخدام جدًا.",
          "تشكيلة رائعة من الدورات والمعلمين.",
          "الاختبارات تساعدني حقًا في ترسيخ المادة.",
          null,
        ]),
      },
    });
  }

  // --- التوكنات (جلسات نموذجية) --------------------------
  console.log("Creating sample refresh tokens...");
  const sampleUsers: User[] = [
    ...teacherProfiles.slice(0, 2).map((t) => t.user),
    ...students.slice(0, 3),
  ];
  for (const user of sampleUsers) {
    const tokenHash = await bcrypt.hash(uuid(), 10);
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // +30 يومًا
      },
    });
  }

  // --- إعادة حساب حقول الـ cache ------------------------------------------------
  console.log("Recomputing cache fields...");

  // Course.studentCountCache من عدد التسجيلات
  for (const course of courses) {
    const studentCount = await prisma.enrollment.count({ where: { courseId: course.id } });
    await prisma.course.update({
      where: { id: course.id },
      data: {
        studentCountCache: studentCount,
        ratingCache: randomFloat(3.5, 5, 1),
      },
    });
  }

  // حقول cache الخاصة بـ TeacherProfile من TeacherReview وعدد الطلاب الفريدين المسجّلين
  for (const teacher of teacherProfiles) {
    const reviews = await prisma.teacherReview.findMany({ where: { teacherId: teacher.id } });
    const reviewCount = reviews.length;
    const avgRating =
      reviewCount > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount : 0;

    const teacherCourses = await prisma.course.findMany({ where: { teacherId: teacher.id } });
    const courseIds = teacherCourses.map((c) => c.id);
    const distinctStudents = await prisma.enrollment.findMany({
      where: { courseId: { in: courseIds } },
      select: { userId: true },
      distinct: ["userId"],
    });

    await prisma.teacherProfile.update({
      where: { id: teacher.id },
      data: {
        ratingCache: parseFloat(avgRating.toFixed(1)),
        reviewCountCache: reviewCount,
        studentCountCache: distinctStudents.length,
      },
    });
  }

  console.log("\nSeed complete:");
  console.log(`  Subjects:        ${subjects.length}`);
  console.log(`  Teachers:        ${teacherProfiles.length}`);
  console.log(`  Students:        ${students.length}`);
  console.log(`  Courses:         ${courses.length}`);
  console.log(`  Enrollments:     ${enrollments.length}`);
  console.log(`  Sample login (any seeded user): password = "Password123!"`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });