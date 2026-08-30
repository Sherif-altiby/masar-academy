import { ApiCodeLanguage, ApiContentType } from "@/lib/api-types";

export function getContentDir(type: ApiContentType | undefined): "rtl" | "ltr" {
  return type === "AR" || type === undefined ? "rtl" : "ltr";
}

export function getContentFontClass(type: ApiContentType | undefined): string {
  return type === "CODE" ? "font-mono" : "font-sans";
}

export function getContentTextAlign(type: ApiContentType | undefined): string {
  return getContentDir(type) === "rtl" ? "text-right" : "text-left";
}

export const CODE_LANGUAGE_LABELS: Record<ApiCodeLanguage, string> = {
  PYTHON: "Python",
  JAVASCRIPT: "JavaScript",
};

export const CONTENT_TYPE_LABELS: Record<ApiContentType, string> = {
  AR: "عربي",
  EN: "English",
  CODE: "Code",
};
