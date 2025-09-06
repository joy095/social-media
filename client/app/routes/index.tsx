import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '~/contexts/AuthContext';
import { Welcome } from '~/welcome/welcome';

export function meta() {
  return [
    { title: "SocialApp - Connect with Friends" },
    { name: "description", content: "Welcome to SocialApp - Connect with friends and share your moments" },
  ];
}

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // Redirect authenticated users to home
        navigate('/home', { replace: true });
      }
      // If not authenticated, show welcome page (no redirect needed)
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Show welcome page for unauthenticated users
  if (!isAuthenticated) {
    return <Welcome />;
  }

  // This should not render for authenticated users (they get redirected)
  return null;
}
