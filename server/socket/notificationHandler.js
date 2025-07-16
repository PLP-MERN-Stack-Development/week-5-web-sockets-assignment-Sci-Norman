const handleNotificationEvents = (io, socket) => {
  // Handle notification preferences
  socket.on('updateNotificationPreferences', (preferences) => {
    socket.notificationPreferences = preferences;
  });

  // Send notification to specific user
  socket.on('sendNotification', (data) => {
    const { recipientId, type, message, data: notificationData } = data;
    
    const recipientSocket = Array.from(io.sockets.sockets.values())
      .find(s => s.user && s.user._id.toString() === recipientId);
    
    if (recipientSocket) {
      recipientSocket.emit('notification', {
        id: Date.now(),
        type,
        message,
        data: notificationData,
        timestamp: new Date()
      });
    }
  });

  // Mark notification as read
  socket.on('markNotificationRead', (notificationId) => {
    socket.emit('notificationRead', notificationId);
  });

  // Handle browser notifications permission
  socket.on('requestNotificationPermission', () => {
    socket.emit('notificationPermission', {
      supported: 'Notification' in window,
      permission: Notification.permission
    });
  });

  // Send sound notification
  socket.on('playSound', (soundType) => {
    socket.emit('playSound', soundType);
  });
};

module.exports = { handleNotificationEvents };
