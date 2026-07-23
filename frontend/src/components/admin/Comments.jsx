import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTrash, FaComment, FaUser, FaCalendar, FaSearch } from 'react-icons/fa';
import { commentService } from '../../services/commentService';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await commentService.getComments({ limit: 100 });
      setComments(response.comments || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      await commentService.deleteComment(id);
      toast.success('Comment deleted successfully');
      await fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error(error.response?.data?.message || 'Failed to delete comment');
    }
  };

  const filteredComments = comments.filter(comment =>
    comment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comment.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-secondary-dark">
          Comments
        </h2>
        <p className="text-secondary-dark/60">Manage user comments</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-dark/40" />
        <input
          type="text"
          placeholder="Search comments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Comments List */}
      {filteredComments.length === 0 ? (
        <div className="glass-morphism rounded-3xl p-12 text-center">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-2xl font-display text-secondary-dark mb-2">
            No Comments Found
          </h3>
          <p className="text-secondary-dark/60">
            {searchTerm ? 'No comments match your search' : 'No comments have been posted yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredComments.map((comment, index) => (
            <motion.div
              key={comment._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card-premium p-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-pink rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {comment.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-secondary-dark">
                      {comment.name}
                    </span>
                    <span className="text-xs text-secondary-dark/40 flex items-center gap-1">
                      <FaCalendar className="text-xs" />
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-secondary-dark/40">
                      {comment.type || 'general'}
                    </span>
                  </div>
                  <p className="text-secondary-dark/70 mt-1">
                    {comment.comment}
                  </p>
                  {comment.typeId && (
                    <p className="text-xs text-secondary-dark/40 mt-1">
                      Reference ID: {comment.typeId}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(comment._id)}
                  className="p-2 text-secondary-dark/40 hover:text-red-500 transition-colors flex-shrink-0"
                >
                  <FaTrash />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;