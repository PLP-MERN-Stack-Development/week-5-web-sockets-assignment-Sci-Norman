import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PostDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getById(id);
      setPost(response.data.data);
    } catch (error) {
      setError('Failed to fetch post');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await postsAPI.addComment(id, { content: comment });
      setComment('');
      fetchPost();
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Post not found</p>
      </div>
    );
  }

  const canEdit = user && (user.id === post.author?._id || user.role === 'admin');

  return (
    <article className="max-w-4xl mx-auto">
      {post.featuredImage && (
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-64 md:h-96 object-cover rounded-lg mb-6"
        />
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span>{post.author?.username}</span>
            <span className="mx-2">•</span>
            <span>{formatDate(post.createdAt)}</span>
            <span className="mx-2">•</span>
            <span>{post.category?.name}</span>
            <span className="mx-2">•</span>
            <span>{post.views} views</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
          
          {canEdit && (
            <div className="mb-4">
              <Link
                to={`/edit-post/${post._id}`}
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Edit Post
              </Link>
            </div>
          )}
        </div>
        
        <div className="prose max-w-none mb-6">
          <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
        </div>
        
        {post.tags && post.tags.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Comments ({post.comments?.length || 0})</h3>
        
        {isAuthenticated && (
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
            <button
              type="submit"
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Post Comment
            </button>
          </form>
        )}
        
        <div className="space-y-4">
          {post.comments?.map((comment) => (
            <div key={comment._id} className="border-b border-gray-200 pb-4">
              <div className="flex items-center mb-2">
                <span className="font-semibold">{comment.author?.username}</span>
                <span className="ml-2 text-sm text-gray-500">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
};

export default PostDetail;
