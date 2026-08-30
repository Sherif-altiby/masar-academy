import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient, unwrap } from "@/lib/api-client";
import {
  ApiCourseSummary,
  ApiTeacherOwnCourse,
  ApiTeacherOwnCourseDetail,
  ApiTeacherOwnLesson,
  ApiTeacherProfile,
  ApiTeacherQuiz,
} from "@/lib/api-types";

export function useMyTeacherProfile() {
  return useQuery({
    queryKey: ["teacher-profile"],
    queryFn: () =>
      unwrap<{ profile: ApiTeacherProfile }>(apiClient.get("/teacher/profile")).then(
        (d) => d.profile
      ),
  });
}

export function useMyCourses() {
  return useQuery({
    queryKey: ["teacher-courses"],
    queryFn: () =>
      unwrap<{ courses: ApiTeacherOwnCourse[] }>(apiClient.get("/teacher/courses")).then(
        (d) => d.courses
      ),
  });
}

export function useMyCourse(slug: string | undefined) {
  return useQuery({
    queryKey: ["teacher-course", slug],
    queryFn: () =>
      unwrap<{ course: ApiTeacherOwnCourseDetail }>(
        apiClient.get(`/teacher/courses/${slug}`)
      ).then((d) => d.course),
    enabled: Boolean(slug),
  });
}

export interface CreateCoursePayload {
  title: string;
  description: string;
  subjectId: string;
  level: string;
  price: number;
}

export function useCreateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCoursePayload) =>
      unwrap<{ course: ApiCourseSummary }>(apiClient.post("/teacher/courses", payload)).then(
        (d) => d.course
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-courses"] });
    },
  });
}

export interface CreateLessonPayload {
  title: string;
  description: string;
  videoUrl: string;
  duration?: string;
  order?: number;
  isFree: boolean;
}

export function useCreateLesson(courseSlug: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLessonPayload) =>
      unwrap<{ lesson: ApiTeacherOwnLesson }>(
        apiClient.post(`/teacher/courses/${courseSlug}/lessons`, payload)
      ).then((d) => d.lesson),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-course", courseSlug] });
    },
  });
}

export function useUploadLessonPdf(courseSlug: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      lessonId,
      file,
      pages,
    }: {
      lessonId: string;
      file: File;
      pages?: number;
    }) => {
      const formData = new FormData();
      formData.append("pdf", file);
      if (pages) formData.append("pages", String(pages));
      return unwrap<{ lesson: ApiTeacherOwnLesson }>(
        apiClient.post(`/teacher/lessons/${lessonId}/pdf`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      ).then((d) => d.lesson);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-course", courseSlug] });
    },
  });
}

export function useUploadImage() {
  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      return unwrap<{ url: string }>(
        apiClient.post("/teacher/uploads/image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      ).then((d) => d.url);
    },
  });
}

export function useMyLessonQuiz(lessonId: string | undefined) {
  return useQuery({
    queryKey: ["teacher-lesson-quiz", lessonId],
    queryFn: () =>
      unwrap<{ quiz: ApiTeacherQuiz }>(apiClient.get(`/teacher/lessons/${lessonId}/quiz`)).then(
        (d) => d.quiz
      ),
    enabled: Boolean(lessonId),
    retry: false,
  });
}

export interface UpsertQuizPayload {
  durationMinutes: number;
  questions: {
    question: string;
    imageUrl?: string;
    contentType: "AR" | "EN" | "CODE";
    codeLanguage?: "PYTHON" | "JAVASCRIPT";
    correctIndex: number;
    options: { text?: string; imageUrl?: string }[];
  }[];
}

export function useUpsertQuiz(lessonId: string | undefined, courseSlug: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpsertQuizPayload) =>
      unwrap<{ quiz: ApiTeacherQuiz }>(
        apiClient.put(`/teacher/lessons/${lessonId}/quiz`, payload)
      ).then((d) => d.quiz),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-lesson-quiz", lessonId] });
      queryClient.invalidateQueries({ queryKey: ["teacher-course", courseSlug] });
    },
  });
}
