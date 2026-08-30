import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config/env";
import { UPLOADS_STATIC_ROOT } from "./config/upload";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";
import { authRoutes } from "./modules/auth/auth.routes";
import { coursesRoutes } from "./modules/courses/courses.routes";
import { lessonsRoutes } from "./modules/lessons/lessons.routes";
import { reviewsRoutes } from "./modules/reviews/reviews.routes";
import { subjectsRoutes } from "./modules/subjects/subjects.routes";
import { teacherConsoleRoutes } from "./modules/teacherConsole/teacherConsole.routes";
import { teachersRoutes } from "./modules/teachers/teachers.routes";

export const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin: env.CORS_ORIGIN.split(",").map((o) => o.trim()),
    credentials: true,
  })
);
app.use(compression());
app.use(express.json());
app.use(cookieParser());
if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Uploaded PDFs/images are served statically.
app.use("/uploads", express.static(UPLOADS_STATIC_ROOT));

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ success: true, data: { status: "ok", timestamp: new Date().toISOString() } });
});

app.use("/api/auth", authRoutes);
app.use("/api/subjects", subjectsRoutes);
app.use("/api/teachers", teachersRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/lessons", lessonsRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/teacher", teacherConsoleRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
