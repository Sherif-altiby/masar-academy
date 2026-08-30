import { Request, Response } from "express";

import { ApiError } from "../../utils/apiError";
import { asyncHandler } from "../../utils/asyncHandler";
import { publicPathFor } from "../../config/upload";
import { coursesService } from "../courses/courses.service";
import { teacherConsoleService } from "./teacherConsole.service";

async function currentTeacherProfileId(userId: string) {
  const profile = await teacherConsoleService.getTeacherProfileByUserId(userId);
  return profile.id;
}

export const teacherConsoleController = {
  getProfile: asyncHandler(async (req: Request, res: Response) => {
    const profile = await teacherConsoleService.getOwnProfile(req.user!.id);
    res.json({ success: true, data: { profile } });
  }),

  listCourses: asyncHandler(async (req: Request, res: Response) => {
    const teacherId = await currentTeacherProfileId(req.user!.id);
    const courses = await teacherConsoleService.listOwnCourses(teacherId);
    res.json({ success: true, data: { courses } });
  }),

  createCourse: asyncHandler(async (req: Request, res: Response) => {
    const teacherId = await currentTeacherProfileId(req.user!.id);
    const course = await coursesService.createForTeacher(teacherId, req.body);
    res.status(201).json({ success: true, data: { course } });
  }),

  getCourse: asyncHandler(async (req: Request, res: Response) => {
    const teacherId = await currentTeacherProfileId(req.user!.id);
    const course = await teacherConsoleService.getOwnCourseWithLessons(
      teacherId,
      String(req.params.slug)
    );
    res.json({ success: true, data: { course } });
  }),

  createLesson: asyncHandler(async (req: Request, res: Response) => {
    const teacherId = await currentTeacherProfileId(req.user!.id);
    const lesson = await teacherConsoleService.createLesson(
      teacherId,
      String(req.params.slug),
      req.body
    );
    res.status(201).json({ success: true, data: { lesson } });
  }),

  attachPdf: asyncHandler(async (req: Request, res: Response) => {
    const teacherId = await currentTeacherProfileId(req.user!.id);
    if (!req.file) {
      throw ApiError.badRequest("لم يتم إرفاق ملف PDF");
    }
    const pages = req.body.pages ? Number(req.body.pages) : undefined;
    const url = publicPathFor("pdfs", req.file.filename);
    const lesson = await teacherConsoleService.attachPdf(
      teacherId,
      String(req.params.lessonId),
      { path: req.file.path, url },
      pages
    );
    res.json({ success: true, data: { lesson } });
  }),

  uploadImage: asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      throw ApiError.badRequest("لم يتم إرفاق صورة");
    }
    const url = publicPathFor("images", req.file.filename);
    res.json({ success: true, data: { url } });
  }),

  getLessonQuiz: asyncHandler(async (req: Request, res: Response) => {
    const teacherId = await currentTeacherProfileId(req.user!.id);
    const quiz = await teacherConsoleService.getOwnLessonQuiz(
      teacherId,
      String(req.params.lessonId)
    );
    res.json({ success: true, data: { quiz } });
  }),

  upsertQuiz: asyncHandler(async (req: Request, res: Response) => {
    const teacherId = await currentTeacherProfileId(req.user!.id);
    const quiz = await teacherConsoleService.upsertQuiz(
      teacherId,
      String(req.params.lessonId),
      req.body
    );
    res.json({ success: true, data: { quiz } });
  }),
};
