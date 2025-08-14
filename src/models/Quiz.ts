import mongoose, { Schema, InferSchemaType } from "mongoose";

const QuestionSchema = new Schema({
  questionText: { type: String, required: true },
  options: { type: [String], required: true, validate: [(v: string[]) => v.length >= 2, "At least 2 options"] },
  correctOptionIndex: { type: Number, required: true }
}, { _id: false });

const QuizSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  timeLimitSeconds: { type: Number, default: 0 },
  questions: { type: [QuestionSchema], default: [] }
}, { timestamps: true });

export type QuizDoc = InferSchemaType<typeof QuizSchema> & { _id: mongoose.Types.ObjectId };
export const Quiz = mongoose.model("Quiz", QuizSchema);
