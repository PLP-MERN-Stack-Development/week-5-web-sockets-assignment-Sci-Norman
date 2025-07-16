import React, { createContext, useContext, useEffect, useState } from 'react';
import socketService from '../socket/socket';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (token && user) {
      const socket = socketService.connect();
      
      if (socket) {
        setIsConnected(true);

        // Set up event listeners
        socketService.onOnlineUsers((users) => {
          setOnlineUsers(users);
        });

        socketService.onUserJoined((data) => {
          console.log(`${data.user.username} joined`);
        });

        socketService.onUserLeft((data) => {
          console.log(`${data.username} left`);
        });

        socketService.onUserTyping((data) => {
          setTypingUsers(prev => [...prev.filter(u => u.userId !== data.userId), data]);
        });

        socketService.onUserStoppedTyping((data) => {
          setTypingUsers(prev => prev.filter(u => u.userId !== data.userId));
        });

        socketService.onNotification((notification) => {
          setNotifications(prev => [notification, ...prev]);
        });
      }
    }

    return () => {
      socketService.disconnect();
      setIsConnected(false);
      setOnlineUsers([]);
      setTypingUsers([]);
    };
  }, [token, user]);

  const sendMessage = (message) => {
    socketService.sendMessage(message);
  };

  const startTyping = (data) => {
    socketService.startTyping(data);
  };

  const stopTyping = (data) => {
    socketService.stopTyping(data);
  };

  const sendNotification = (notification) => {
    socketService.sendNotification(notification);
  };

  const value = {
    isConnected,
    onlineUsers,
    typingUsers,
    notifications,
    sendMessage,
    startTyping,
    stopTyping,
    sendNotification
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
