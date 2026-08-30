import { prisma } from "../../db";
import { ApiError } from "../../utils/apiError";
import { SubmitQuizAttemptInput } from "./lessons.validation";

export const lessonsService = {
  async getById(lessonId: string) {
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
    return lesson;
  },

  /** Quiz questions for a student to answer — correctIndex is withheld until grading. */
  async getQuizForTaking(lessonId: string) {
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
