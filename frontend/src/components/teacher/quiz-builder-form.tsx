"use client";

import * as React from "react";
import { Clock, Image as ImageIcon, PlusCircle, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ApiCodeLanguage, ApiContentType, ApiTeacherQuizQuestion } from "@/lib/api-types";
import { UpsertQuizPayload } from "@/hooks/use-teacher-console";
import { getContentDir, getContentFontClass } from "@/lib/quiz-content";

interface DraftOption {
  text: string;
  imageFile: File | null;
  imagePreviewUrl: string | null;
  existingImageUrl?: string | null;
}

interface DraftQuestion {
  key: string;
  question: string;
  contentType: ApiContentType;
  codeLanguage: ApiCodeLanguage;
  imageFile: File | null;
  imagePreviewUrl: string | null;
  existingImageUrl?: string | null;
  options: DraftOption[];
  correctIndex: number;
}

let keyCounter = 0;
function nextKey() {
  keyCounter += 1;
  return `draft-${keyCounter}`;
}

function emptyOption(): DraftOption {
  return { text: "", imageFile: null, imagePreviewUrl: null };
}

function emptyQuestion(): DraftQuestion {
  return {
    key: nextKey(),
    question: "",
    contentType: "AR",
    codeLanguage: "PYTHON",
    imageFile: null,
    imagePreviewUrl: null,
    options: [emptyOption(), emptyOption(), emptyOption(), emptyOption()],
    correctIndex: 0,
  };
}

/** A small, controlled image picker used for both question and option images. */
function ImagePicker({
  previewUrl,
  onPick,
  onRemove,
  compact,
}: {
  previewUrl: string | null;
  onPick: (file: File) => void;
  onRemove: () => void;
  compact?: boolean;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onPick(file);
        }}
      />
      {previewUrl ? (
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt=""
            className={cn(
              "rounded-md border object-cover",
              compact ? "size-10" : "size-16"
            )}
          />
          <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
            <X /> إزالة
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
        >
          <ImageIcon /> {compact ? "صورة للاختيار" : "إضافة صورة للسؤال"}
        </Button>
      )}
    </div>
  );
}

interface QuizBuilderFormProps {
  initialQuestions?: ApiTeacherQuizQuestion[];
  initialDurationMinutes?: number;
  submitLabel?: string;
  uploadImage: (file: File) => Promise<string>;
  onSubmit: (payload: UpsertQuizPayload) => Promise<void>;
}

