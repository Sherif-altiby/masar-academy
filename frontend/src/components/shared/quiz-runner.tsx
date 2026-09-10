"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Clock, RotateCcw, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ApiQuizAttemptAnswer,
  ApiQuizAttemptResponse,
  ApiQuizForTaking,
  ApiQuizQuestionForTaking,
} from "@/lib/api-types";
import {
  CODE_LANGUAGE_LABELS,
  getContentDir,
  getContentFontClass,
  getContentTextAlign,
} from "@/lib/quiz-content";

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function QuestionPrompt({ question }: { question: ApiQuizQuestionForTaking }) {
  const dir = getContentDir(question.contentType);
  const fontClass = getContentFontClass(question.contentType);
  const alignClass = getContentTextAlign(question.contentType);
  const isCode = question.contentType === "CODE";

  return (
    <div className="space-y-3">
      {question.contentType !== "AR" && (
        <div className="flex items-center gap-1.5">
          <Badge variant="secondary" className="text-[11px]">
            {question.contentType === "CODE" && question.codeLanguage
              ? CODE_LANGUAGE_LABELS[question.codeLanguage]
              : "English"}
          </Badge>
        </div>
      )}

      {question.imageUrl && (
        <div className="overflow-hidden rounded-lg border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={question.imageUrl}
            alt=""
            className="max-h-64 w-full object-contain"
          />
        </div>
      )}

      {isCode ? (
        <pre
           
          className="overflow-x-auto rounded-lg bg-muted p-4 text-left font-mono text-sm leading-relaxed"
        >
          <code>{question.question}</code>
        </pre>
      ) : (
        <p dir={dir} className={cn("font-medium", fontClass, alignClass)}>
          {question.question}
        </p>
      )}
    </div>
  );
}

