import { Router } from "express";
import { router as authRouter } from "./auth";
import { router as messageRouter } from "./message";

let router = Router();

router.use("/auth", authRouter);
router.use("/message", messageRouter);

export {
  router
}