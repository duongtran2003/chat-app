import { Schema, model } from "mongoose";
import { IUser } from "../interfaces/dbInterfaces";

const userSchema = new Schema<IUser> ({
  email: {
    type: String,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  profilePic: {
    type: String,
  }
}, {
  timestamps: true
});

const User = model<IUser> ('User', userSchema);

export {
  User
}