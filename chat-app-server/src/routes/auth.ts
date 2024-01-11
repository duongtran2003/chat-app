import { Router, Request, Response } from "express";
const authController = require("../controllers/auth");

let router = Router();

router.get("/register", authController.register);
router.get("/login", authController.login);

export {
  router
}