import { Schema, model } from "mongoose";
import { IConversation } from "../interfaces/dbInterfaces";

const conversationSchema = new Schema<IConversation>({
  members: {
    type: [Schema.Types.ObjectId],
  },
  lastMessage: {
    type: String,
  },
  lastMessageOwner: {
    type: Schema.Types.ObjectId,
  },
  hasNew: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true
});

const Conversation = model<IConversation>('Conversation', conversationSchema);

export {
  Conversation
}
