import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { socialAPI, User } from '~/lib/api';
import { ArrowLeft, Users, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export function meta({ params }: { params: { userId: string } }) {
  return [
    { title: `Followers - Social App` },
    { name: "description", content: "View user followers" },
  ];
}

export default function Followers() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [followers, setFollowers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadFollowers(userId);
    }
  }, [userId]);

  const loadFollowers = async (id: string) => {
    try {
      const response = await socialAPI.getFollowers(id, { page: 1, limit: 50 });
      if (response.data.success) {
        setFollowers(response.data.data || []);
      }
    } catch (error) {
      console.error('Error loading followers:', error);
      toast.error('Failed to load followers');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin h-8 w-8 text-indigo-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Users className="mr-2" size={24} />
          Followers ({followers.length})
        </h1>
      </div>

      {followers.length === 0 ? (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No followers yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {followers.map((follower, index) => (
            <motion.div
              key={follower._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    className="h-12 w-12 rounded-full object-cover"
                    src={follower.profilePicture?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(follower.fullName)}&background=6366f1&color=ffffff&size=48`}
                    alt={follower.fullName}
                    loading='lazy'
                  />
                  <div>
                    <Link
                      to={`/profile/${follower._id}`}
                      className="text-lg font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      {follower.fullName}
                    </Link>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      @{follower.username}
                    </p>
                    {follower.bio && (
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                        {follower.bio.length > 100 
                          ? `${follower.bio.substring(0, 100)}...` 
                          : follower.bio
                        }
                      </p>
                    )}
                  </div>
                </div>
                
                <Link
                  to={`/profile/${follower._id}`}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  View Profile
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
