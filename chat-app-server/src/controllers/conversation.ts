import { Request, Response } from "express";
import { User } from "../models/user";
import { Conversation } from "../models/conversation";

class ConversationController {
  async create(req: Request, res: Response) {
    const recipientId = req.body.recipient;
    const userId = res.locals.claims.userId;

    const newConvo = {
      members: [recipientId, userId],
      lastMessage: "",
    }
    const conversation = await Conversation.create(newConvo);
    const user = await User.findById(userId);
    const recipient = await User.findById(recipientId);
    user?.conversations.push(conversation._id);
    recipient?.conversations.push(conversation._id);
    user?.save();
    recipient?.save();
    return res.status(200).json(conversation);
  }
}

export {
  ConversationController
}