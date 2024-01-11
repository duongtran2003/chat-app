import { Schema, model } from "mongoose";
import { IMessage } from "../interfaces/dbInterfaces";

const messageSchema = new Schema<IMessage> ({
  senderId: String,
  conversationId: String,
  content: String
}, {
  timestamps: true
});

const Message = model<IMessage> ('Message', messageSchema);

export {
  Message
}