import express from "express";
import cors from "cors";

import { env } from "./config/env";
import { connectToDatabase } from "./db/client";
import { taskRouter } from "./routes/taskRoutes";
import { goalRouter } from "./routes/goalRoutes";

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

app.use("/tasks", taskRouter);
app.use("/goals", goalRouter);

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
