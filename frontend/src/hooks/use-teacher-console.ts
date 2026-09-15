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
  imageUrl: string;
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

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) =>
      unwrap(apiClient.delete(`/teacher/courses/${slug}`)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-courses"] });
    },
  });
}

export interface UpdateCoursePayload {
  title?: string;
  description?: string;
  imageUrl?: string;
  price?: number;
}

export function useUpdateCourse(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateCoursePayload) =>
      unwrap(apiClient.patch(`/teacher/courses/${slug}`, payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-courses"] });
      queryClient.invalidateQueries({ queryKey: ["teacher-course", slug] });
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
      if (pages !== undefined) formData.append("pages", String(pages));
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

export function useGetLessonQuiz(lessonId: string | undefined) {
  return useQuery({
    queryKey: ["teacher-lesson-quiz", lessonId],
    queryFn: () =>
      unwrap<{ quiz: ApiTeacherQuiz }>(
        apiClient.get(`/teacher/lessons/${lessonId}/quiz`)
      ).then((d) => d.quiz),
    enabled: Boolean(lessonId),
  });
}

export interface UpsertQuizPayload {
  durationMinutes: number;
  questions: {
    id?: string;
    question: string;
    contentType: "AR" | "CODE";
    codeLanguage?: "PYTHON" | "JAVASCRIPT" | null;
    correctIndex: number;
    order: number;
    options: { id?: string; text: string; order: number }[];
  }[];
}

export function useUpsertQuiz(lessonId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpsertQuizPayload) =>
      unwrap<{ quiz: ApiTeacherQuiz }>(
        apiClient.put(`/teacher/lessons/${lessonId}/quiz`, payload)
      ).then((d) => d.quiz),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-lesson-quiz", lessonId] });
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
