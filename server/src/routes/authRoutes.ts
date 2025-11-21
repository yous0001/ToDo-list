import { Router } from "express";

import {
  register,
  verifyEmail,
  login,
  getProfile,
} from "../controllers/authController";
import { requireAuth } from "../middleware/requireAuth";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/verify", verifyEmail);
authRouter.post("/login", login);
authRouter.get("/me", requireAuth, getProfile);

export { authRouter };
