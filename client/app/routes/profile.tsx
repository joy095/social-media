import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { useAuth } from '~/contexts/AuthContext';
import { usersAPI, postsAPI, socialAPI, User, Post } from '~/lib/api';
import PostCard from '~/components/PostCard';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Image as ImageIcon, 
  Settings, 
  UserPlus, 
  UserMinus,
  Lock 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

interface ProfileState {
  user: User | null;
  posts: Post[];
  isLoading: boolean;
  isFollowing: boolean;
  showFollowers: boolean;
  showFollowing: boolean;
}

export function meta({ params }: { params: { userId?: string } }) {
  return [
    { title: `Profile - Social App` },
    { name: "description", content: "User profile page" },
  ];
}

export default function Profile() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [profileState, setProfileState] = useState<ProfileState>({
    user: null,
    posts: [],
    isLoading: true,
    isFollowing: false,
    showFollowers: false,
    showFollowing: false
  });

  // Use current user's ID if no userId is provided
  const targetUserId = userId || currentUser?._id;
  const isOwnProfile = targetUserId === currentUser?._id;

  useEffect(() => {
    if (targetUserId) {
      loadProfile(targetUserId);
    }
  }, [targetUserId]);

  const loadProfile = async (id: string) => {
    try {
      setProfileState(prev => ({ ...prev, isLoading: true }));

      const [userResponse, postsResponse] = await Promise.all([
        usersAPI.getUser(id),
        postsAPI.getUserPosts(id, { page: 1, limit: 20 })
      ]);

      if (userResponse.data.success && postsResponse.data.success) {
        setProfileState(prev => ({
          ...prev,
          user: userResponse.data.data,
          posts: postsResponse.data.data || [],
          isFollowing: userResponse.data.data?.isFollowedByCurrentUser || false
        }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setProfileState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleFollow = async () => {
    if (!targetUserId) return;
    
    try {
      await socialAPI.followUser(targetUserId);
      setProfileState(prev => ({
        ...prev,
        isFollowing: !prev.isFollowing,
        user: prev.user ? {
          ...prev.user,
          followersCount: prev.isFollowing 
            ? prev.user.followersCount - 1 
            : prev.user.followersCount + 1
        } : null
      }));
      toast.success(profileState.isFollowing ? 'Unfollowed' : 'Following!');
    } catch (error) {
      console.error('Error following user:', error);
      toast.error('Failed to follow user');
    }
  };

  const handleLike = async (postId: string, isLiked: boolean) => {
    try {
      await postsAPI.likePost(postId);
      setProfileState(prev => ({
        ...prev,
        posts: prev.posts.map(post => 
          post._id === postId 
            ? { 
                ...post, 
                isLikedByUser: isLiked,
                likesCount: isLiked ? post.likesCount + 1 : post.likesCount - 1
              }
            : post
        )
      }));
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Failed to like post');
    }
  };

  if (profileState.isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          {/* Profile header skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-6">
            <div className="flex items-start space-x-6">
              <div className="h-24 w-24 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              <div className="flex-1 space-y-3">
                <div className="h-6 w-48 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-4 w-full bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            </div>
          </div>
          
          {/* Posts skeleton */}
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <div className="h-4 w-full bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!profileState.user) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          User not found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The user you're looking for doesn't exist or may have been deactivated.
        </p>
        <Link
          to="/home"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Go back to feed
        </Link>
      </div>
    );
  }

  const user = profileState.user;
  const canViewPosts = isOwnProfile || !user.isPrivate || profileState.isFollowing;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            <img
              className="h-24 w-24 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600"
              src={user.profilePicture?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=6366f1&color=ffffff&size=96`}
              alt={user.fullName}
            />
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  {user.fullName}
                  {user.isPrivate && <Lock className="ml-2" size={16} />}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">@{user.username}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-3 sm:mt-0">
                {isOwnProfile ? (
                  <Link
                    to="/settings"
                    className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Settings className="mr-2" size={16} />
                    Edit Profile
                  </Link>
                ) : (
                  <button
                    onClick={handleFollow}
                    className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${
                      profileState.isFollowing
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {profileState.isFollowing ? (
                      <>
                        <UserMinus className="mr-2" size={16} />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2" size={16} />
                        Follow
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Bio */}
            {user.bio && (
              <p className="text-gray-700 dark:text-gray-300 mb-4">{user.bio}</p>
            )}

            {/* User Stats */}
            <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-4">
                <span className="font-medium text-gray-900 dark:text-white">
                  {user.postsCount}
                </span>
                <span>Posts</span>
              </div>
              <Link
                to={`/followers/${user._id}`}
                className="flex items-center space-x-1 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <span className="font-medium text-gray-900 dark:text-white">
                  {user.followersCount}
                </span>
                <span>Followers</span>
              </Link>
              <Link
                to={`/following/${user._id}`}
                className="flex items-center space-x-1 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <span className="font-medium text-gray-900 dark:text-white">
                  {user.followingCount}
                </span>
                <span>Following</span>
              </Link>
            </div>

            {/* Join Date */}
            <div className="flex items-center mt-3 text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="mr-1" size={14} />
              <span>
                Joined {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Posts Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <ImageIcon className="mr-2" size={20} />
          Posts
        </h2>

        {!canViewPosts ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Lock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              This account is private
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Follow @{user.username} to see their posts
            </p>
            <button
              onClick={handleFollow}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <UserPlus className="mr-2" size={16} />
              Follow
            </button>
          </div>
        ) : profileState.posts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No posts yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {isOwnProfile 
                ? "Share your first post with the community!" 
                : `${user.fullName} hasn't posted anything yet.`
              }
            </p>
            {isOwnProfile && (
              <Link
                to="/create-post"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors mt-4"
              >
                Create Your First Post
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {profileState.posts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PostCard
                  post={post}
                  onLike={handleLike}
                  showActions={true}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
