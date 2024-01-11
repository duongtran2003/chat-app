import { Response, Request } from "express";
import { User } from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthController {
  async register(req: Request, res: Response) {
    const { username, password, email } = req.body;
    
    //in case someone's trying to be real funny here
    if (!(typeof username) || !(typeof password) || !(typeof email)) {
      res.statusCode = 400;
      return res.json({
        "message": "nice try dude",
      });
    }
    if (!(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))) {
      res.statusCode = 400;
      return res.json({
        "message": "nice try dude",
      });
    }
    if (!/^[a-zA-Z0-9_]{6,20}$/.test(username)) {
      res.statusCode = 400;
      return res.json({
        "message": "nice try dude",
      });
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/.test(password)) {
      res.statusCode = 400;
      return res.json({
        "messaeg": "nice try dude",
      });
    }

    //check for existance
    const user = await User.findOne({ $or: [{ email: email }, { username: username }] });
    if (user) {
      if (user.username === username) {
        res.statusCode = 409;
        return res.json({
          "message": "duplicated username",
        });
      }
      if (user.email === email) {
        res.statusCode = 409;
        return res.json({
          "message": "duplicated email",
        });
      }
    }

    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password, salt);

    User.create({
      email: email,
      username: username,
      password: hashedPassword,
      profilePic: process.env.DEFAULT_PROFILE_PIC || "null",
    })
    .then((user) => {
      res.statusCode = 201;
      return res.json(user);
    })
    .catch((err) => {
      res.statusCode = 500;
      return res.json({
        "message": "error encountered, this shouldn't be happening...",
      })
    });
  }

  login(req: Request, res: Response) {
    return res.json({
      "message": "todo",
    })
  }
}

module.exports = new AuthController();