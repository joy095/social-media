import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { PlusCircle, Users, TrendingUp } from 'lucide-react';
import PostCard from '~/components/PostCard';
import { useAuth } from '~/contexts/AuthContext';
import { postsAPI, socialAPI, Post, User } from '~/lib/api';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface FeedState {
  posts: Post[];
  suggestions: User[];
  isLoading: boolean;
  hasMore: boolean;
  page: number;
}

export function meta() {
  return [
    { title: "Home - Social App" },
    { name: "description", content: "Your social media feed" },
  ];
}

export default function Home() {
  const { user } = useAuth();
  const [feedState, setFeedState] = useState<FeedState>({
    posts: [],
    suggestions: [],
    isLoading: true,
    hasMore: true,
    page: 1
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setFeedState(prev => ({ ...prev, isLoading: true }));
      
      // Load posts and suggestions in parallel
      const [postsResponse, suggestionsResponse] = await Promise.all([
        postsAPI.getPosts({ page: 1, limit: 10 }),
        socialAPI.getSuggestions(5)
      ]);

      if (postsResponse.data.success) {
        setFeedState(prev => ({
          ...prev,
          posts: postsResponse.data.data || [],
          hasMore: postsResponse.data.pagination?.hasMore || false
        }));
      }

      if (suggestionsResponse.data.success) {
        setFeedState(prev => ({
          ...prev,
          suggestions: suggestionsResponse.data.data || []
        }));
      }
    } catch (error) {
      console.error('Error loading feed:', error);
      toast.error('Failed to load feed');
    } finally {
      setFeedState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleLoadMore = async () => {
    if (!feedState.hasMore || feedState.isLoading) return;
    
    try {
      const nextPage = feedState.page + 1;
      const response = await postsAPI.getPosts({ page: nextPage, limit: 10 });
      
      if (response.data.success) {
        const newPosts = response.data.data || [];
        setFeedState(prev => ({
          ...prev,
          posts: [...prev.posts, ...newPosts],
          page: nextPage,
          hasMore: response.data.pagination?.hasMore || false
        }));
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
      toast.error('Failed to load more posts');
    }
  };

  const handleLike = async (postId: string, isLiked: boolean) => {
    try {
      await postsAPI.likePost(postId);
      // Update the post in the feed
      setFeedState(prev => ({
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

  const handleFollow = async (userId: string) => {
    try {
      await socialAPI.followUser(userId);
      // Remove from suggestions
      setFeedState(prev => ({
        ...prev,
        suggestions: prev.suggestions.filter(user => user._id !== userId)
      }));
      toast.success('Following user!');
    } catch (error) {
      console.error('Error following user:', error);
      toast.error('Failed to follow user');
    }
  };

  if (feedState.isLoading && feedState.posts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <div className="h-3 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-3">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {user?.fullName}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Catch up with what's happening in your network
            </p>
          </div>

          {/* Quick Actions */}
          <div className="mb-6">
            <Link
              to="/create-post"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <PlusCircle className="mr-2" size={20} />
              Create Post
            </Link>
          </div>

          {/* Posts Feed */}
          <div className="space-y-6">
            {feedState.posts.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg"
              >
                <div className="max-w-md mx-auto">
                  <PlusCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No posts yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Be the first to share something with the community!
                  </p>
                  <Link
                    to="/create-post"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Create Your First Post
                  </Link>
                </div>
              </motion.div>
            ) : (
              feedState.posts.map((post, index) => (
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
              ))
            )}

            {/* Load More */}
            {feedState.hasMore && (
              <div className="text-center py-4">
                <button
                  onClick={handleLoadMore}
                  disabled={feedState.isLoading}
                  className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  {feedState.isLoading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* User Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Your Stats
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Posts</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {user?.postsCount || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Followers</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {user?.followersCount || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Following</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {user?.followingCount || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Follow Suggestions */}
          {feedState.suggestions.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Users className="mr-2" size={20} />
                Suggested for you
              </h3>
              <div className="space-y-4">
                {feedState.suggestions.map((suggestion) => (
                  <div key={suggestion._id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Link to={`/profile/${suggestion._id}`}>
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={suggestion.profilePicture?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(suggestion.fullName)}&background=6366f1&color=ffffff`}
                          alt={suggestion.fullName}
                          loading='lazy'
                        />
                      </Link>
                      <div>
                        <Link 
                          to={`/profile/${suggestion._id}`}
                          className="font-medium text-gray-900 dark:text-white hover:underline"
                        >
                          {suggestion.fullName}
                        </Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          @{suggestion.username}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleFollow(suggestion._id)}
                      className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trending Topics */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <TrendingUp className="mr-2" size={20} />
              Trending
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">#socialapp</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">1.2k posts</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">#technology</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">856 posts</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">#photography</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">723 posts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
