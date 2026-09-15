import { Request, Response } from "express";

import { teacherConsoleService } from "./teacherConsole.service";

export const teacherConsoleController = {
	async listCourses(req: Request, res: Response) {
		const courses = await teacherConsoleService.listCourses(req.user!.id);
		res.json({ success: true, data: { courses } });
	},

	async getCourse(req: Request, res: Response) {
		const course = await teacherConsoleService.getCourse(
			req.user!.id,
			String(req.params.slug)
		);
		res.json({ success: true, data: { course } });
	},
};
