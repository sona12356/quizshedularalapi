import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { app } from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/quiz_engine_api";

async function main() {
  await connectDB(MONGODB_URI);
  app.listen(PORT, () => console.log(`[HTTP] listening on http://localhost:${PORT}`));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
