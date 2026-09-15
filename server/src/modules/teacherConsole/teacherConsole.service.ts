import { prisma } from "../../db";
import { ApiError } from "../../utils/apiError";
import { coursesService } from "../courses/courses.service";

export const teacherConsoleService = {
	async listCourses(userId: string) {
		const teacher = await prisma.teacherProfile.findUnique({
			where: { userId },
			select: { id: true },
		});

		if (!teacher) {
			throw ApiError.notFound("ملف المدرّس غير موجود");
		}

		const courses = await coursesService.list({ teacherId: teacher.id });

		return courses.map(({ id, slug, title, description, imageUrl, level, price, rating, studentCount, lessonCount }) => ({
			id,
			slug,
			title,
			description,
			imageUrl,
			level,
			price,
			rating,
			studentCount,
			lessonCount,
		}));
	},

	async getCourse(userId: string, slug: string) {
		const teacher = await prisma.teacherProfile.findUnique({
			where: { userId },
			select: { id: true },
		});

		if (!teacher) {
			throw ApiError.notFound("ملف المدرّس غير موجود");
		}

		const course = await prisma.course.findUnique({
			where: { slug },
			include: {
				lessons: {
					orderBy: { order: "asc" },
				},
			},
		});

		if (!course || course.teacherId !== teacher.id) {
			throw ApiError.notFound("الدورة غير موجودة");
		}

		return {
			id: course.id,
			slug: course.slug,
			title: course.title,
			description: course.description,
			imageUrl: course.imageUrl,
			studentCount: course.studentCountCache,
			lessons: course.lessons.map((lesson) => ({
				id: lesson.id,
				courseId: lesson.courseId,
				title: lesson.title,
				order: lesson.order,
				duration: lesson.duration,
				isFree: false,
				description: lesson.description,
				videoId: lesson.videoId,
				hasPdf: lesson.hasPdf,
				pdfUrl: lesson.pdfUrl,
				pdfPages: lesson.pdfPages,
				hasQuiz: lesson.hasQuiz,
				quizDurationSeconds: lesson.quizDurationSeconds,
			})),
		};
	},
};
