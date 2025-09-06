import React, { useState, useEffect } from 'react';
import { useAuth } from '~/contexts/AuthContext';
import { usersAPI, postsAPI, User, Post } from '~/lib/api';
import { Search as SearchIcon, User as UserIcon, Hash, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import PostCard from '~/components/PostCard';

export function meta() {
  return [
    { title: "Search - Social App" },
    { name: "description", content: "Search for users and posts" },
  ];
}

interface SearchResults {
  users: User[];
  posts: Post[];
}

export default function Search() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'posts'>('users');
  const [results, setResults] = useState<SearchResults>({ users: [], posts: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (query.trim()) {
        performSearch(query.trim());
      } else {
        setResults({ users: [], posts: [] });
        setHasSearched(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query, activeTab]);

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      if (activeTab === 'users') {
        const response = await usersAPI.searchUsers({ query: searchQuery, page: 1, limit: 20 });
        if (response.data.success) {
          setResults(prev => ({ ...prev, users: response.data.data || [] }));
        }
      } else {
        const response = await postsAPI.searchPosts({ query: searchQuery, page: 1, limit: 20 });
        if (response.data.success) {
          setResults(prev => ({ ...prev, posts: response.data.data || [] }));
        }
      }
    } catch (error) {
      console.error('Search failed:', error);
      setResults({ users: [], posts: [] });
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { key: 'users' as const, label: 'Users', icon: UserIcon },
    { key: 'posts' as const, label: 'Posts', icon: Hash }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Search
        </h1>
        
        {/* Search Input */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for users, posts..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
          />
        </div>
      </motion.div>

      {/* Search Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                  activeTab === tab.key
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                <tab.icon className="mr-2" size={16} />
                {tab.label}
                {query && (
                  <span className="ml-2 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                    {activeTab === tab.key ? 
                      (activeTab === 'users' ? results.users.length : results.posts.length) : 
                      0
                    }
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </motion.div>

      {/* Search Results */}
      <div>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="animate-spin h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Searching...</span>
          </div>
        ) : query.length === 0 ? (
          <div className="text-center py-12">
            <SearchIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Start searching
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Type something to search for users and posts
            </p>
          </div>
        ) : activeTab === 'users' ? (
          <div>
            {results.users.length === 0 && hasSearched ? (
              <div className="text-center py-12">
                <UserIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No users found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try searching with different keywords
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.users.map((searchUser, index) => (
                  <motion.div
                    key={searchUser._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          className="h-12 w-12 rounded-full object-cover"
                          src={searchUser.profilePicture?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(searchUser.fullName)}&background=6366f1&color=ffffff&size=48`}
                          alt={searchUser.fullName}
                        />
                        <div>
                          <Link
                            to={`/profile/${searchUser._id}`}
                            className="text-lg font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
                          >
                            {searchUser.fullName}
                          </Link>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            @{searchUser.username}
                          </p>
                          {searchUser.bio && (
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                              {searchUser.bio.length > 100 
                                ? `${searchUser.bio.substring(0, 100)}...` 
                                : searchUser.bio
                              }
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {searchUser._id !== user?._id && (
                        <Link
                          to={`/profile/${searchUser._id}`}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                        >
                          View Profile
                        </Link>
                      )}
                    </div>
                    
                    <div className="flex items-center mt-3 space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>{searchUser.followersCount} followers</span>
                      <span>{searchUser.followingCount} following</span>
                      <span>{searchUser.postsCount} posts</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {results.posts.length === 0 && hasSearched ? (
              <div className="text-center py-12">
                <Hash className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No posts found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try searching with different keywords
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {results.posts.map((post, index) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <PostCard
                      post={post}
                      onLike={async () => {}}
                      showActions={true}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
