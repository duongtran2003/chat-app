import { ObjectId } from "mongoose"


interface IUser {
  email: string,
  username: string,
  password: string,
  pfp: string,
  friends: ObjectId[],
  conversations: ObjectId[],
  createdAt?: Date,
  updatedAt?: Date,
}

interface IMessage {
  sender: ObjectId,
  conversationId: ObjectId,
  content: string,
  createdAt?: Date,
  updatedAt?: Date,
}

interface IConversation {
  members: ObjectId[],
  lastMessage: String,
  createdAt?: Date,
  updatedAt?: Date,
}

interface IFriendRequest {
  sender: ObjectId,
  recipient: ObjectId
}


export {
  IUser, IMessage, IConversation, IFriendRequest
}