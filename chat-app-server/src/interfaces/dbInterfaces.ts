interface IUser {
  email: string,
  username: string,
  password: string,
  profilePic: string,
  createdAt?: Date,
  updatedAt?: Date,
}

interface IMessage {
  senderId: string,
  conversationId: string,
  content: string,
  createdAt?: Date,
  updatedAt?: Date,
}

interface IConversation {
  name: String, // "" if it's a one to one conversation, otherwise group chat
  lastMessage: String,
  createdAt?: Date,
  updatedAt?: Date,
}

interface IUserConversation {
  userId: string,
  conversationId: string,
}

export {
  IUser, IMessage, IConversation, IUserConversation
}