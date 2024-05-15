import mongoose from "mongoose"


interface IUser {
  email: string,
  username: string,
  password: string,
  pfp: string,
  friends: mongoose.Types.ObjectId[],
  conversations: mongoose.Types.ObjectId[],
  createdAt?: Date,
  updatedAt?: Date,
}

interface IMessage {
  sender: mongoose.Types.ObjectId,
  conversationId: mongoose.Types.ObjectId,
  content: string,
  isSeen: boolean,
  createdAt?: Date,
  updatedAt?: Date,
}

interface IConversation {
  members: mongoose.Types.ObjectId[],
  lastMessage: String,
  createdAt?: Date,
  updatedAt?: Date,
}

interface IFriendRequest {
  sender: mongoose.Types.ObjectId,
  recipient: mongoose.Types.ObjectId
}


export {
  IUser, IMessage, IConversation, IFriendRequest
}
