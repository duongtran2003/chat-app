import { Router, Request, Response } from "express";
import { jwtGuard } from "../middlewares/guards/jwtGuard";
const messageController = require("../controllers/message");

let router = Router();

router.get("/index", jwtGuard, messageController.index);
router.post("/create", jwtGuard, messageController.create);
router.post("/initiate", jwtGuard, messageController.initiate);

export {
  router
}