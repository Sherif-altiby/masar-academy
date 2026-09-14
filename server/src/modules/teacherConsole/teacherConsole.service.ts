import { CodeLanguage, ContentType } from "@prisma/client";

import { prisma } from "../../db";
import { ApiError } from "../../utils/apiError";
import { LEVEL_ENUM_TO_SLUG } from "../../utils/levelMap";
import { extractYoutubeId } from "../../utils/youtube";
import { CreateLessonInput, UpsertQuizInput } from "./teacherConsole.validation";

async function getOwnedCourseOrThrow(teacherProfileId: string, slug: string) {
  const course = await prisma.course.findUnique({ where: { slug } });
  if (!course) throw ApiError.notFound("الدورة غير موجودة");
  if (course.teacherId !== teacherProfileId) {
    throw ApiError.forbidden("لا يمكنك إدارة دورة لا تخصك");
  }
  return course;
}

async function getOwnedLessonOrThrow(teacherProfileId: string, lessonId: string) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { course: true },
  });
  if (!lesson) throw ApiError.notFound("الدرس غير موجود");
  if (lesson.course.teacherId !== teacherProfileId) {
    throw ApiError.forbidden("لا يمكنك إدارة درس لا يخصك");
  }
  return lesson;
}

export const teacherConsoleService = {
  async getTeacherProfileByUserId(userId: string) {
    const profile = await prisma.teacherProfile.findUnique({ where: { userId } });
    if (!profile) {
      throw ApiError.forbidden("هذا الحساب ليس لديه ملف مدرّس نشط");
    }
    return profile;
  },

  async getOwnProfile(userId: string) {
    const profile = await this.getTeacherProfileByUserId(userId);
    const subject = await prisma.subject.findUnique({ where: { id: profile.subjectId } });
    return {
      id: profile.id,
      slug: profile.slug,
      title: profile.title,
      subjectId: profile.subjectId,
      subjectName: subject?.name ?? "",
      yearsExperience: profile.yearsExperience,
      about: profile.about,
      credentials: profile.credentials,
      rating: profile.ratingCache,
      reviewCount: profile.reviewCountCache,
      studentCount: profile.studentCountCache,
    };
  },

  async listOwnCourses(teacherProfileId: string) {
    const courses = await prisma.course.findMany({
      where: { teacherId: teacherProfileId },
      include: { _count: { select: { lessons: true } } },
      orderBy: { createdAt: "desc" },
    });
    return courses.map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      description: c.description,
      level: LEVEL_ENUM_TO_SLUG[c.level],
      price: c.price,
      rating: c.ratingCache,
      studentCount: c.studentCountCache,
      lessonCount: c._count.lessons,
    }));
  },

  async getOwnCourseWithLessons(teacherProfileId: string, slug: string) {
    const course = await getOwnedCourseOrThrow(teacherProfileId, slug);
    const lessons = await prisma.lesson.findMany({
      where: { courseId: course.id },
      orderBy: { order: "asc" },
    });
    return {
      id: course.id,
      slug: course.slug,
      title: course.title,
      description: course.description,
      studentCount: course.studentCountCache,
      lessons,
    };
  },

  async createLesson(
    teacherProfileId: string,
    courseSlug: string,
    input: CreateLessonInput
  ) {
    const course = await getOwnedCourseOrThrow(teacherProfileId, courseSlug);

    const videoId = extractYoutubeId(input.videoUrl);
    if (!videoId) {
      throw ApiError.badRequest("رابط يوتيوب غير صحيح");
    }

    const order =
      input.order ??
      ((await prisma.lesson.count({ where: { courseId: course.id } })) + 1);

    const lesson = await prisma.lesson.create({
      data: {
        courseId: course.id,
        title: input.title,
        description: input.description,
        duration: input.duration ?? "—",
        order,
        videoId,
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      },
    });

    return lesson;
  },

  async attachPdf(
    teacherProfileId: string,
    lessonId: string,
    file: { path: string; url: string },
    pages?: number
  ) {
    const lesson = await getOwnedLessonOrThrow(teacherProfileId, lessonId);

    return prisma.lesson.update({
      where: { id: lesson.id },
      data: { hasPdf: true, pdfUrl: file.url, pdfPages: pages ?? null },
    });
  },

  async upsertQuiz(teacherProfileId: string, lessonId: string, input: UpsertQuizInput) {
    const lesson = await getOwnedLessonOrThrow(teacherProfileId, lessonId);

    await prisma.$transaction(async (tx) => {
      // Replace-all strategy: simplest consistent way to "save" a quiz edited
      // as a whole form, rather than diffing individual question changes.
      await tx.quizQuestion.deleteMany({ where: { lessonId: lesson.id } });

      for (const [qIndex, q] of input.questions.entries()) {
        await tx.quizQuestion.create({
          data: {
            lessonId: lesson.id,
            question: q.question,
            imageUrl: q.imageUrl || null,
            contentType: q.contentType as ContentType,
            codeLanguage: (q.codeLanguage as CodeLanguage | undefined) ?? null,
            correctIndex: q.correctIndex,
            order: qIndex + 1,
            options: {
              create: q.options.map((o, oIndex) => ({
                text: o.text ?? "",
                imageUrl: o.imageUrl || null,
                order: oIndex,
              })),
            },
          },
        });
      }

      await tx.lesson.update({
        where: { id: lesson.id },
        data: {
          hasQuiz: true,
          quizDurationSeconds: input.durationMinutes * 60,
        },
      });
    });

    return this.getOwnLessonQuiz(teacherProfileId, lessonId);
  },

  async getOwnLessonQuiz(teacherProfileId: string, lessonId: string) {
    const lesson = await getOwnedLessonOrThrow(teacherProfileId, lessonId);
    const questions = await prisma.quizQuestion.findMany({
      where: { lessonId: lesson.id },
      orderBy: { order: "asc" },
      include: { options: { orderBy: { order: "asc" } } },
    });
    return {
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      durationMinutes: lesson.quizDurationSeconds
        ? Math.round(lesson.quizDurationSeconds / 60)
        : 3,
      questions,
    };
  },
};
