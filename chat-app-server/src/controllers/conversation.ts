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
    await user?.save();
    await recipient?.save();
    return res.status(200).json(conversation);
  }

  async index(req: Request, res: Response) {
    const userId = res.locals.claims.userId;
    const otherUserId = req.query.id;
    const conversationId = req.params.id;
    const user = await User.findById(userId);
    const conversations: any = [];
    if (user) {
      if (otherUserId) {
        const conversations = await Conversation.find({
          members: {
            "$all": [
              userId,
              otherUserId
            ]
          }
        });
        if (conversations.length) {
          return res.status(200).json(conversations[0]);
        }
        else {
          return res.status(404).json({
            message: "not found",
          });
        }
      }
      if (conversationId) {
        const conversation = await Conversation.findById(conversationId);
        return res.status(200).json(conversation);
      }
      for (let conversationId of user.conversations) {
        const conversation = await Conversation.findById(conversationId);
        conversations.push(conversation);
      }
      return res.status(200).json(conversations);
    }
    return res.status(200).json(conversations);
  }
}

export {
  ConversationController
}
