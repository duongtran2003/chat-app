import { Schema, model } from "mongoose";
import { IMessage } from "../interfaces/dbInterfaces";

const messageSchema = new Schema<IMessage>({
  sender: {
    type: Schema.Types.ObjectId,
  },
  conversationId: {
    type: Schema.Types.ObjectId,
  },
  isSeen: {
    type: Boolean,
    default: false
  },
  content: String,
}, {
  timestamps: true
});

const Message = model<IMessage>('Message', messageSchema);

export {
  Message
}
