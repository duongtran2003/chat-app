import { Router } from "express";
import { router as authRouter } from "./auth";
import { router as friendRequestRouter } from "./friendRequest";

let router = Router();

router.use("/auth", authRouter);
router.use('/friendRequests', friendRequestRouter);

export {
  router
}