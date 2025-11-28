import { Router } from "express";
import multer from "multer";

import {
  getProfileDetails,
  updateProfileDetails,
  uploadProfileAvatar,
} from "../controllers/profileController";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const profileRouter = Router();

profileRouter.get("/", getProfileDetails);
profileRouter.patch("/", updateProfileDetails);
profileRouter.post("/avatar", upload.single("avatar"), uploadProfileAvatar);

export { profileRouter };


