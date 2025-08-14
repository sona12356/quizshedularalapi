import mongoose, { Schema, InferSchemaType } from "mongoose";

const ResponseSchema = new Schema({
  questionIndex: { type: Number, required: true },
  selectedIndex: { type: Number, required: true },
  correct: { type: Boolean, required: true }
}, { _id: false });

const ResultSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
  attemptNumber: { type: Number, required: true },
  startedAt: { type: Date, required: true },
  submittedAt: { type: Date },
  durationSeconds: { type: Number },
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  responses: { type: [ResponseSchema], default: [] }
}, { timestamps: true });

export type ResultDoc = InferSchemaType<typeof ResultSchema> & { _id: mongoose.Types.ObjectId };
export const Result = mongoose.model("Result", ResultSchema);
