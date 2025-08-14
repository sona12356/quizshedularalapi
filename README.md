# Quiz Engine API (Node.js + TypeScript + Zod)

A minimal quiz platform API with users & admins, quiz CRUD, attempts with scoring, JWT auth, Swagger docs, and MongoDB persistence — built with **Express + TypeScript + Zod**.

## Features
- **Auth**: Register/Login, JWT bearer tokens
- **Roles**: `admin` (manage quizzes), `user` (take quizzes)
- **Quizzes**: Create/Update/Delete (admin), List (public)
- **Attempts**: Start attempt, submit answers, time-limit enforcement
- **Results**: My results (user), all results (admin)
- **Docs**: OpenAPI/Swagger UI at `/api/docs`

## Prerequisites
- Node.js 18+
- MongoDB locally or via Docker:
  ```bash
  docker run -d --name mongo -p 27017:27017 mongo:7
  ```

## Setup
1. Create `.env` in project root:
   ```
   MONGODB_URI=mongodb://localhost:27017/quiz_engine_api
   JWT_SECRET=supersecret_change_me
   PORT=4000
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run in dev mode:
   ```bash
   npm run dev
   ```
   Visit **http://localhost:4000/api/docs**

## Quick API flow
1) **Register admin** → get ADMIN token  
2) **Register user** → get USER token  
3) **Create quiz** (admin)  
4) **Start attempt** (user)  
5) **Submit answers** (user)

### Sample payloads
**Create quiz**
```json
{
  "title": "JavaScript Basics",
  "description": "Intro-level JS",
  "timeLimitSeconds": 180,
  "questions": [
    {
      "questionText": "Which keyword declares a constant?",
      "options": ["let", "const", "var"],
      "correctOptionIndex": 1
    },
    {
      "questionText": "What is the result of typeof null?",
      "options": ["null", "object", "undefined", "number"],
      "correctOptionIndex": 1
    },
    {
      "questionText": "Which array method returns elements that pass a test?",
      "options": ["map", "filter", "forEach", "reduce"],
      "correctOptionIndex": 1
    }
  ]
}
```
**Submit answers**
```json
{ "answers": [1, 1, 1] }
```

## Troubleshooting
- **401 on admin routes**: Missing/invalid `Authorization: Bearer <ADMIN_TOKEN>`
- **No operations in spec**: Ensure Swagger `apis` glob points to your route files and routes have `@openapi` blocks
- **Type missing errors**: Install `@types/*` packages (swagger-jsdoc, swagger-ui-express, cors)

## Scripts
```json
{
  "dev": "tsx watch src/server.ts",
  "build": "tsc -p tsconfig.json",
  "start": "node dist/server.js",
  "lint": "eslint .",
  "test": "jest --runInBand"
}
```

## License

