import { Schema, model } from "mongoose";
import { IFriendRequest } from "../interfaces/dbInterfaces";

const friendRequestSchema = new Schema<IFriendRequest> ({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }  
}, {
  timestamps: true
});

const FriendRequest = model<IFriendRequest> ('FriendRequest', friendRequestSchema);

export {
  FriendRequest
}