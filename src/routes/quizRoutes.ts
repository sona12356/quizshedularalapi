import { Router } from "express";
import { auth, requireRole } from "../middleware/auth.js";
import {
  createQuiz, updateQuiz, deleteQuiz, listQuizzes,
  startAttempt, submitAttempt, myResults, allResults
} from "../controllers/quizController.js";

const r = Router();

/**
 * @openapi
 * /quizzes:
 *   get:
 *     summary: List quizzes
 *     tags: [Quizzes]
 *     responses:
 *       200:
 *         description: OK
 */
r.get("/", listQuizzes);

/**
 * @openapi
 * /quizzes:
 *   post:
 *     summary: Create a quiz (admin)
 *     tags: [Quizzes]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, questions]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               timeLimitSeconds: { type: integer, minimum: 0 }
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [questionText, options, correctOptionIndex]
 *                   properties:
 *                     questionText: { type: string }
 *                     options:
 *                       type: array
 *                       items: { type: string }
 *                       minItems: 2
 *                     correctOptionIndex: { type: integer, minimum: 0 }
 *     responses:
 *       201: { description: Created }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 */
r.post("/", auth(), requireRole("admin"), createQuiz);

/**
 * @openapi
 * /quizzes/{id}:
 *   patch:
 *     summary: Update a quiz (admin)
 *     tags: [Quizzes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Updated }
 *       404: { description: Not found }
 */
r.patch("/:id", auth(), requireRole("admin"), updateQuiz);

/**
 * @openapi
 * /quizzes/{id}:
 *   delete:
 *     summary: Delete a quiz (admin)
 *     tags: [Quizzes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Deleted }
 *       404: { description: Not found }
 */
r.delete("/:id", auth(), requireRole("admin"), deleteQuiz);

/**
 * @openapi
 * /quizzes/{id}/attempts/start:
 *   post:
 *     summary: Start an attempt (user)
 *     tags: [Attempts]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       201: { description: Attempt started }
 *       401: { description: Unauthorized }
 */
r.post("/:id/attempts/start", auth(), requireRole("user"), startAttempt);

/**
 * @openapi
 * /quizzes/{id}/attempts/{attemptId}/submit:
 *   post:
 *     summary: Submit answers (user)
 *     tags: [Attempts]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: attemptId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [answers]
 *             properties:
 *               answers:
 *                 type: array
 *                 items: { type: integer }
 *     responses:
 *       200: { description: Scored }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 *       404: { description: Not found }
 */
r.post("/:id/attempts/:attemptId/submit", auth(), requireRole("user"), submitAttempt);

/**
 * @openapi
 * /quizzes/me/results:
 *   get:
 *     summary: My results (user)
 *     tags: [Results]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: OK }
 *       401: { description: Unauthorized }
 */
r.get("/me/results", auth(), requireRole("user"), myResults);

/**
 * @openapi
 * /quizzes/results:
 *   get:
 *     summary: All results (admin)
 *     tags: [Results]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: OK }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 */
r.get("/results", auth(), requireRole("admin"), allResults);

export default r;
