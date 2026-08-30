import { z } from "zod";

export const submitQuizAttemptSchema = z.object({
  timedOut: z.boolean().default(false),
  answers: z.array(
    z.object({
      questionId: z.string().uuid(),
      optionIndex: z.number().int().min(0),
    })
  ),
});
export type SubmitQuizAttemptInput = z.infer<typeof submitQuizAttemptSchema>;
