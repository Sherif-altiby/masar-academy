/**
 * Prisma seed script (TypeScript)
 * -------------------------------
 * Seeds: 5 Subjects, 10 Teachers (User + TeacherProfile), 15 Students,
 * ~20 Courses, Lessons per course, quiz_questions/quiz_options for some
 * lessons, Enrollments, QuizAttempts, TeacherReviews, PlatformReviews,
 * and a couple of RefreshTokens.
 *
 * Usage (Prisma ORM 7 requires a driver adapter — this uses Postgres):
 *   npm install @prisma/client @prisma/adapter-pg bcryptjs dotenv
 *   npm install -D typescript tsx @types/node @types/bcryptjs
 *   npx tsx prisma/seed.ts
 *
 * Make sure DATABASE_URL is set in your .env file — this script loads it
 * itself via `dotenv/config` since tsx/node don't auto-load .env like the
 * Prisma CLI does.
 *
 * Or wire it up as the official Prisma seed command in package.json:
 *   "prisma": { "seed": "tsx prisma/seed.ts" }
 * then run: npx prisma db seed
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

// Prisma ORM 7 removed the built-in query engine — a driver adapter is now
// required to connect to the database. Swap PrismaPg for the adapter that
// matches your datasource provider if it isn't PostgreSQL (e.g.
// @prisma/adapter-mysql, @prisma/adapter-libsql, @prisma/adapter-planetscale).
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ---------------------------------------------------------------------------
// Helpers
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

// Deterministic placeholder cover image per course (no API key required).
// The slug is used as the picsum.photos seed, so re-running the script with
// the same slug always yields the same image — swap this out for real
// uploaded/CDN URLs whenever you have actual course artwork.
function courseImageUrl(slug: string): string {
  return `https://picsum.photos/seed/${encodeURIComponent(slug)}/800/450`;
}

// Same idea, sized for a subject banner/cover image.
function subjectImageUrl(name: string): string {
  return `https://picsum.photos/seed/${encodeURIComponent(slugify(name))}/600/400`;
}

// Same idea, sized for a lesson video thumbnail.
function lessonThumbnailUrl(seed: string): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/640/360`;
}

// Deterministic placeholder avatar (person photo) for users/teachers.
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
// Static reference data
// ---------------------------------------------------------------------------

interface SubjectSeed {
  name: string;
  icon: string;
  color: string;
  description: string;
}

const SUBJECTS_DATA: SubjectSeed[] = [
  {
    name: "Mathematics",
    icon: "calculator",
    color: "#3B82F6",
    description:
      "Algebra, geometry, calculus and problem-solving fundamentals for every stage.",
  },
  {
    name: "Physics",
    icon: "atom",
    color: "#8B5CF6",
    description:
      "Mechanics, electricity, waves and modern physics explained with real experiments.",
  },
  {
    name: "Chemistry",
    icon: "flask",
    color: "#10B981",
    description:
      "Organic, inorganic and physical chemistry with lab-based intuition.",
  },
  {
    name: "Biology",
    icon: "dna",
    color: "#F59E0B",
    description: "Cell biology, genetics, physiology and ecology made visual.",
  },
  {
    name: "Computer Science",
    icon: "code",
    color: "#EF4444",
    description:
      "Programming fundamentals, algorithms and computational thinking.",
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

// 2 teachers per subject (10 total), index into SUBJECTS_DATA
const TEACHERS_DATA: TeacherSeed[] = [
  {
    fullName: "Ahmed El-Sayed",
    subjectIndex: 0,
    title: "Senior Mathematics Instructor",
    yearsExperience: 12,
    credentials: ["Cairo University - B.Sc. Mathematics", "Certified STEM Trainer"],
    about:
      "Ahmed has spent over a decade helping students master mathematics through simplified, exam-focused techniques.",
  },
  {
    fullName: "Mona Fathy",
    subjectIndex: 0,
    title: "Mathematics Curriculum Lead",
    yearsExperience: 9,
    credentials: ["Ain Shams University - M.Sc. Applied Mathematics"],
    about:
      "Mona specializes in breaking down advanced calculus and algebra topics into digestible lessons.",
  },
  {
    fullName: "Karim Abdel Rahman",
    subjectIndex: 1,
    title: "Physics Instructor",
    yearsExperience: 10,
    credentials: ["Alexandria University - B.Sc. Physics"],
    about:
      "Karim brings physics to life through hands-on demonstrations and real-world problem sets.",
  },
  {
    fullName: "Nourhan Adel",
    subjectIndex: 1,
    title: "Physics & Applied Sciences Tutor",
    yearsExperience: 7,
    credentials: ["Mansoura University - B.Sc. Physics", "IB Physics Certified"],
    about:
      "Nourhan focuses on conceptual understanding before formula memorization.",
  },
  {
    fullName: "Youssef Hassan",
    subjectIndex: 2,
    title: "Chemistry Instructor",
    yearsExperience: 14,
    credentials: ["Cairo University - M.Sc. Chemistry"],
    about:
      "Youssef has taught chemistry to thousands of secondary and baccalaureate students.",
  },
  {
    fullName: "Salma Ibrahim",
    subjectIndex: 2,
    title: "Organic Chemistry Specialist",
    yearsExperience: 8,
    credentials: ["Helwan University - B.Sc. Chemistry"],
    about: "Salma makes organic chemistry mechanisms intuitive with visual reaction maps.",
  },
  {
    fullName: "Omar Khaled",
    subjectIndex: 3,
    title: "Biology Instructor",
    yearsExperience: 11,
    credentials: ["Cairo University - B.Sc. Biology"],
    about:
      "Omar's lessons blend molecular biology with clear diagrams and memory techniques.",
  },
  {
    fullName: "Heba Mostafa",
    subjectIndex: 3,
    title: "Biology & Genetics Tutor",
    yearsExperience: 6,
    credentials: ["Zagazig University - B.Sc. Biology"],
    about: "Heba is passionate about genetics and human physiology education.",
  },
  {
    fullName: "Tarek Nabil",
    subjectIndex: 4,
    title: "Computer Science Instructor",
    yearsExperience: 9,
    credentials: ["German University in Cairo - B.Sc. Computer Science"],
    about:
      "Tarek teaches programming fundamentals using Python and JavaScript with project-based learning.",
  },
  {
    fullName: "Dina Samir",
    subjectIndex: 4,
    title: "Software & Algorithms Tutor",
    yearsExperience: 5,
    credentials: ["Cairo University - B.Sc. Computer Engineering"],
    about:
      "Dina focuses on algorithmic thinking and clean coding practices for beginners.",
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
  "Complete {subject} Foundations",
  "{subject} Mastery Course",
  "{subject} for Beginners",
  "Advanced {subject} Bootcamp",
  "{subject} Exam Preparation",
  "{subject} Deep Dive",
];

const LESSON_TITLES: string[] = [
  "Introduction & Overview",
  "Core Concepts Explained",
  "Worked Examples",
  "Common Mistakes to Avoid",
  "Practice Problems",
  "Advanced Applications",
  "Exam-Style Questions",
  "Chapter Summary & Review",
];

// Local helper types for objects we build up as we go
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
// Main seed logic
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log("Cleaning existing data...");
  // Delete in dependency-safe order
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

  // --- Subjects ------------------------------------------------------------
  console.log("Creating subjects...");
  const subjects: Subject[] = [];
  for (const s of SUBJECTS_DATA) {
    const subject = await prisma.subject.create({
      data: { ...s, imageUrl: subjectImageUrl(s.name) },
    });
    subjects.push(subject);
  }

  // --- Teachers (User + TeacherProfile) ------------------------------------
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
        // caches recomputed at the end of the script
      },
    });

    teacherProfiles.push({ ...teacherProfile, subject, user });
  }

  // --- Students --------------------------------------------------------------
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

  // --- Courses + Lessons + Quizzes -----------------------------------------
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
          description: `A comprehensive ${teacher.subject.name} course covering everything students need, taught by ${teacher.user.fullName}.`,
          imageUrl: courseImageUrl(courseSlug),
          subjectId: teacher.subject.id,
          teacherId: teacher.id,
          level: randomChoice(COURSE_LEVELS),
          price: randomChoice([0, 150, 250, 350, 500]),
        },
      });

      const courseWithTeacher: CourseWithTeacher = { ...course, teacher };
      courses.push(courseWithTeacher);

      // Lessons
      const lessonCount = randomInt(4, 8);
      const shuffledTitles = randomSubset(LESSON_TITLES, lessonCount);
      const lessons: Lesson[] = [];

      for (let l = 0; l < lessonCount; l++) {
        const hasQuiz = Math.random() > 0.4;
        const hasPdf = Math.random() > 0.5;

        const lesson = await prisma.lesson.create({
          data: {
            courseId: course.id,
            title: shuffledTitles[l] || `Lesson ${l + 1}`,
            order: l + 1,
            duration: `${randomInt(5, 25)}:${String(randomInt(0, 59)).padStart(2, "0")}`,
            isFree: l === 0, // first lesson free as a preview
            description: `In this lesson, students explore ${(
              shuffledTitles[l] || "the topic"
            ).toLowerCase()} within ${teacher.subject.name}.`,
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

        // Quiz questions + options for lessons that have a quiz
        if (hasQuiz) {
          const questionCount = randomInt(3, 5);

          for (let q = 0; q < questionCount; q++) {
            const contentType: ContentType =
              teacher.subject.name === "Computer Science" && Math.random() > 0.5
                ? "CODE"
                : "AR";

            const question = await prisma.quiz_questions.create({
              data: {
                id: uuid(),
                lesson_id: lesson.id,
                question: `Question ${q + 1}: What is true about "${lesson.title}" in ${teacher.subject.name}?`,
                content_type: contentType,
                code_language:
                  contentType === "CODE"
                    ? randomChoice<CodeLanguage>(["PYTHON", "JAVASCRIPT"])
                    : null,
                correct_index: 0, // set after options creation below
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
                      ? `Correct answer for question ${q + 1}`
                      : `Distractor option ${o + 1}`,
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

  // --- Enrollments -----------------------------------------------------------
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

  // --- Quiz attempts -----------------------------------------------------------
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

  // --- Teacher reviews ---------------------------------------------------------
  console.log("Creating teacher reviews...");
  const reviewedPairs = new Set<string>();
  for (const enr of enrollments) {
    const key = `${enr.course.teacher.id}:${enr.student.id}`;
    if (reviewedPairs.has(key)) continue;
    if (Math.random() > 0.6) continue; // not every student reviews

    reviewedPairs.add(key);
    await prisma.teacherReview.create({
      data: {
        teacherId: enr.course.teacher.id,
        studentId: enr.student.id,
        rating: randomInt(3, 5),
        comment: randomChoice<string | null>([
          "Explains concepts very clearly, highly recommend!",
          "Great teacher, lessons are easy to follow.",
          "Helped me improve my grades a lot.",
          "Good course but could use more practice problems.",
          null,
        ]),
      },
    });
  }

  // --- Platform reviews ----------------------------------------------------
  console.log("Creating platform reviews...");
  const reviewedStudents = randomSubset(students, Math.ceil(students.length * 0.6));
  for (const student of reviewedStudents) {
    await prisma.platformReview.create({
      data: {
        studentId: student.id,
        rating: randomInt(3, 5),
        comment: randomChoice<string | null>([
          "Love the platform, very easy to use.",
          "Great selection of courses and teachers.",
          "The quizzes really help me retain the material.",
          null,
        ]),
      },
    });
  }

  // --- Refresh tokens (a couple of sample sessions) --------------------------
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
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // +30 days
      },
    });
  }

  // --- Recompute cache fields ------------------------------------------------
  console.log("Recomputing cache fields...");

  // Course.studentCountCache from enrollment counts
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

  // TeacherProfile caches from TeacherReview + distinct enrolled students
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