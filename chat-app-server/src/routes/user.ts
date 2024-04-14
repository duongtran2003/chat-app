import { Router, json } from 'express';
import { UserController } from '../controllers/user';
import { jwtGuard } from '../middlewares/guards/jwtGuard';


const router = Router();
const userController = new UserController();


router.get('/:id', jwtGuard, userController.index);

export {
  router
}