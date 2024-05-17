import { Schema, model } from "mongoose";
import { IUser } from "../interfaces/dbInterfaces";

const userSchema = new Schema<IUser>({
  email: {
    type: String,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  pfp: {
    type: String,
    default: `https://i.imgur.com/tdi3NGa.png`,
  },
  friends: {
    type: [Schema.Types.ObjectId],
  },
  conversations: {
    type: [Schema.Types.ObjectId],
  },
  isOnline: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true
});

const User = model<IUser>('User', userSchema);

export {
  User
}
