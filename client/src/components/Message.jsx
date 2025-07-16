import React from 'react';

const Message = ({ message, isOwn }) => {
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isOwn ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
        {!isOwn && (
          <div className="text-xs font-semibold mb-1">
            {message.sender.username}
          </div>
        )}
        
        <div className="text-sm">{message.content}</div>
        
        <div className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
          {formatTime(message.createdAt)}
        </div>
      </div>
    </div>
  );
};

export default Message;