export function QuizBuilderForm({
  initialQuestions,
  initialDurationMinutes = 3,
  submitLabel = "حفظ الاختبار",
  uploadImage,
  onSubmit,
}: QuizBuilderFormProps) {
  const [durationMinutes, setDurationMinutes] = React.useState(
    initialDurationMinutes
  );
  const [questions, setQuestions] = React.useState<DraftQuestion[]>(() => {
    if (initialQuestions && initialQuestions.length > 0) {
      return initialQuestions.map((q) => ({
        key: nextKey(),
        question: q.question,
        contentType: q.contentType ?? "AR",
        codeLanguage: q.codeLanguage ?? "PYTHON",
        imageFile: null,
        imagePreviewUrl: null,
        existingImageUrl: q.imageUrl,
        options: q.options.map((o) => ({
          text: o.text ?? "",
          imageFile: null,
          imagePreviewUrl: null,
          existingImageUrl: o.imageUrl,
        })),
        correctIndex: q.correctIndex,
      }));
    }
    return [emptyQuestion()];
  });
  const [submitting, setSubmitting] = React.useState(false);

  function updateQuestion(key: string, patch: Partial<DraftQuestion>) {
    setQuestions((prev) =>
      prev.map((q) => (q.key === key ? { ...q, ...patch } : q))
    );
  }

  function updateOption(key: string, index: number, patch: Partial<DraftOption>) {
    setQuestions((prev) =>
      prev.map((q) =>
        q.key === key
          ? {
              ...q,
              options: q.options.map((o, i) =>
                i === index ? { ...o, ...patch } : o
              ),
            }
          : q
      )
    );
  }

  function setQuestionImage(key: string, file: File) {
    const url = URL.createObjectURL(file);
    updateQuestion(key, {
      imageFile: file,
      imagePreviewUrl: url,
      existingImageUrl: undefined,
    });
  }

  function removeQuestionImage(key: string) {
    updateQuestion(key, {
      imageFile: null,
      imagePreviewUrl: null,
      existingImageUrl: undefined,
    });
  }

  function setOptionImage(key: string, index: number, file: File) {
    const url = URL.createObjectURL(file);
    updateOption(key, index, {
      imageFile: file,
      imagePreviewUrl: url,
      existingImageUrl: undefined,
    });
  }

  function removeOptionImage(key: string, index: number) {
    updateOption(key, index, {
      imageFile: null,
      imagePreviewUrl: null,
      existingImageUrl: undefined,
    });
  }

  function addQuestion() {
    setQuestions((prev) => [...prev, emptyQuestion()]);
  }

  function removeQuestion(key: string) {
    setQuestions((prev) =>
      prev.length > 1 ? prev.filter((q) => q.key !== key) : prev
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const incomplete = questions.some((q) => {
      if (!q.question.trim()) return true;
      return q.options.some(
        (o) => !o.text.trim() && !o.imageFile && !o.existingImageUrl
      );
    });
    if (incomplete) {
      toast.error(
        "الرجاء إكمال نص كل سؤال، ونص أو صورة لكل اختيار من اختياراته."
      );
      return;
    }

    setSubmitting(true);
    try {
      // Upload any newly-picked images first, then build the JSON payload.
      const builtQuestions = await Promise.all(
        questions.map(async (q) => {
          const imageUrl = q.imageFile
            ? await uploadImage(q.imageFile)
            : q.existingImageUrl ?? undefined;

          const options = await Promise.all(
            q.options.map(async (o) => ({
              text: o.text || undefined,
              imageUrl: o.imageFile
                ? await uploadImage(o.imageFile)
                : o.existingImageUrl ?? undefined,
            }))
          );

          return {
            question: q.question,
            imageUrl,
            contentType: q.contentType,
            codeLanguage: q.contentType === "CODE" ? q.codeLanguage : undefined,
            correctIndex: q.correctIndex,
            options,
          };
        })
      );

      await onSubmit({ durationMinutes, questions: builtQuestions });
      toast.success("تم حفظ الاختبار بنجاح.");
    } catch {
      toast.error("تعذّر حفظ الاختبار.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="size-4 text-primary" /> مدة الاختبار
          </CardTitle>
          <CardDescription>
            الوقت الذي سيُمنح للطالب لإنهاء الاختبار قبل الإرسال التلقائي.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              min={1}
              max={60}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              dir="ltr"
              className="w-24 text-right"
            />
            <span className="text-sm text-muted-foreground">دقيقة</span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {questions.map((question, qIndex) => {
          const dir = getContentDir(question.contentType);
          const fontClass = getContentFontClass(question.contentType);
          const questionImage =
            question.imagePreviewUrl ?? question.existingImageUrl ?? null;

          return (
            <Card key={question.key} className="gap-4 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label className="text-sm font-semibold">
                  السؤال {qIndex + 1}
                </Label>
                <div className="flex items-center gap-2">
                  <Select
                    value={question.contentType}
                    onValueChange={(value) =>
                      updateQuestion(question.key, {
                        contentType: value as ApiContentType,
                      })
                    }
                  >
                    <SelectTrigger size="sm" className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AR">عربي</SelectItem>
                      <SelectItem value="EN">English</SelectItem>
                      <SelectItem value="CODE">Code</SelectItem>
                    </SelectContent>
                  </Select>
                  {question.contentType === "CODE" && (
                    <Select
                      value={question.codeLanguage}
                      onValueChange={(value) =>
                        updateQuestion(question.key, {
                          codeLanguage: value as ApiCodeLanguage,
                        })
                      }
                    >
                      <SelectTrigger size="sm" className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PYTHON">Python</SelectItem>
                        <SelectItem value="JAVASCRIPT">JavaScript</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQuestion(question.key)}
                    disabled={questions.length === 1}
                  >
                    <Trash2 /> حذف
                  </Button>
                </div>
              </div>

              <Textarea
                placeholder={
                  question.contentType === "CODE"
                    ? "الصق الشيفرة البرمجية هنا…"
                    : question.contentType === "EN"
                    ? "Type the question here"
                    : "اكتب نص السؤال هنا"
                }
                value={question.question}
                onChange={(e) =>
                  updateQuestion(question.key, { question: e.target.value })
                }
                dir={dir}
                className={cn(
                  "min-h-16",
                  fontClass,
                  dir === "ltr" ? "text-left" : "text-right"
                )}
              />

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  صورة السؤال (اختياري)
                </Label>
                <ImagePicker
                  previewUrl={questionImage}
                  onPick={(file) => setQuestionImage(question.key, file)}
                  onRemove={() => removeQuestionImage(question.key)}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  الاختيارات — حدد الإجابة الصحيحة (نص أو صورة أو كلاهما)
                </Label>
                <RadioGroup
                  value={question.correctIndex.toString()}
                  onValueChange={(value) =>
                    updateQuestion(question.key, {
                      correctIndex: Number(value),
                    })
                  }
                  className="gap-3"
                >
                  {question.options.map((option, oIndex) => {
                    const optionImage =
                      option.imagePreviewUrl ?? option.existingImageUrl ?? null;
                    return (
                      <div
                        key={oIndex}
                        className="flex flex-col gap-2 rounded-lg border p-2.5 sm:flex-row sm:items-center"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem
                            value={oIndex.toString()}
                            id={`${question.key}-${oIndex}`}
                          />
                          <Input
                            value={option.text}
                            onChange={(e) =>
                              updateOption(question.key, oIndex, {
                                text: e.target.value,
                              })
                            }
                            placeholder={`الاختيار ${oIndex + 1}`}
                            dir={dir}
                            className={cn(fontClass, "flex-1")}
                          />
                        </div>
                        <ImagePicker
                          previewUrl={optionImage}
                          onPick={(file) =>
                            setOptionImage(question.key, oIndex, file)
                          }
                          onRemove={() =>
                            removeOptionImage(question.key, oIndex)
                          }
                          compact
                        />
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            </Card>
          );
        })}
      </div>

      <Button type="button" variant="outline" onClick={addQuestion} className="w-full">
        <PlusCircle /> إضافة سؤال جديد
      </Button>

      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting ? "جارٍ حفظ الاختبار…" : submitLabel}
      </Button>
    </form>
  );
}
