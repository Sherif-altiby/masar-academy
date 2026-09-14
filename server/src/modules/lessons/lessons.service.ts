import { prisma } from "../../db";
import { ApiError } from "../../utils/apiError";
import { SubmitQuizAttemptInput } from "./lessons.validation";

export const lessonsService = {
  async getById(lessonId: string, userId: string) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: {
          select: {
            id: true,
            slug: true,
            title: true,
            lessons: { select: { id: true, order: true, title: true }, orderBy: { order: "asc" } },
          },
        },
      },
    });
    if (!lesson) throw ApiError.notFound("الدرس غير موجود");

    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId: lesson.courseId } },
      select: { completedLessonIds: true },
    });
    if (!enrollment) {
      throw ApiError.forbidden("يجب الاشتراك في الدورة لفتح الدروس");
    }

    return {
      ...lesson,
      isCompleted: enrollment?.completedLessonIds.includes(lesson.id) ?? false,
    };
  },

  async complete(userId: string, lessonId: string) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { id: true, courseId: true, order: true },
    });
    if (!lesson) throw ApiError.notFound("الدرس غير موجود");

    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId: lesson.courseId } },
    });
    if (!enrollment) {
      throw ApiError.forbidden("يجب التسجيل في الدورة قبل إكمال دروسها");
    }

    const completedLessonIds = enrollment.completedLessonIds.includes(lesson.id)
      ? enrollment.completedLessonIds
      : [...enrollment.completedLessonIds, lesson.id];
    const lessonCount = await prisma.lesson.count({ where: { courseId: lesson.courseId } });
    const progress = lessonCount
      ? Math.round((completedLessonIds.length / lessonCount) * 100)
      : 0;

    const updatedEnrollment = await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: { completedLessonIds, progress },
    });

    const nextLesson = await prisma.lesson.findFirst({
      where: { courseId: lesson.courseId, order: { gt: lesson.order } },
      select: { id: true, order: true },
      orderBy: { order: "asc" },
    });

    return {
      lessonId: lesson.id,
      isCompleted: true,
      progress: updatedEnrollment.progress,
      nextLesson,
    };
  },

  /** Quiz questions for a student to answer — correctIndex is withheld until grading. */
  async getQuizForTaking(lessonId: string, userId: string) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        quizQuestions: {
          orderBy: { order: "asc" },
          include: { options: { orderBy: { order: "asc" } } },
        },
      },
    });

    if (!lesson || !lesson.hasQuiz) {
      throw ApiError.notFound("لا يوجد اختبار لهذا الدرس");
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId: lesson.courseId } },
      select: { id: true },
    });
    if (!enrollment) {
      throw ApiError.forbidden("يجب الاشتراك في الدورة لفتح الاختبار");
    }

    return {
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      durationSeconds: lesson.quizDurationSeconds ?? lesson.quizQuestions.length * 60,
      questions: lesson.quizQuestions.map((q) => ({
        id: q.id,
        question: q.question,
        imageUrl: q.imageUrl,
        contentType: q.contentType,
        codeLanguage: q.codeLanguage,
        options: q.options.map((o) => ({ id: o.id, text: o.text, imageUrl: o.imageUrl })),
      })),
    };
  },

  /** Grades a submitted attempt server-side and persists it. */
  async submitQuizAttempt(userId: string, lessonId: string, input: SubmitQuizAttemptInput) {
    const questions = await prisma.quizQuestion.findMany({
      where: { lessonId },
      include: { options: { orderBy: { order: "asc" } } },
      orderBy: { order: "asc" },
    });

    if (questions.length === 0) {
      throw ApiError.notFound("لا يوجد اختبار لهذا الدرس");
    }

    const answerMap = new Map(input.answers.map((a) => [a.questionId, a.optionIndex]));

    let correctCount = 0;
    const results = questions.map((question) => {
      const optionIds = question.options.map((o) => o.id);
      const userOptionIndex = answerMap.get(question.id);
      const isCorrect = userOptionIndex === question.correctIndex;
      if (isCorrect) correctCount += 1;

      return {
        questionId: question.id,
        correctOptionId: optionIds[question.correctIndex],
        selectedOptionId:
          userOptionIndex !== undefined ? optionIds[userOptionIndex] ?? null : null,
        isCorrect,
      };
    });

    const score = Math.round((correctCount / questions.length) * 100);

    await prisma.quizAttempt.create({
      data: {
        userId,
        lessonId,
        score,
        correctCount,
        totalQuestions: questions.length,
        answers: input.answers,
        timedOut: input.timedOut,
      },
    });

    return { score, correctCount, totalQuestions: questions.length, results };
  },
};
