import express from "express";
import cors from "cors";

import { env } from "./config/env";
import { connectToDatabase } from "./db/client";
import { taskRouter } from "./routes/taskRoutes";
import { goalRouter } from "./routes/goalRoutes";
import { collectionRouter } from "./routes/collectionRoutes";
import { authRouter } from "./routes/authRoutes";
import { profileRouter } from "./routes/profileRoutes";
import { requireAuth } from "./middleware/requireAuth";

const app = express();

app.use(
  cors({
    origin: env.corsOrigin ?? "*",
  })
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

app.use("/auth", authRouter);
app.use("/tasks", requireAuth, taskRouter);
app.use("/goals", requireAuth, goalRouter);
app.use("/collections", requireAuth, collectionRouter);
app.use("/profile", requireAuth, profileRouter);

const startServer = async () => {
  await connectToDatabase();
  app.listen(env.port, () => {
    console.log(`Server listening on http://localhost:${env.port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});

export default app;