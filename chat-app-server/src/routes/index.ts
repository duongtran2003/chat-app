import { Router } from "express";
import { router as authRouter } from "./auth";

let router = Router();

router.use("/auth", authRouter);

export {
  router
}