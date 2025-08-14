import { z } from "zod";

export const questionSchema = z.object({
  questionText: z.string().min(1),
  options: z.array(z.string().min(1)).min(2),
  correctOptionIndex: z.number().int().min(0)
});

export const createQuizSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  timeLimitSeconds: z.number().int().min(0).default(0),
  questions: z.array(questionSchema).min(1)
});

export type CreateQuizInput = z.infer<typeof createQuizSchema>;

export const updateQuizSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  timeLimitSeconds: z.number().int().min(0).optional(),
  questions: z.array(questionSchema).min(1).optional()
});

export type UpdateQuizInput = z.infer<typeof updateQuizSchema>;
