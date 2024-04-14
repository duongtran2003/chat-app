import { Request, Response } from "express";
import { User } from "../models/user";

class UserController {
  async index(req: Request, res: Response) {
    const userId = req.params.id;
    const user = await User.findById(userId);
    user?.$set({
      password: undefined
    });
    return res.status(200).json(user);
  }
}

export {
  UserController
}