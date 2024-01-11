import { Router, Request, Response } from "express";
const authController = require("../controllers/auth");

let router = Router();

router.post("/register", authController.register);
router.get("/login", authController.login);

export {
  router
}