export function QuizRunner({
  quiz,
  courseSlug,
  courseTitle,
  onSubmit,
}: {
  quiz: ApiQuizForTaking;
  courseSlug: string;
  courseTitle: string;
  onSubmit: (payload: {
    answers: ApiQuizAttemptAnswer[];
    timedOut: boolean;
  }) => Promise<ApiQuizAttemptResponse>;
}) {
  const { questions, durationSeconds } = quiz;

  const [answers, setAnswers] = React.useState<Record<string, number>>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [result, setResult] = React.useState<ApiQuizAttemptResponse | null>(null);
  const [timedOut, setTimedOut] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(durationSeconds);

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;
  const submitted = result !== null;

  const submit = React.useCallback(
    async (didTimeOut: boolean) => {
      setSubmitting(true);
      try {
        const payload: ApiQuizAttemptAnswer[] = Object.entries(answers).map(
          ([questionId, optionIndex]) => ({ questionId, optionIndex })
        );
        const response = await onSubmit({ answers: payload, timedOut: didTimeOut });
        setResult(response);
        setTimedOut(didTimeOut);
      } finally {
        setSubmitting(false);
      }
    },
    [answers, onSubmit]
  );

  // Countdown timer — auto-submits the quiz once it reaches zero.
  React.useEffect(() => {
    if (submitted || submitting) return;
    if (timeLeft <= 0) {
      submit(true);
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, submitted, submitting, submit]);

  const timeRatio = timeLeft / durationSeconds;
  const timerUrgent = timeRatio <= 0.2;

  function selectAnswer(questionId: string, optionIndex: number) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  }

  function handleRetry() {
    setAnswers({});
    setResult(null);
    setTimedOut(false);
    setTimeLeft(durationSeconds);
  }

  if (result) {
    const scorePercent = result.score;

    return (
      <div className="space-y-6">
        <Card className="items-center gap-3 p-8 text-center">
          <span
            className={cn(
              "flex size-16 items-center justify-center rounded-full",
              scorePercent >= 60
                ? "bg-primary/10 text-primary"
                : "bg-destructive/10 text-destructive"
            )}
          >
            {scorePercent >= 60 ? (
              <CheckCircle2 className="size-8" />
            ) : (
              <XCircle className="size-8" />
            )}
          </span>
          <div>
            <p className="font-display text-2xl font-semibold">
              {scorePercent}٪
            </p>
            <p className="text-sm text-muted-foreground">
              {result.correctCount} من {result.totalQuestions} إجابة صحيحة
            </p>
            {timedOut && (
              <p className="mt-1 flex items-center justify-center gap-1.5 text-xs font-medium text-destructive">
                <Clock className="size-3.5" /> انتهى الوقت وتم إرسال إجاباتك
                تلقائيًا
              </p>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={handleRetry}>
              <RotateCcw /> إعادة الاختبار
            </Button>
            <Button asChild>
              <Link href={`/courses/${courseSlug}`}>
                العودة إلى {courseTitle}
              </Link>
            </Button>
          </div>
        </Card>

        <div className="space-y-4">
          {questions.map((question, index) => {
            const questionResult = result.results.find(
              (r) => r.questionId === question.id
            );
            const dir = getContentDir(question.contentType);
            const alignClass = getContentTextAlign(question.contentType);

            return (
              <Card key={question.id} className="gap-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    {index + 1}.
                  </span>
                  <Badge
                    variant={questionResult?.isCorrect ? "default" : "destructive"}
                    className="shrink-0"
                  >
                    {questionResult?.isCorrect
                      ? "صحيحة"
                      : questionResult?.selectedOptionId === null
                      ? "بدون إجابة"
                      : "خاطئة"}
                  </Badge>
                </div>

                <QuestionPrompt question={question} />

                <div className="space-y-2">
                  {question.options.map((option) => {
                    const isUserAnswer = questionResult?.selectedOptionId === option.id;
                    const isCorrectAnswer = questionResult?.correctOptionId === option.id;
                    return (
                      <div
                        key={option.id}
                        dir={dir}
                        className={cn(
                          "flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm",
                          alignClass,
                          isCorrectAnswer &&
                            "border-primary/40 bg-primary/5 text-foreground",
                          isUserAnswer &&
                            !isCorrectAnswer &&
                            "border-destructive/40 bg-destructive/5"
                        )}
                      >
                        <span className="flex flex-1 items-center gap-2">
                          {option.imageUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={option.imageUrl}
                              alt=""
                              className="size-12 shrink-0 rounded-md border object-cover"
                            />
                          )}
                          {option.text}
                        </span>
                        {isCorrectAnswer && (
                          <CheckCircle2 className="size-4 shrink-0 text-primary" />
                        )}
                        {isUserAnswer && !isCorrectAnswer && (
                          <XCircle className="size-4 shrink-0 text-destructive" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Timer */}
      <div
        className={cn(
          "flex items-center justify-between rounded-lg border px-4 py-3",
          timerUrgent
            ? "border-destructive/40 bg-destructive/5"
            : "border-border bg-card"
        )}
      >
        <span className="flex items-center gap-2 text-sm font-medium">
          <Clock
            className={cn(
              "size-4",
              timerUrgent ? "text-destructive" : "text-primary"
            )}
          />
          الوقت المتبقي
        </span>
        <span
          className={cn(
            "font-mono text-lg font-semibold tabular-nums",
            timerUrgent && "text-destructive"
          )}
        >
          {formatTime(Math.max(timeLeft, 0))}
        </span>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">تقدّمك</span>
          <span className="font-medium">
            {answeredCount} / {questions.length} تمت الإجابة عنها
          </span>
        </div>
        <Progress value={(answeredCount / questions.length) * 100} />
      </div>

      <div className="space-y-4">
        {questions.map((question, index) => {
          const dir = getContentDir(question.contentType);
          const alignClass = getContentTextAlign(question.contentType);

          return (
            <Card key={question.id} className="gap-3 p-5">
              <span className="text-sm font-medium text-muted-foreground">
                السؤال {index + 1}
              </span>

              <QuestionPrompt question={question} />

              <div className="space-y-2">
                {question.options.map((option, optionIndex) => {
                  const selected = answers[question.id] === optionIndex;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      dir={dir}
                      onClick={() => selectAnswer(question.id, optionIndex)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-md border px-3 py-2 text-sm transition-colors",
                        alignClass,
                        selected
                          ? "border-primary bg-primary/5"
                          : "hover:bg-secondary"
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded-full border",
                          selected && "border-primary bg-primary"
                        )}
                      >
                        {selected && (
                          <span className="size-1.5 rounded-full bg-primary-foreground" />
                        )}
                      </span>
                      {option.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={option.imageUrl}
                          alt=""
                          className="size-12 shrink-0 rounded-md border object-cover"
                        />
                      )}
                      <span className="flex-1">{option.text}</span>
                    </button>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>

      <Button
        size="lg"
        className="w-full"
        disabled={!allAnswered || submitting}
        onClick={() => submit(false)}
      >
        {submitting
          ? "جارٍ الإرسال…"
          : allAnswered
          ? "إرسال الإجابات"
          : `أجب عن كل الأسئلة للإرسال (${answeredCount}/${questions.length})`}
      </Button>
    </div>
  );
}
