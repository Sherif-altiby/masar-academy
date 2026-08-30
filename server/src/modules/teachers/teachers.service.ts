import { Prisma } from "@prisma/client";

import { prisma } from "../../db";
import { ApiError } from "../../utils/apiError";

const teacherListInclude = {
  user: true,
  subject: true,
} as const;

type TeacherWithUserAndSubject = Prisma.TeacherProfileGetPayload<{
  include: typeof teacherListInclude;
}>;

function mapTeacherSummary(teacher: TeacherWithUserAndSubject) {
  return {
    id: teacher.id,
    name: teacher.user.fullName,
    slug: teacher.slug,
    avatarInitials: teacher.user.avatarInitials,
    title: teacher.title,
    subjectId: teacher.subjectId,
    subjectName: teacher.subject.name,
    yearsExperience: teacher.yearsExperience,
    rating: teacher.ratingCache,
    reviewCount: teacher.reviewCountCache,
    studentCount: teacher.studentCountCache,
  };
}

export const teachersService = {
  async list(subjectId?: string) {
    const teachers = await prisma.teacherProfile.findMany({
      where: subjectId ? { subjectId } : undefined,
      include: teacherListInclude,
      orderBy: { ratingCache: "desc" },
    });
    return teachers.map(mapTeacherSummary);
  },

  async getBySlug(slug: string) {
    const teacher = await prisma.teacherProfile.findUnique({
      where: { slug },
      include: {
        user: true,
        subject: true,
        courses: {
          include: { _count: { select: { lessons: true } } },
          orderBy: { createdAt: "asc" },
        },
        reviews: {
          include: { student: true },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });

    if (!teacher) throw ApiError.notFound("المدرّس غير موجود");

    return {
      ...mapTeacherSummary(teacher),
      about: teacher.about,
      credentials: teacher.credentials,
      courses: teacher.courses.map((course) => ({
        id: course.id,
        slug: course.slug,
        title: course.title,
        description: course.description,
        lessonCount: course._count.lessons,
        studentCount: course.studentCountCache,
        rating: course.ratingCache,
      })),
      reviews: teacher.reviews.map((review) => ({
        id: review.id,
        studentName: review.student.fullName,
        rating: review.rating,
        comment: review.comment,
        date: review.createdAt,
      })),
    };
  },
};
