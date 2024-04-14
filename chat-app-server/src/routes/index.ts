import { Router } from "express";
import { router as authRouter } from "./auth";
import { router as friendRequestRouter } from "./friendRequest";
import { router as messageRouter } from "./message";
import { router as conversationRouter } from './conversation';
import { router as userRouter } from "./user";

let router = Router();

router.use("/auth", authRouter);
router.use('/friendRequests', friendRequestRouter);
router.use('/messages', messageRouter);
router.use('/conversations', conversationRouter);
router.use('/users', userRouter);

export {
  router
}