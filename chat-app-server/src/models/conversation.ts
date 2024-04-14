import { Schema, model } from "mongoose";
import { IConversation } from "../interfaces/dbInterfaces";

const conversationSchema = new Schema<IConversation> ({
  members: {
    type: [Schema.Types.ObjectId],
  },
  lastMessage: {
    type: String,
  }
}, {
  timestamps: true
});

const Conversation = model<IConversation> ('Conversation', conversationSchema);

export {
  Conversation
}