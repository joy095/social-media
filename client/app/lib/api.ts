import axios from 'axios';
import type { AxiosResponse } from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      // Redirect to login or trigger auth state update
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API interface types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasMore: boolean;
  };
}

export interface LoginData {
  loginField: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  username: string;
  password: string;
  bio?: string;
  isPrivate?: boolean;
}

export interface User {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  bio: string;
  profilePicture: {
    url: string;
    publicId?: string;
  };
  isPrivate: boolean;
  role: 'user' | 'admin' | 'manager' | 'accountant';
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowedByCurrentUser?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  _id: string;
  author: User;
  content: string;
  media: Array<{
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
    duration?: number;
  }>;
  location: string;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  isLikedByUser?: boolean;
  visibility: 'public' | 'followers' | 'private';
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  post: string;
  author: User;
  content: string;
  parentComment?: string;
  replies: Comment[];
  likesCount: number;
  isLikedByUser?: boolean;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth API
export const authAPI = {
  login: (data: LoginData): Promise<AxiosResponse<ApiResponse<{ user: User; token: string }>>> =>
    api.post('/auth/login', data),

  register: (data: RegisterData): Promise<AxiosResponse<ApiResponse<{ user: User; token: string }>>> =>
    api.post('/auth/register', data),

  logout: (): Promise<AxiosResponse<ApiResponse>> =>
    api.post('/auth/logout'),

  getMe: (): Promise<AxiosResponse<ApiResponse<User>>> =>
    api.get('/auth/me'),

  updateProfile: (data: FormData): Promise<AxiosResponse<ApiResponse<User>>> =>
    api.put('/auth/profile', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  updatePassword: (data: { currentPassword: string; newPassword: string }): Promise<AxiosResponse<ApiResponse>> =>
    api.put('/auth/password', data),
};

// Posts API
export const postsAPI = {
  getPosts: (params?: { page?: number; limit?: number; location?: string }): Promise<AxiosResponse<ApiResponse<Post[]>>> =>
    api.get('/posts', { params }),

  getPost: (id: string): Promise<AxiosResponse<ApiResponse<Post>>> =>
    api.get(`/posts/${id}`),

  createPost: (data: FormData): Promise<AxiosResponse<ApiResponse<Post>>> =>
    api.post('/posts', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  updatePost: (id: string, data: { content?: string; visibility?: string }): Promise<AxiosResponse<ApiResponse<Post>>> =>
    api.put(`/posts/${id}`, data),

  deletePost: (id: string): Promise<AxiosResponse<ApiResponse>> =>
    api.delete(`/posts/${id}`),

  likePost: (id: string): Promise<AxiosResponse<ApiResponse<{ likeCount: number; isLiked: boolean }>>> =>
    api.post(`/posts/${id}/like`),

  viewPost: (id: string, duration?: number): Promise<AxiosResponse<ApiResponse>> =>
    api.post(`/posts/${id}/view`, { duration }),

  getUserPosts: (userId: string, params?: { page?: number; limit?: number }): Promise<AxiosResponse<ApiResponse<Post[]>>> =>
    api.get(`/posts/user/${userId}`, { params }),
};

// Social API
export const socialAPI = {
  followUser: (userId: string): Promise<AxiosResponse<ApiResponse<{ isFollowing: boolean; followersCount: number }>>> =>
    api.post(`/social/follow/${userId}`),

  getFollowers: (userId: string, params?: { page?: number; limit?: number }): Promise<AxiosResponse<ApiResponse<User[]>>> =>
    api.get(`/social/followers/${userId}`, { params }),

  getFollowing: (userId: string, params?: { page?: number; limit?: number }): Promise<AxiosResponse<ApiResponse<User[]>>> =>
    api.get(`/social/following/${userId}`, { params }),

  getSuggestions: (limit?: number): Promise<AxiosResponse<ApiResponse<User[]>>> =>
    api.get('/social/suggestions', { params: { limit } }),

  getComments: (postId: string, params?: { page?: number; limit?: number }): Promise<AxiosResponse<ApiResponse<Comment[]>>> =>
    api.get(`/social/comments/${postId}`, { params }),

  addComment: (data: { postId: string; content: string; parentComment?: string }): Promise<AxiosResponse<ApiResponse<Comment>>> =>
    api.post('/social/comment', data),

  updateComment: (commentId: string, data: { content: string }): Promise<AxiosResponse<ApiResponse<Comment>>> =>
    api.put(`/social/comment/${commentId}`, data),

  deleteComment: (commentId: string): Promise<AxiosResponse<ApiResponse>> =>
    api.delete(`/social/comment/${commentId}`),

  likeComment: (commentId: string): Promise<AxiosResponse<ApiResponse<{ likeCount: number; isLiked: boolean }>>> =>
    api.post(`/social/comment/${commentId}/like`),
};

// Users API
export const usersAPI = {
  getUsers: (params?: { search?: string; page?: number; limit?: number }): Promise<AxiosResponse<ApiResponse<User[]>>> =>
    api.get('/users', { params }),

  getUser: (id: string): Promise<AxiosResponse<ApiResponse<User>>> =>
    api.get(`/users/${id}`),

  getUserStats: (id: string): Promise<AxiosResponse<ApiResponse<{ followers: number; following: number; posts: number; earnings: number }>>> =>
    api.get(`/users/${id}/stats`),
};

// Admin API
export const adminAPI = {
  getDashboard: (): Promise<AxiosResponse<ApiResponse>> =>
    api.get('/admin/dashboard'),

  getUsers: (params?: { page?: number; limit?: number; role?: string; flagged?: boolean }): Promise<AxiosResponse<ApiResponse<User[]>>> =>
    api.get('/admin/users', { params }),

  getPosts: (params?: { page?: number; limit?: number; status?: string }): Promise<AxiosResponse<ApiResponse<Post[]>>> =>
    api.get('/admin/posts', { params }),

  approvePost: (id: string): Promise<AxiosResponse<ApiResponse<Post>>> =>
    api.put(`/admin/posts/${id}/approve`),

  getRevenue: (): Promise<AxiosResponse<ApiResponse>> =>
    api.get('/admin/revenue'),

  updateRevenue: (data: { city: string; pricePerView: number; pricePerLike: number }): Promise<AxiosResponse<ApiResponse>> =>
    api.post('/admin/revenue', data),
};

export { api, setToken, removeToken, getToken };
export default api;
