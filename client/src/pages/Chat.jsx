import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import ChatWindow from '../components/ChatWindow';
import MessageInput from '../components/MessageInput';
import UserList from '../components/UserList';
import toast from 'react-hot-toast';

const Chat = () => {
  const { user } = useAuth();
  const { 
    isConnected, 
    onlineUsers, 
    typingUsers, 
    sendMessage, 
    startTyping, 
    stopTyping 
  } = useSocket();
  
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Load initial messages
    loadMessages();
  }, []);

  useEffect(() => {
    // Set up socket listeners
    const handleNewMessage = (message) => {
      setMessages(prev => [...prev, message]);
      
      // Show toast for new messages
      if (message.sender._id !== user._id) {
        toast.success(`New message from ${message.sender.username}`);
      }
    };

    // Listen for new messages
    const socket = window.socketService?.getSocket();
    if (socket) {
      socket.on('newMessage', handleNewMessage);
    }

    return () => {
      if (socket) {
        socket.off('newMessage', handleNewMessage);
      }
    };
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/messages`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (content) => {
    if (!content.trim()) return;

    const messageData = {
      content: content.trim(),
      room: selectedUser ? null : 'global',
      recipient: selectedUser ? selectedUser.id : null
    };

    sendMessage(messageData);
  };

  const handleTyping = () => {
    const typingData = {
      room: selectedUser ? null : 'global',
      recipient: selectedUser ? selectedUser.id : null
    };
    startTyping(typingData);
  };

  const handleStopTyping = () => {
    const typingData = {
      room: selectedUser ? null : 'global',
      recipient: selectedUser ? selectedUser.id : null
    };
    stopTyping(typingData);
  };

  const getTypingText = () => {
    const relevantTyping = typingUsers.filter(user => {
      if (selectedUser) {
        return user.userId === selectedUser.id;
      } else {
        return !user.recipient;
      }
    });

    if (relevantTyping.length === 0) return '';
    
    if (relevantTyping.length === 1) {
      return `${relevantTyping[0].username} is typing...`;
    } else if (relevantTyping.length === 2) {
      return `${relevantTyping[0].username} and ${relevantTyping[1].username} are typing...`;
    } else {
      return `${relevantTyping.length} people are typing...`;
    }
  };

  const filteredMessages = selectedUser 
    ? messages.filter(msg => 
        (msg.sender._id === selectedUser.id && msg.recipient?._id === user._id) ||
        (msg.sender._id === user._id && msg.recipient?._id === selectedUser.id)
      )
    : messages.filter(msg => !msg.recipient);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar with online users */}
      <div className="w-80 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Chat</h2>
          <div className="flex items-center mt-2">
            <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        
        <UserList 
          users={onlineUsers} 
          currentUser={user}
          selectedUser={selectedUser}
          onSelectUser={setSelectedUser}
        />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {selectedUser ? `Chat with ${selectedUser.username}` : 'Global Chat'}
          </h3>
        </div>

        <ChatWindow 
          messages={filteredMessages}
          currentUser={user}
          isLoading={isLoading}
          typingText={getTypingText()}
        />

        <div ref={messagesEndRef} />

        <MessageInput 
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
          onStopTyping={handleStopTyping}
          disabled={!isConnected}
        />
      </div>
    </div>
  );
};

export default Chat;
