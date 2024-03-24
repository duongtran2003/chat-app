import { ObjectId } from "mongoose"


interface IUser {
  email: string,
  username: string,
  password: string,
  pfp: string,
  friends: ObjectId[] | IUser [],
  conversations: ObjectId[] | IConversation[],
  createdAt?: Date,
  updatedAt?: Date,
}

interface IMessage {
  sender: ObjectId | IUser,
  conversationId: ObjectId,
  content: string,
  createdAt?: Date,
  updatedAt?: Date,
}

interface IConversation {
  members: ObjectId[] | IUser[],
  lastMessage: String,
  createdAt?: Date,
  updatedAt?: Date,
}

interface IFriendRequest {
  sender: IUser,
  recipient: IUser
}


export {
  IUser, IMessage, IConversation, IFriendRequest
}