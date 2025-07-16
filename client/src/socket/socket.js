import { io } from 'socket.io-client';
import { getToken } from '../services/api';

const SOCKET_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect() {
    const token = getToken();
    
    if (!token) {
      console.error('No token found for socket connection');
      return null;
    }

    this.socket = io(SOCKET_URL, {
      auth: {
        token
      },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Connected to socket server');
      this.connected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
      this.connected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  getSocket() {
    return this.socket;
  }

  isConnected() {
    return this.connected;
  }

  // Chat events
  sendMessage(message) {
    if (this.socket) {
      this.socket.emit('sendMessage', message);
    }
  }

  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on('newMessage', callback);
    }
  }

  // Typing events
  startTyping(data) {
    if (this.socket) {
      this.socket.emit('typing', data);
    }
  }

  stopTyping(data) {
    if (this.socket) {
      this.socket.emit('stopTyping', data);
    }
  }

  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on('userTyping', callback);
    }
  }

  onUserStoppedTyping(callback) {
    if (this.socket) {
      this.socket.on('userStoppedTyping', callback);
    }
  }

  // User events
  onUserJoined(callback) {
    if (this.socket) {
      this.socket.on('userJoined', callback);
    }
  }

  onUserLeft(callback) {
    if (this.socket) {
      this.socket.on('userLeft', callback);
    }
  }

  onOnlineUsers(callback) {
    if (this.socket) {
      this.socket.on('onlineUsers', callback);
    }
  }

  // Notification events
  onNotification(callback) {
    if (this.socket) {
      this.socket.on('notification', callback);
    }
  }

  sendNotification(notification) {
    if (this.socket) {
      this.socket.emit('sendNotification', notification);
    }
  }

  // Remove listeners
  off(event) {
    if (this.socket) {
      this.socket.off(event);
    }
  }
}

export default new SocketService();
