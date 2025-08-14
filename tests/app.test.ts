import request from "supertest";
import mongoose from "mongoose";
import { app } from "../src/app.js";
import { connectDB } from "../src/config/db.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/quiz_engine_api_test";

beforeAll(async () => { await connectDB(MONGODB_URI); });
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

let userToken = "";
let adminToken = "";
let quizId = "";
let attemptId = "";

test("register admin and user", async () => {
  const admin = await request(app).post("/api/auth/register").send({ email: "admin@test.com", password: "secret12", role: "admin" });
  expect(admin.status).toBe(201);
  adminToken = admin.body.token;

  const user = await request(app).post("/api/auth/register").send({ email: "user@test.com", password: "secret12", role: "user" });
  expect(user.status).toBe(201);
  userToken = user.body.token;
});

test("admin creates quiz", async () => {
  const res = await request(app)
    .post("/api/quizzes")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      title: "JS Basics",
      description: "Simple quiz",
      timeLimitSeconds: 30,
      questions: [
        { questionText: "2+2=?", options: ["3", "4"], correctOptionIndex: 1 },
        { questionText: "Capital of France?", options: ["Paris", "Rome"], correctOptionIndex: 0 }
      ]
    });
  expect(res.status).toBe(201);
  quizId = res.body._id;
});

test("user starts attempt", async () => {
  const res = await request(app)
    .post(`/api/quizzes/${quizId}/attempts/start`)
    .set("Authorization", `Bearer ${userToken}`)
    .send();
  expect(res.status).toBe(201);
  attemptId = res.body.attemptId;
  expect(res.body.quiz.questions[0]).not.toHaveProperty("correctOptionIndex");
});

test("user submits attempt", async () => {
  const res = await request(app)
    .post(`/api/quizzes/${quizId}/attempts/${attemptId}/submit`)
    .set("Authorization", `Bearer ${userToken}`)
    .send({ answers: [1, 0] });
  expect(res.status).toBe(200);
  expect(res.body.score).toBe(2);
  expect(res.body.total).toBe(2);
});
