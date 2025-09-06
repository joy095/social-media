import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI, setToken, removeToken, getToken, User } from '~/lib/api';
import type { ReactNode } from "react";
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'LOADING' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOADING':
      return { ...state, isLoading: true, error: null };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (loginField: string, password: string) => Promise<void>;
  register: (data: {
    fullName: string;
    email: string;
    username: string;
    password: string;
    bio?: string;
    isPrivate?: boolean;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          dispatch({ type: 'LOADING' });
          const response = await authAPI.getMe();
          if (response.data.success) {
            dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.data! });
          } else {
            removeToken();
            dispatch({ type: 'LOGOUT' });
          }
        } catch (error) {
          console.error('Auth initialization failed:', error);
          removeToken();
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    };

    initAuth();
  }, []);

  const login = async (loginField: string, password: string): Promise<void> => {
    try {
      dispatch({ type: 'LOADING' });
      const response = await authAPI.login({ loginField, password });

      if (response.data.success) {
        const { user, token } = response.data.data!;
        setToken(token);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        toast.success('Login successful!');
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: response.data.message || 'Login failed' });
        toast.error(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      toast.error(errorMessage);
    }
  };

  const register = async (data: {
    fullName: string;
    email: string;
    username: string;
    password: string;
    bio?: string;
    isPrivate?: boolean;
  }): Promise<void> => {
    try {
      dispatch({ type: 'LOADING' });
      const response = await authAPI.register(data);

      if (response.data.success) {
        const { user, token } = response.data.data!;
        setToken(token);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        toast.success('Registration successful!');
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: response.data.message || 'Registration failed' });
        toast.error(response.data.message || 'Registration failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      toast.error(errorMessage);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeToken();
      dispatch({ type: 'LOGOUT' });
      toast.success('Logged out successfully');
    }
  };

  const updateUser = (user: User): void => {
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    clearError,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
