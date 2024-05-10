import { Request, Response } from "express";
import { FriendRequest } from "../models/friendRequest";
import { User } from "../models/user";
import { Types } from "mongoose";

class FriendRequestController {
  async create(req: Request, res: Response) {
    const io = req.app.get('io');
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
        io.to(recipient).emit('new-request', { requestId: newRequest._id });
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
      return res.status(200).json(requests);
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
    const { otherUserId, action } = req.body;
    const userId = res.locals.claims.userId;
    const friendRequest = await FriendRequest.findOne({ sender: otherUserId, recipient: userId });
    if (!friendRequest) {
      return res.status(404).json({
        message: "Request not found",
      });
    }
    const senderId = friendRequest!.sender;

    if (action == "accept") {
      const io = req.app.get('io');
      const userId = res.locals.claims.userId;
      const user = await User.findById(userId);
      const sender = await User.findById(senderId);
      user?.friends.push(senderId);
      sender?.friends.push(userId);
      user?.save();
      sender?.save();
      await FriendRequest.findOneAndDelete({ sender: otherUserId, recipient: userId });
      io.to(otherUserId).emit('accept-request', { userId: userId, username: user?.username });
      console.log(otherUserId);
      return res.status(200).json({ "message": "success" });
    }
    else {
      await FriendRequest.findOneAndDelete({ sender: otherUserId, recipient: userId });
      return res.status(200).json({ "message": "success" });
    }
  }

  async delete(req: Request, res: Response) {
    const userId = res.locals.claims.userId;
    const otherUserId = req.query.id;
    const friendRequest = await FriendRequest.findOne({ sender: userId, recipient: otherUserId });
    if (!friendRequest) {
      return res.status(404).json({
        message: "Request not found",
      });
    }
    FriendRequest.findOneAndDelete({ sender: userId, recipient: otherUserId })
      .then(() => {
        return res.status(200).json({
          message: "Success",
        })
      })
      .catch(() => {
        return res.status(500).json({
          message: "Error"
        })
      });
  }
}

export {
  FriendRequestController
}
