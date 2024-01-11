import { Request, Response } from "express";
import { UserConversation } from "../models/userConversation";
import { Message as Msg } from "../models/message";
import { Conversation } from "../models/conversation";
import { IConversation, IMessage, IUserConversation } from "../interfaces/dbInterfaces";

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
    const username = res.locals.claims.username;

    const { content, conversationId } = req.body;

    const isInConversation = await UserConversation.findOne({ userId: userId, conversationId: conversationId });

    if (!isInConversation) {
      res.statusCode = 404;
      return res.json({
        "message": "conversation not found",
      });
    }

    //otherwise the conversation is found
    const newMessage: IMessage = {
      senderId: userId,
      conversationId: conversationId,
      content: content,
    }

    Conversation.findOneAndUpdate({ _id: conversationId }, { lastMessage: `${username}: ${content}` })
      .then(() => {
        Msg.create(newMessage)
          .then((message) => {
            res.statusCode = 200;
            return res.json(message);
          })
          .catch((err) => {
            res.statusCode = 500;
            return res.json({
              "message": "error encountered " + err,
            });
          })
      })
      .catch((err) => {
        res.statusCode = 500;
        return res.json({
          "message": "error encountered " + err,
        });
      });
  }

  async initiate(req: Request, res: Response) {
    const userId = res.locals.claims.userId;
    const username = res.locals.claims.username;

    const { recipientId, content } = req.body;
    const recipientConversations = await UserConversation.find({ userId: recipientId });
    const senderConversations = await UserConversation.find({ userId: userId });
    const mutualConversations = recipientConversations.filter((recipientConversation) => {
      return senderConversations.some((senderConversation) => {
        return recipientConversation.conversationId === senderConversation.conversationId;
      });
    });
    for (let mutualConversation of mutualConversations) {
      const conversationId = mutualConversation.conversationId;
      const conversation = await Conversation.findById(conversationId);
      if (conversation) {
        if (conversation.name === "") {
          //already existed
          res.statusCode = 400;
          return res.json({
            "message": "conversation's already existed",
          });
        }
      }
    }

    //create new
    const newConversation: IConversation = {
      name: "",
      lastMessage: `${username}: ${content}`,
    }
    Conversation.create(newConversation)
      .then((conversation) => {
        const newUserConversation1: IUserConversation = {
          userId: userId,
          conversationId: conversation._id.toString(),
        }
        const newUserConversation2: IUserConversation = {
          userId: recipientId,
          conversationId: conversation._id.toString(),
        }
        UserConversation.create(newUserConversation1);
        UserConversation.create(newUserConversation2);
        const newMessage: IMessage = {
          senderId: userId,
          conversationId: conversation._id.toString(),
          content: content,
        }
        Msg.create(newMessage)
          .then((message) => {
            res.statusCode = 200;
            return res.json(message);
          })
          .catch((err) => {
            res.statusCode = 500;
            return res.json({
              "message": "error encountered " + err,
            });
          })
      })
      .catch((err) => {
        res.statusCode = 500;
        return res.json({
          "message": "error encountered " + err,
        });
      })
  }
}

module.exports = new Message();