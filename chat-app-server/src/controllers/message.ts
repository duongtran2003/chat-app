import { Request, Response } from "express";
import { Conversation } from "../models/conversation";
import { Message } from "../models/message";

class MessageController {
  async index(req: Request, res: Response) {
    const conversationId = req.query.convoId;
    const messageId = req.params.id;
    const userId = res.locals.claims.userId;
    const io = req.app.get('io');
    if (conversationId) {
      const messages = await Message.find({ conversationId: conversationId });
      const conversation = await Conversation.findById(conversationId);
      await Message.updateMany({ conversationId: conversationId }, { isSeen: true })
      if (!conversation) {
        return res.status(404).json({
          message: "Conversation not found"
        })
      }
      conversation.hasNew = false;
      conversation.save();
      let otherUserId = "";
      for (let memberId of conversation!.members) {
        if (memberId != userId) {
          otherUserId = memberId.toString();
        }
      }
      for (let message of messages) {
        if (!message.isSeen && message.sender.toString() == otherUserId) {
          io.to(otherUserId).emit("message-seen", { _id: message._id, conversationId: message.conversationId });
        }
      }
      return res.status(200).json(messages);
    }
    const message = await Message.findById(messageId);
    await Message.findByIdAndUpdate(messageId, { isSeen: true });
    const conversation = await Conversation.findById(message?.conversationId);
    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found"
      })
    }
    conversation.hasNew = false;
    conversation.save();
    let otherUserId = "";
    for (let memberId of conversation!.members) {
      if (memberId != userId) {
        otherUserId = memberId.toString();
      }
    }
    io.to(otherUserId).emit("message-seen", { _id: message!._id, conversationId: message!.conversationId });
    return res.status(200).json(message);
  }

  async create(req: Request, res: Response) {
    const userId = res.locals.claims.userId;
    const conversationId = req.body.conversationId;
    const content = req.body.content;

    const io = req.app.get('io');

    let otherUserId = "";
    const conversation = await Conversation.findById(conversationId);
    for (let memberId of conversation!.members) {
      if (memberId != userId) {
        otherUserId = memberId.toString();
      }
    }
    conversation!.lastMessage = content;
    conversation!.lastMessageOwner = userId;
    conversation!.hasNew = true;
    conversation!.save();
    const newMessage = {
      sender: userId,
      conversationId: conversationId,
      content: content,
    }
    const message = await Message.create(newMessage);
    io.to(otherUserId).emit("new-message", { _id: message.id, conversationId: message.conversationId, content: message.content });
    return res.status(201).json(message);
  }
}

export {
  MessageController
}
