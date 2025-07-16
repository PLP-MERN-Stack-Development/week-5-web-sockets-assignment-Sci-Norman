import React from 'react';
import Message from './Message';

const ChatWindow = ({ messages, currentUser, isLoading, typingText }) => {
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          No messages yet. Start the conversation!
        </div>
      ) : (
        messages.map((message) => (
          <Message 
            key={message._id} 
            message={message} 
            isOwn={message.sender._id === currentUser._id} 
          />
        ))
      )}
      
      {typingText && (
        <div className="text-sm text-gray-500 italic">
          {typingText}
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
