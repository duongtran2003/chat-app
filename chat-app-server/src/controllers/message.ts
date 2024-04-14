import { Request, Response } from "express";
import { Conversation } from "../models/conversation";
import { Message } from "../models/message";

class MessageController {
  async index(req: Request, res: Response) {
    const conversationId = req.query.convoId;
    const messageId = req.params.id;
    if (conversationId) {
      const messages = await Message.find({ conversationId: conversationId });
      return res.status(200).json(messages);
    }
    const message = await Message.findById(messageId);
    return res.status(200).json(message);
  }

  async create(req: Request, res: Response) {
    const userId = res.locals.claims.userId;
    const conversationId = req.body.conversationId;
    const content = req.body.content;

    const conversation = await Conversation.findById(conversationId);
    conversation!.lastMessage = content;
    conversation!.save();
    const newMessage = {
      sender: userId,
      conversationId: conversationId,
      content: content,
    }
    const message = await Message.create(newMessage);
    return res.status(201).json(message);
  }
}

export {
  MessageController
}