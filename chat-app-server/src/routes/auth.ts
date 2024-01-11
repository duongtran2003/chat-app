import { Router, Request, Response } from "express";
const authController = require("../controllers/auth");

let router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

export {
  router
}