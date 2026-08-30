import { prisma } from "../../db";
import { ApiError } from "../../utils/apiError";

export const subjectsService = {
  async list() {
    const subjects = await prisma.subject.findMany({
      include: {
        _count: { select: { courses: true } },
        courses: { select: { studentCountCache: true } },
      },
    });

    return subjects.map((subject) => ({
      id: subject.id,
      name: subject.name,
      icon: subject.icon,
      description: subject.description,
      color: subject.color,
      courseCount: subject._count.courses,
      studentCount: subject.courses.reduce((sum, c) => sum + c.studentCountCache, 0),
    }));
  },

  async getById(id: string) {
    const subject = await prisma.subject.findUnique({ where: { id } });
    if (!subject) throw ApiError.notFound("المادة الدراسية غير موجودة");
    return subject;
  },
};
