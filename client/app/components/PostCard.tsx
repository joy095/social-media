import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal, 
  Edit3, 
  Trash2, 
  Eye,
  MapPin,
  Play
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Post } from '~/lib/api';
import { useAuth } from '~/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface PostCardProps {
  post: Post;
  onLike?: (postId: string, isLiked: boolean) => void;
  onDelete?: (postId: string) => void;
  onEdit?: (postId: string) => void;
  showActions?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  onLike, 
  onDelete, 
  onEdit,
  showActions = true 
}) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(post.isLikedByUser || false);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [showMenu, setShowMenu] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Track view when 70% of post is visible
  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.7) {
            if (!isViewing) {
              setIsViewing(true);
              // TODO: Call API to record view
              console.log('Recording view for post:', post._id);
            }
          }
        });
      },
      { threshold: 0.7 }
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [post._id, isViewing]);

  const handleLike = async () => {
    try {
      const newIsLiked = !isLiked;
      const newCount = newIsLiked ? likesCount + 1 : likesCount - 1;
      
      setIsLiked(newIsLiked);
      setLikesCount(newCount);
      
      if (onLike) {
        onLike(post._id, newIsLiked);
      }
    } catch (error) {
      // Revert on error
      setIsLiked(!isLiked);
      setLikesCount(likesCount);
      toast.error('Failed to like post');
    }
  };

  const handleDelete = () => {
    if (onDelete && window.confirm('Are you sure you want to delete this post?')) {
      onDelete(post._id);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(post._id);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `Post by ${post.author.fullName}`,
        text: post.content,
        url: `${window.location.origin}/post/${post._id}`
      });
    } catch (error) {
      // Fallback to clipboard
      await navigator.clipboard.writeText(`${window.location.origin}/post/${post._id}`);
      toast.success('Link copied to clipboard');
    }
  };

  const canEdit = user?._id === post.author._id;
  const canDelete = user?._id === post.author._id || user?.role === 'admin';

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      {/* Post Header */}
      <div className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to={`/profile/${post.author._id}`}>
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={post.author.profilePicture?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.fullName)}&background=6366f1&color=ffffff`}
                alt={post.author.fullName}
              />
            </Link>
            <div>
              <Link 
                to={`/profile/${post.author._id}`}
                className="font-semibold text-gray-900 dark:text-white hover:underline"
              >
                {post.author.fullName}
              </Link>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <span>@{post.author.username}</span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                {post.location && (
                  <>
                    <span>•</span>
                    <div className="flex items-center">
                      <MapPin size={12} className="mr-1" />
                      <span>{post.location}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {showActions && (canEdit || canDelete) && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
              >
                <MoreHorizontal size={20} />
              </button>
              
              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10"
                  >
                    {canEdit && (
                      <button
                        onClick={handleEdit}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Edit3 size={16} className="mr-2" />
                        Edit
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={handleDelete}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Trash2 size={16} className="mr-2" />
                        Delete
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-2">
        <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      {/* Post Media */}
      {post.media && post.media.length > 0 && (
        <div className="relative">
          {post.media.length === 1 ? (
            <div className="relative">
              {post.media[0].type === 'image' ? (
                <img
                  src={post.media[0].url}
                  alt="Post media"
                  className="w-full max-h-96 object-cover"
                />
              ) : (
                <div className="relative">
                  <video
                    src={post.media[0].url}
                    poster={post.media[0].thumbnail}
                    controls
                    className="w-full max-h-96 object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-black bg-opacity-50 rounded-full p-3">
                      <Play className="text-white" size={24} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-1">
              {post.media.slice(0, 4).map((media, index) => (
                <div key={index} className="relative">
                  {media.type === 'image' ? (
                    <img
                      src={media.url}
                      alt={`Post media ${index + 1}`}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="relative">
                      <img
                        src={media.thumbnail}
                        alt={`Video thumbnail ${index + 1}`}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black bg-opacity-50 rounded-full p-2">
                          <Play className="text-white" size={16} />
                        </div>
                      </div>
                    </div>
                  )}
                  {index === 3 && post.media.length > 4 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white text-lg font-semibold">
                        +{post.media.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Post Actions */}
      {showActions && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 ${
                  isLiked 
                    ? 'text-red-500' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-red-500'
                }`}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart 
                    size={20} 
                    fill={isLiked ? 'currentColor' : 'none'}
                  />
                </motion.div>
                <span className="text-sm font-medium">{likesCount}</span>
              </button>
              
              <Link 
                to={`/post/${post._id}`}
                className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-blue-500"
              >
                <MessageCircle size={20} />
                <span className="text-sm font-medium">{post.commentsCount}</span>
              </Link>
              
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-green-500"
              >
                <Share2 size={20} />
              </button>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 text-sm">
              <Eye size={16} />
              <span>{post.viewsCount}</span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PostCard;
