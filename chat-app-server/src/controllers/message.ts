import { Request, Response } from "express";
import { UserConversation } from "../models/userConversation";
import { Message as Msg } from "../models/message";
import { Conversation } from "../models/conversation";
import { IConversation, IUserConversation } from "../interfaces/dbInterfaces";

class Message {
  async index(req: Request, res: Response) {
    const userId = res.locals.claims.userId;
    const isInConversation = await UserConversation.findOne({ userId: userId, conversationId: req.query.conversationId });

    if (!isInConversation) {
      res.statusCode = 404;
      return res.json({
        "message": "conversation not found",
      });
    }

    const messages = await Msg.find({ conversationId: isInConversation.conversationId });
    res.statusCode = 200;
    return res.json(messages);
  }

  async create(req: Request, res: Response) {
    const userId = res.locals.claims.userId;

    const { content, conversationId } = req.body;

    const isInConversation = await UserConversation.findOne({ userId: userId, conversationId: conversationId });

    if (!isInConversation) {
      res.statusCode = 404;
      return res.json({
        "message": "conversation not found",
      });
    }

    
  }
}

module.exports = new Message();