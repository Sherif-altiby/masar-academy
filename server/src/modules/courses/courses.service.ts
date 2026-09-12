import { randomUUID } from "crypto";

import { Level } from "@prisma/client";

import { prisma } from "../../db";
import { ApiError } from "../../utils/apiError";
import { LEVEL_ENUM_TO_SLUG, LEVEL_SLUG_TO_ENUM } from "../../utils/levelMap";
import slugify from "../../utils/slugify";
import { CreateCourseInput } from "./courses.validation";

function mapCourseSummary(course: {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  subjectId: string;
  teacherId: string;
  level: Level;
  price: number;
  ratingCache: number;
  studentCountCache: number;
  _count: { lessons: number };
}) {
  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    description: course.description,
    imageUrl: course.imageUrl,
    subjectId: course.subjectId,
    teacherId: course.teacherId,
    level: LEVEL_ENUM_TO_SLUG[course.level],
    price: course.price,
    rating: course.ratingCache,
    studentCount: course.studentCountCache,
    lessonCount: course._count.lessons,
  };
}

export const coursesService = {
  async list(filters: { subjectId?: string; teacherId?: string }) {
    const courses = await prisma.course.findMany({
      where: {
        subjectId: filters.subjectId,
        teacherId: filters.teacherId,
      },
      include: { _count: { select: { lessons: true } } },
      orderBy: { createdAt: "desc" },
    });
    return courses.map(mapCourseSummary);
  },

  async getBySlug(slug: string) {
    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        _count: { select: { lessons: true } },
        teacher: { include: { user: true } },
        lessons: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            title: true,
            order: true,
            duration: true,
            isFree: true,
            description: true,
            videoId: true,
            hasPdf: true,
            pdfPages: true,
            hasQuiz: true,
            quizDurationSeconds: true,
          },
        },
      },
    });

    if (!course) throw ApiError.notFound("الدورة غير موجودة");

    return {
      ...mapCourseSummary(course),
      teacherName: course.teacher.user.fullName,
      teacherSlug: course.teacher.slug,
      lessons: course.lessons,
    };
  },

  async createForTeacher(teacherProfileId: string, input: CreateCourseInput) {
    const baseSlug = slugify(input.title);
    let slug = baseSlug;
    let suffix = 1;
    // Ensure slug uniqueness by appending a numeric suffix if needed.
    // eslint-disable-next-line no-await-in-loop
    while (await prisma.course.findUnique({ where: { slug } })) {
      suffix += 1;
      slug = `${baseSlug}-${suffix}`;
    }

    const course = await prisma.course.create({
      data: {
        id: randomUUID(),
        slug,
        title: input.title,
        description: input.description,
        subjectId: input.subjectId,
        teacherId: teacherProfileId,
        level: LEVEL_SLUG_TO_ENUM[input.level],
        price: input.price,
        imageUrl: input.imageUrl,
      },
      include: { _count: { select: { lessons: true } } },
    });

    return mapCourseSummary(course);
  },
};
