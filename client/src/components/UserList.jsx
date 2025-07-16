import React from 'react';

const UserList = ({ users, currentUser, selectedUser, onSelectUser }) => {
  const filteredUsers = users.filter(user => user.id !== currentUser._id);

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4">
        <button
          onClick={() => onSelectUser(null)}
          className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${
            !selectedUser ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="font-medium">Global Chat</span>
          </div>
        </button>

        <h3 className="text-sm font-semibold text-gray-600 mb-2 mt-4">Online Users</h3>
        
        {filteredUsers.length === 0 ? (
          <p className="text-sm text-gray-500">No other users online</p>
        ) : (
          filteredUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => onSelectUser(user)}
              className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${
                selectedUser?.id === user.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full mr-3 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-600">
                    {user.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-medium">{user.username}</div>
                  <div className="text-xs text-gray-500">Online</div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default UserList;
