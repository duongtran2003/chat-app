import { Router, Request, Response } from "express";
import { jwtGuard } from "../middlewares/guards/jwtGuard";
const authController = require("../controllers/auth");

let router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get("/retrieve", jwtGuard, authController.retrieve);

export {
  router
}