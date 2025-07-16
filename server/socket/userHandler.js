const User = require('../models/User');

// Track online users
const onlineUsers = new Map();

const handleUserEvents = (io, socket) => {
  // Add user to online users
  onlineUsers.set(socket.user._id.toString(), {
    userId: socket.user._id,
    username: socket.user.username,
    avatar: socket.user.avatar,
    socketId: socket.id,
    lastSeen: new Date()
  });

  // Send online users list
  const emitOnlineUsers = () => {
    const users = Array.from(onlineUsers.values()).map(user => ({
      id: user.userId,
      username: user.username,
      avatar: user.avatar,
      lastSeen: user.lastSeen
    }));
    io.emit('onlineUsers', users);
  };

  emitOnlineUsers();

  // Handle user status updates
  socket.on('updateStatus', (status) => {
    const user = onlineUsers.get(socket.user._id.toString());
    if (user) {
      user.status = status;
      user.lastSeen = new Date();
      emitOnlineUsers();
    }
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    onlineUsers.delete(socket.user._id.toString());
    emitOnlineUsers();
    
    // Notify other users
    socket.broadcast.emit('userOffline', {
      userId: socket.user._id,
      username: socket.user.username
    });
  });

  // Handle get user profile
  socket.on('getUserProfile', async (userId) => {
    try {
      const user = await User.findById(userId).select('-password');
      socket.emit('userProfile', user);
    } catch (error) {
      socket.emit('error', { message: 'Failed to get user profile' });
    }
  });
};

module.exports = { handleUserEvents, onlineUsers };
