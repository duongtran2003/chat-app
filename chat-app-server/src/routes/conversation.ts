import { Router } from "express";
import { ConversationController } from "../controllers/conversation";
import { jwtGuard } from "../middlewares/guards/jwtGuard";


const conversationController = new ConversationController();
const router = Router();

router.post('/', jwtGuard, conversationController.create);

export {
  router
}