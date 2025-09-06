import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useAuth } from '~/contexts/AuthContext';
import { postsAPI, Post, Comment } from '~/lib/api';
import PostCard from '~/components/PostCard';
import CommentCard from '~/components/CommentCard';
import { 
  ArrowLeft, 
  MessageCircle, 
  Send, 
  Loader,
  AlertCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface PostDetailsState {
  post: Post | null;
  comments: Comment[];
  isLoading: boolean;
  isLoadingComments: boolean;
  commentsPage: number;
  hasMoreComments: boolean;
}

export function meta({ params }: { params: { id: string } }) {
  return [
    { title: `Post Details - Social App` },
    { name: "description", content: "View post and comments" },
  ];
}

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [state, setState] = useState<PostDetailsState>({
    post: null,
    comments: [],
    isLoading: true,
    isLoadingComments: false,
    commentsPage: 1,
    hasMoreComments: false
  });
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    if (id) {
      loadPost(id);
      loadComments(id);
    }
  }, [id]);

  const loadPost = async (postId: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const response = await postsAPI.getPost(postId);
      
      if (response.data.success) {
        setState(prev => ({ ...prev, post: response.data.data }));
      }
    } catch (error) {
      console.error('Error loading post:', error);
      toast.error('Failed to load post');
      navigate('/'); // Redirect to home if post not found
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const loadComments = async (postId: string, page = 1) => {
    try {
      setState(prev => ({ ...prev, isLoadingComments: true }));
      const response = await postsAPI.getComments(postId, { page, limit: 20 });
      
      if (response.data.success) {
        const newComments = response.data.data || [];
        setState(prev => ({
          ...prev,
          comments: page === 1 ? newComments : [...prev.comments, ...newComments],
          hasMoreComments: newComments.length === 20,
          commentsPage: page
        }));
      }
    } catch (error) {
      console.error('Error loading comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setState(prev => ({ ...prev, isLoadingComments: false }));
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !id || !user) return;

    setIsSubmittingComment(true);
    try {
      const response = await postsAPI.createComment(id, { content: newComment.trim() });
      
      if (response.data.success) {
        const comment = response.data.data;
        setState(prev => ({
          ...prev,
          comments: [comment, ...prev.comments],
          post: prev.post ? {
            ...prev.post,
            commentsCount: prev.post.commentsCount + 1
          } : null
        }));
        setNewComment('');
        toast.success('Comment added!');
      }
    } catch (error) {
      console.error('Error creating comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleLike = async (isLiked: boolean) => {
    if (!state.post) return;
    
    try {
      await postsAPI.likePost(state.post._id);
      setState(prev => ({
        ...prev,
        post: prev.post ? {
          ...prev.post,
          isLikedByUser: isLiked,
          likesCount: isLiked ? prev.post.likesCount + 1 : prev.post.likesCount - 1
        } : null
      }));
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Failed to like post');
    }
  };

  const handleCommentLike = async (commentId: string, isLiked: boolean) => {
    try {
      await postsAPI.likeComment(commentId);
      setState(prev => ({
        ...prev,
        comments: prev.comments.map(comment =>
          comment._id === commentId
            ? {
                ...comment,
                isLikedByUser: isLiked,
                likesCount: isLiked ? comment.likesCount + 1 : comment.likesCount - 1
              }
            : comment
        )
      }));
    } catch (error) {
      console.error('Error liking comment:', error);
      toast.error('Failed to like comment');
    }
  };

  const loadMoreComments = () => {
    if (id && state.hasMoreComments && !state.isLoadingComments) {
      loadComments(id, state.commentsPage + 1);
    }
  };

  if (state.isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-6">
            <div className="h-4 w-full bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
            <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
            <div className="h-64 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!state.post) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Post not found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The post you're looking for doesn't exist or may have been deleted.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <ArrowLeft className="mr-2" size={16} />
          Go back to feed
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="mr-2" size={16} />
          Back
        </button>
      </motion.div>

      {/* Post */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <PostCard
          post={state.post}
          onLike={handleLike}
          showActions={true}
          expanded={true}
        />
      </motion.div>

      {/* Comments Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center mb-6">
          <MessageCircle className="mr-2 text-gray-500" size={20} />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Comments ({state.post.commentsCount})
          </h2>
        </div>

        {/* Comment Form */}
        {user ? (
          <form onSubmit={handleSubmitComment} className="mb-6">
            <div className="flex space-x-3">
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={user.profilePicture?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=6366f1&color=ffffff&size=40`}
                alt={user.fullName}
              />
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={3}
                  className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
                <div className="mt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={!newComment.trim() || isSubmittingComment}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmittingComment ? (
                      <>
                        <Loader className="animate-spin mr-2" size={16} />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2" size={16} />
                        Post Comment
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
            <p className="text-gray-600 dark:text-gray-400">
              <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
                Sign in
              </Link>{' '}
              to join the conversation
            </p>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {state.comments.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No comments yet. Be the first to comment!
              </p>
            </div>
          ) : (
            state.comments.map((comment, index) => (
              <motion.div
                key={comment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CommentCard
                  comment={comment}
                  onLike={handleCommentLike}
                />
              </motion.div>
            ))
          )}
        </div>

        {/* Load More Comments */}
        {state.hasMoreComments && (
          <div className="mt-6 text-center">
            <button
              onClick={loadMoreComments}
              disabled={state.isLoadingComments}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {state.isLoadingComments ? (
                <>
                  <Loader className="animate-spin mr-2" size={16} />
                  Loading...
                </>
              ) : (
                'Load More Comments'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
