import { User } from "../models/user";

async function userConnected(app: any, id: string) {
  const user = await User.findById(id);
  const io = app.get('io');
  await User.findByIdAndUpdate(id, { isOnline: true });
  if (!user) {
    return;
  }
  for (let friendId of user.friends) {
    io.to(friendId.toString()).emit('user-connected', { id: user._id });
  }
}

async function userDisconnected(app: any, id: string) {
  const user = await User.findById(id);
  const io = app.get('io');
  await User.findByIdAndUpdate(id, { isOnline: false });
  if (!user) {
    return;
  }
  for (let friendId of user.friends) {
    io.to(friendId.toString()).emit('user-disconnected', { id: user._id });
  }
}

export {
  userConnected,
  userDisconnected
}
