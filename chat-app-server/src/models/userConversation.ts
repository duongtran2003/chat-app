import { Schema, model } from "mongoose";
import { IUserConversation } from "../interfaces/dbInterfaces";

const UserConversationSchema = new Schema<IUserConversation> ({
  userId: String,
  conversationId: String,
});

const UserConversation = model<IUserConversation> ('UserConversation', UserConversationSchema);

export {
  UserConversation
}