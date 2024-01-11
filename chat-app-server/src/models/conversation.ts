import { Schema, model } from "mongoose";
import { IConversation } from "../interfaces/dbInterfaces";

const conversationSchema = new Schema<IConversation> ({
  lastMessage: String,
  name: String,
}, {
  timestamps: true
});

const Conversation = model<IConversation> ('Conversation', conversationSchema);

export {
  Conversation
}