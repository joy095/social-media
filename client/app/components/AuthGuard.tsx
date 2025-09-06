import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '~/contexts/AuthContext';
import { Welcome } from '~/welcome/welcome';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/welcome'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && !isPublicRoute) {
        // If user is not authenticated and trying to access protected route, show welcome
        navigate('/welcome', { replace: true });
      } else if (isAuthenticated && isPublicRoute) {
        // If user is authenticated and on public route, redirect to home
        navigate('/home', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, isPublicRoute, navigate, location.pathname]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Show welcome page for unauthenticated users on public routes
  if (!isAuthenticated && isPublicRoute) {
    return <Welcome />;
  }

  // Show welcome page for unauthenticated users trying to access protected routes
  if (!isAuthenticated && !isPublicRoute) {
    return <Welcome />;
  }

  // Show protected content for authenticated users
  return <>{children}</>;
}
