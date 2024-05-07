import { Request, Response } from "express";
import { User } from "../models/user";
import bcrypt from 'bcrypt';

class UserController {
  async index(req: Request, res: Response) {
    const userId = req.params.id;
    const usernameAlike = req.query.name;
    if (userId) {
      const user = await User.findById(userId, { password: 0 });
      return res.status(200).json(user);
    }
    else {
      const users = await User.find({ username: { $regex: ".*" + usernameAlike + ".*" } }, { password: 0 });
      return res.status(200).json(users);
    }
  }

  async update(req: Request, res: Response) {
    const userId = res.locals.claims.userId;
    const { username, email, pfp, password, oldPassword } = req.body;
    const userToUpdate = await User.findById(userId);
    if (password) {
      const result = await bcrypt.compare(oldPassword, userToUpdate!.password);
      if (!result) {
        return res.status(400).json({
          "message": "Incorrect password",
        });
      }
    }
    if (username) {
      const user = await User.findOne({ username: username });
      if (user && user._id != userId) {
        return res.status(400).json({
          "message": "Duplicated username",
        });
      }
    }
    const updatedUser: {
      username: string | undefined,
      email: string | undefined,
      pfp: string | undefined,
      password: string | undefined,
    } = {
      username: username,
      email: email,
      pfp: pfp,
      password: undefined
    }
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updatedUser.password = hashedPassword;
    }
    User.findByIdAndUpdate(userId, updatedUser, { new: true })
      .then((updated) => {
        return res.status(200).json(updated);
      })
      .catch((err) => {
        return res.status(500).json({
          "message": "server error",
        });
      })
  }
}

export {
  UserController
}
