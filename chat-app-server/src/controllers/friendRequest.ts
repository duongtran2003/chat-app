import { Request, Response } from "express";
import { FriendRequest } from "../models/friendRequest";
import { User } from "../models/user";
import { Types } from "mongoose";

class FriendRequestController {
  async create(req: Request, res: Response) {
    const userId = res.locals.claims.userId;

    const user = await User.findById(userId);
    const recipient = req.body.recipient;

    const request1 = await FriendRequest.findOne({ sender: userId, recipient: recipient });
    const request2 = await FriendRequest.findOne({ sender: recipient, recipient: userId });

    if (request1 || request2) {
      return res.status(201).json(request1 ? request1 : request2);
    }

    FriendRequest.create({
      sender: userId,
      recipient: recipient
    })
      .then((newRequest) => {
        return res.status(201).json(newRequest);
      })
      .catch((err) => {
        return res.status(500).json({
          "message": err.message
        });
      });
  }

  async index(req: Request, res: Response) {
    const userId = res.locals.claims.userId;
    const otherUserId = req.query.id;
    if (!otherUserId) {
      const requests = await FriendRequest.find({ recipient: userId });
    }
    else {
      const request1 = await FriendRequest.findOne({ sender: userId, recipient: otherUserId });
      const request2 = await FriendRequest.findOne({ sender: otherUserId, recipient: userId });
      if (request1 || request2) {
        return res.status(200).json(request1 ? request1 : request2);
      }
      else {
        return res.status(404).json({
          message: "not found",
        });
      }
    }
  }

  async handleRequest(req: Request, res: Response) {
    const { requestId, action } = req.body;
    const friendRequest = await FriendRequest.findById(requestId);
    const targetId = friendRequest!.recipient;

    if (action == "accept") {
      const userId = res.locals.claims.userId;
      const user = await User.findById(userId);
      const targetUser = await User.findById(targetId);
      user?.friends.push(targetId);
      targetUser?.friends.push(userId);
      user?.save();
      targetUser?.save();
      await FriendRequest.findByIdAndDelete(requestId);
      return res.status(200).json({ "message": "success" });
    }
    else {
      await FriendRequest.findByIdAndDelete(requestId);
      return res.status(200).json({ "message": "success" });
    }
  }
}

export {
  FriendRequestController
}
