const Message = require('../models/Message');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate socket connections
const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return next(new Error('User not found'));
    }

    socket.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
};

// Handle chat events
const handleChatEvents = (io, socket) => {
  // Join global room
  socket.join('global');
  
  // Broadcast user joined
  socket.to('global').emit('userJoined', {
    user: {
      id: socket.user._id,
      username: socket.user.username,
      avatar: socket.user.avatar
    }
  });

  // Handle sending messages
  socket.on('sendMessage', async (data) => {
    try {
      const message = new Message({
        content: data.content,
        sender: socket.user._id,
        room: data.room || 'global',
        recipient: data.recipient || null
      });

      await message.save();
      
      const populatedMessage = await Message.findById(message._id)
        .populate('sender', 'username avatar')
        .populate('recipient', 'username avatar');

      // Emit to appropriate room or user
      if (data.recipient) {
        // Private message
        const recipientSocket = Array.from(io.sockets.sockets.values())
          .find(s => s.user && s.user._id.toString() === data.recipient);
        
        if (recipientSocket) {
          recipientSocket.emit('newMessage', populatedMessage);
        }
        socket.emit('newMessage', populatedMessage);
      } else {
        // Room message
        io.to(data.room || 'global').emit('newMessage', populatedMessage);
      }
    } catch (error) {
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle typing indicators
  socket.on('typing', (data) => {
    if (data.recipient) {
      const recipientSocket = Array.from(io.sockets.sockets.values())
        .find(s => s.user && s.user._id.toString() === data.recipient);
      
      if (recipientSocket) {
        recipientSocket.emit('userTyping', {
          userId: socket.user._id,
          username: socket.user.username
        });
      }
    } else {
      socket.to(data.room || 'global').emit('userTyping', {
        userId: socket.user._id,
        username: socket.user.username
      });
    }
  });

  socket.on('stopTyping', (data) => {
    if (data.recipient) {
      const recipientSocket = Array.from(io.sockets.sockets.values())
        .find(s => s.user && s.user._id.toString() === data.recipient);
      
      if (recipientSocket) {
        recipientSocket.emit('userStoppedTyping', {
          userId: socket.user._id
        });
      }
    } else {
      socket.to(data.room || 'global').emit('userStoppedTyping', {
        userId: socket.user._id
      });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    socket.to('global').emit('userLeft', {
      userId: socket.user._id,
      username: socket.user.username
    });
  });
};

module.exports = { authenticateSocket, handleChatEvents };
