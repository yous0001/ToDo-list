import { Router } from "express";

import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from "../controllers/goalController";

export const goalRouter = Router();

goalRouter.get("/", getGoals);
goalRouter.post("/", createGoal);
goalRouter.patch("/:id", updateGoal);
goalRouter.delete("/:id", deleteGoal);

