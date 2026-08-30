import { prisma } from "../../db";
import { ApiError } from "../../utils/apiError";
import { SubmitReviewInput } from "./reviews.validation";

async function recomputeTeacherRating(teacherId: string) {
  const agg = await prisma.teacherReview.aggregate({
    where: { teacherId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.teacherProfile.update({
    where: { id: teacherId },
    data: {
      ratingCache: agg._avg.rating ?? 0,
      reviewCountCache: agg._count.rating,
    },
  });
}

export const reviewsService = {
  async rateTeacher(studentId: string, teacherId: string, input: SubmitReviewInput) {
    const teacher = await prisma.teacherProfile.findUnique({ where: { id: teacherId } });
    if (!teacher) throw ApiError.notFound("المدرّس غير موجود");

    const review = await prisma.teacherReview.upsert({
      where: { teacherId_studentId: { teacherId, studentId } },
      update: { rating: input.rating, comment: input.comment },
      create: { teacherId, studentId, rating: input.rating, comment: input.comment },
    });

    await recomputeTeacherRating(teacherId);

    return review;
  },

  async ratePlatform(studentId: string, input: SubmitReviewInput) {
    return prisma.platformReview.upsert({
      where: { studentId },
      update: { rating: input.rating, comment: input.comment },
      create: { studentId, rating: input.rating, comment: input.comment },
    });
  },

  async myTeacherReviews(studentId: string) {
    return prisma.teacherReview.findMany({
      where: { studentId },
      include: { teacher: { include: { user: true } } },
    });
  },
};
