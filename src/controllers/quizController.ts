import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import { Quiz } from "../models/Quiz.js";
import { Result } from "../models/Result.js";
import { createQuizSchema, updateQuizSchema } from "../validators/quizSchemas.js";

export async function createQuiz(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createQuizSchema.parse(req.body);
    const quiz = await Quiz.create(data);
    res.status(201).json(quiz);
  } catch (err: any) {
    if (err?.name === "ZodError") return next(new createError.BadRequest(err.errors?.map((e:any)=>e.message).join("; ")));
    next(err);
  }
}

export async function updateQuiz(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateQuizSchema.parse(req.body);
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!quiz) throw new createError.NotFound("Quiz not found");
    res.json(quiz);
  } catch (err: any) {
    if (err?.name === "ZodError") return next(new createError.BadRequest(err.errors?.map((e:any)=>e.message).join("; ")));
    next(err);
  }
}

export async function deleteQuiz(req: Request, res: Response, next: NextFunction) {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) throw new createError.NotFound("Quiz not found");
    res.json({ ok: true });
  } catch (err) { next(err); }
}

export async function listQuizzes(_req: Request, res: Response, next: NextFunction) {
  try {
    const quizzes = await Quiz.find({}, { title: 1, description: 1, timeLimitSeconds: 1, createdAt: 1 });
    res.json(quizzes);
  } catch (err) { next(err); }
}

export async function startAttempt(req: Request, res: Response, next: NextFunction) {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) throw new createError.NotFound("Quiz not found");
    if (!req.user) throw new createError.Unauthorized();

    const previous = await Result.find({ userId: req.user.id, quizId: quiz._id }).sort({ attemptNumber: -1 }).limit(1);
    const attemptNumber = (previous[0]?.attemptNumber || 0) + 1;

    const startedAt = new Date();
    const result = await Result.create({
      userId: req.user.id,
      quizId: quiz._id,
      attemptNumber,
      startedAt,
      score: 0,
      total: quiz.questions.length,
      responses: []
    });

    const questions = quiz.questions.map(q => ({
      questionText: q.questionText,
      options: q.options
    }));

    res.status(201).json({
      attemptId: result._id,
      attemptNumber,
      startedAt,
      timeLimitSeconds: quiz.timeLimitSeconds,
      quiz: { id: quiz._id, title: quiz.title, description: quiz.description, questions }
    });
  } catch (err) { next(err); }
}

export async function submitAttempt(req: Request, res: Response, next: NextFunction) {
  try {
    const { answers } = req.body as { answers: number[] };
    if (!Array.isArray(answers)) throw new createError.BadRequest("answers must be an array of selected option indices");

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) throw new createError.NotFound("Quiz not found");

    const attempt = await Result.findById(req.params.attemptId);
    if (!attempt) throw new createError.NotFound("Attempt not found");
    if (!req.user || attempt.userId.toString() !== req.user.id) throw new createError.Forbidden();

    const submittedAt = new Date();
    const durationSeconds = Math.floor((submittedAt.getTime() - new Date(attempt.startedAt).getTime()) / 1000);

    if (quiz.timeLimitSeconds && quiz.timeLimitSeconds > 0 && durationSeconds > quiz.timeLimitSeconds) {
      attempt.score = 0;
      attempt.set('responses', []);
      attempt.submittedAt = submittedAt;
      attempt.durationSeconds = durationSeconds;
      await attempt.save();
      return res.status(200).json({ score: 0, total: quiz.questions.length, timedOut: true, correct: [], incorrect: [] });
    }

    const responses = quiz.questions.map((q, idx) => {
      const sel = answers[idx];
      const correct = sel === q.correctOptionIndex;
      return { questionIndex: idx, selectedIndex: sel, correct };
    });

    const score = responses.filter(r => r.correct).length;

    attempt.score = score;
    attempt.set('responses', responses);
    attempt.submittedAt = submittedAt;
    attempt.durationSeconds = durationSeconds;
    await attempt.save();

    const correct = responses.filter(r => r.correct).map(r => r.questionIndex);
    const incorrect = responses.filter(r => !r.correct).map(r => r.questionIndex);

    res.json({ score, total: quiz.questions.length, correct, incorrect });
  } catch (err) { next(err); }
}

export async function myResults(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new createError.Unauthorized();
    const results = await Result.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(results);
  } catch (err) { next(err); }
}

export async function allResults(_req: Request, res: Response, next: NextFunction) {
  try {
    const results = await Result.find({}).sort({ createdAt: -1 });
    res.json(results);
  } catch (err) { next(err); }
}
