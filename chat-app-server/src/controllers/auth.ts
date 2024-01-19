import { Response, Request } from "express";
import { User } from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUser } from "../interfaces/dbInterfaces";

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
        "message": "nice try dude",
      });
    }

    //check for existance
    const user = await User.findOne({ $or: [{ email: email }, { username: username }] });
    if (user) {
      if (user.email === email) {
        res.statusCode = 409; 
        return res.json({
          "message": "duplicated email",
        });
      }
      if (user.username === username) {
        res.statusCode = 409;
        return res.json({
          "message": "duplicated username",
        });
      }
    }

    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password, salt);

    let newUser: IUser = {
      email: email,
      username: username,
      password: hashedPassword,
      profilePic: process.env.DEFAULT_PROFILE_PIC || "null",
    }

    User.create(newUser)
      .then((user) => {
        res.statusCode = 201;
        return res.json(user);
      })
      .catch((err) => {
        res.statusCode = 500;
        return res.json({
          "message": "error encountered, this shouldn't be happening..." + err,
        })
      });
  }

  async login(req: Request, res: Response) {
    const { username, password, email } = req.body; 

    //in case someone's trying to be real funny here
    if (!(typeof username) || !(typeof password) || !(typeof email)) {
      res.statusCode = 400;
      res.cookie("jwt", "", {
        httpOnly: true,
        maxAge: 0,
      });
      return res.json({
        "message": "nice try dude",
      });
    }
    if (!/^[a-zA-Z0-9_]{6,20}$/.test(username)) {
      res.statusCode = 400;
      res.cookie("jwt", "", {
        httpOnly: true,
        maxAge: 0,
      });
      return res.json({
        "message": "nice try dude",
      });
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/.test(password)) {
      res.statusCode = 400;
      res.cookie("jwt", "", {
        httpOnly: true,
        maxAge: 0,
      });
      return res.json({
        "messaeg": "nice try dude",
      });
    }

    const user = await User.findOne({ username: username });

    if (!user) {
      res.statusCode = 401;
      res.cookie("jwt", "", {
        httpOnly: true,
        maxAge: 0,
      });
      return res.json({
        "message": "wrong credentials",
      });
    }

    if (!await bcrypt.compare(password, user.password)) {
      res.statusCode = 401;
      res.cookie("jwt", "", {
        httpOnly: true,
        maxAge: 0,
      });
      return res.json({
        "message": "wrong credentials",
      });
    }

    if (!process.env.SECRET) {
      res.statusCode = 500;
      return res.json({
        "message": "secret key not found",
      });
    }
    
    req.app.get('io').on("connection", (socket: any) => {
      console.log(`room id: ${user.username}\nsocket id: ${socket.id}\n------------------\n`);
      socket.join(user.username);
      req.app.get('io').to(user.username).emit('onConnect', `room id: ${user.username}\nsocket id: ${socket.id}\n------------------\n`);
    });

    const token = jwt.sign({ username: username, userId: user._id }, process.env.SECRET);
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
    res.statusCode = 200;
    return res.json(user);
  }

  logout(req: Request, res: Response) {
    res.statusCode = 200;
    res.cookie("jwt", "", {
      httpOnly: true,
      maxAge: 0,
    });
    return res.json({
      "message": "log out successfully"
    });
  }

  // get user from token
  retrieve(req: Request, res: Response) {
    const userId = res.locals.claims.userId;
    User.findById(userId)
      .then((user) => {
        if (user) {
          res.statusCode = 200;
          return res.json(user);
        }
        else {
          res.statusCode = 401;
          return res.json({
            "message": "invalid token",
          });
        }
      })
      .catch((err) => {
        res.statusCode = 500;
        return res.json({
          "message": "error encountered " + err,
        });
      });
  }
}

module.exports = new AuthController();