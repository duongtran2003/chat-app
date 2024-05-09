import { Router } from "express";
import { FriendRequestController } from "../controllers/friendRequest";
import { jwtGuard } from "../middlewares/guards/jwtGuard";

const friendRequestController = new FriendRequestController();
const router = Router();

router.post('/create', jwtGuard, friendRequestController.create);
router.post('/handleRequest', jwtGuard, friendRequestController.handleRequest);
router.get('/', jwtGuard, friendRequestController.index);
router.delete('/', jwtGuard, friendRequestController.delete);

export {
  router
}
