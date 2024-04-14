import { Router } from 'express';
import { MessageController } from '../controllers/message';
import { jwtGuard } from '../middlewares/guards/jwtGuard';


const messageController = new MessageController();
const router = Router();

router.post('/', jwtGuard, messageController.create);
router.get('/:id?', jwtGuard, messageController.index);

export {
  router
}