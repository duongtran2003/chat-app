import { Schema, model } from "mongoose";
import { IFriendRequest } from "../interfaces/dbInterfaces";

const friendRequestSchema = new Schema<IFriendRequest> ({
  sender: {
    type: Schema.Types.ObjectId,
  },
  recipient: {
    type: Schema.Types.ObjectId,
  }  
}, {
  timestamps: true
});

const FriendRequest = model<IFriendRequest> ('FriendRequest', friendRequestSchema);

export {
  FriendRequest
}