import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '~/contexts/AuthContext';
import { postsAPI } from '~/lib/api';
import { 
  Image as ImageIcon, 
  X, 
  Upload, 
  Loader,
  ArrowLeft,
  MapPin,
  Users,
  Lock
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface PostForm {
  content: string;
  images: File[];
  location?: string;
  visibility: 'public' | 'private' | 'followers';
}

export function meta() {
  return [
    { title: "Create Post - Social App" },
    { name: "description", content: "Create a new post" },
  ];
}

export default function CreatePost() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<PostForm>({
    content: '',
    images: [],
    location: '',
    visibility: 'public'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Redirect if not authenticated
  if (!user) {
    navigate('/login');
    return null;
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, content: e.target.value }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, location: e.target.value }));
  };

  const handleVisibilityChange = (visibility: 'public' | 'private' | 'followers') => {
    setFormData(prev => ({ ...prev, visibility }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error(`${file.name} is too large. Maximum size is 10MB`);
        return false;
      }
      return true;
    });

    if (formData.images.length + validFiles.length > 5) {
      toast.error('You can only upload up to 5 images per post');
      return;
    }

    // Create preview URLs
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validFiles]
    }));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    // Revoke the preview URL to prevent memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.content.trim() && formData.images.length === 0) {
      toast.error('Please add some content or images to your post');
      return;
    }

    setIsSubmitting(true);

    try {
      const postData = new FormData();
      postData.append('content', formData.content.trim());
      
      if (formData.location) {
        postData.append('location', formData.location);
      }
      
      postData.append('visibility', formData.visibility);
      
      // Add images
      formData.images.forEach((image, index) => {
        postData.append(`images`, image);
      });

      const response = await postsAPI.createPost(postData);

      if (response.data.success) {
        toast.success('Post created successfully!');
        // Clean up preview URLs
        previewUrls.forEach(url => URL.revokeObjectURL(url));
        navigate('/home');
      }
    } catch (error: any) {
      console.error('Error creating post:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to create post. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const visibilityOptions = [
    {
      value: 'public' as const,
      label: 'Public',
      description: 'Anyone can see this post',
      icon: Users
    },
    {
      value: 'followers' as const,
      label: 'Followers',
      description: 'Only your followers can see this post',
      icon: Users
    },
    {
      value: 'private' as const,
      label: 'Private',
      description: 'Only you can see this post',
      icon: Lock
    }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create Post
          </h1>
        </div>
      </motion.div>

      {/* Create Post Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        {/* User Info */}
        <div className="flex items-center mb-4">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src={user.profilePicture?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=6366f1&color=ffffff&size=48`}
            alt={user.fullName}
            loading='lazy'
          />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user.fullName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              @{user.username}
            </p>
          </div>
        </div>

        {/* Content Input */}
        <div className="mb-4">
          <textarea
            value={formData.content}
            onChange={handleContentChange}
            placeholder="What's on your mind?"
            rows={4}
            className="block w-full rounded-lg border-0 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:ring-0 text-lg"
            style={{ minHeight: '120px' }}
          />
        </div>

        {/* Image Previews */}
        {previewUrls.length > 0 && (
          <div className="mb-4">
            <div className={`grid gap-2 ${
              previewUrls.length === 1 ? 'grid-cols-1' :
              previewUrls.length === 2 ? 'grid-cols-2' :
              previewUrls.length === 3 ? 'grid-cols-3' :
              'grid-cols-2'
            }`}>
              {previewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                    loading='lazy'
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Location Input */}
        <div className="mb-4">
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={formData.location}
              onChange={handleLocationChange}
              placeholder="Add location (optional)"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Visibility Settings */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Who can see this post?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {visibilityOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleVisibilityChange(option.value)}
                className={`p-3 rounded-lg border-2 transition-colors text-left ${
                  formData.visibility === option.value
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="flex items-center">
                  <option.icon className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {option.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {option.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              multiple
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={formData.images.length >= 5}
              className="inline-flex items-center p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={formData.images.length >= 5 ? 'Maximum 5 images allowed' : 'Add images'}
            >
              <ImageIcon size={20} />
            </button>
            {formData.images.length > 0 && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formData.images.length}/5 images
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || (!formData.content.trim() && formData.images.length === 0)}
            className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Posting...
              </>
            ) : (
              'Post'
            )}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
