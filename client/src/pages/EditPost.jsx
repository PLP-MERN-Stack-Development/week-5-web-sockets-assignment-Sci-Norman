import React from 'react';
import { useParams } from 'react-router-dom';

const EditPost = () => {
  const { id } = useParams();
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Post</h1>
      <p className="text-gray-600">Edit post functionality would be implemented here for post ID: {id}</p>
    </div>
  );
};

export default EditPost;
