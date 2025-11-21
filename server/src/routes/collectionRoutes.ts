import { Router } from "express";

import {
  listCollections,
  createCollection,
  updateCollection,
  deleteCollection,
} from "../controllers/collectionController";

export const collectionRouter = Router();

collectionRouter.get("/", listCollections);
collectionRouter.post("/", createCollection);
collectionRouter.patch("/:id", updateCollection);
collectionRouter.delete("/:id", deleteCollection);


