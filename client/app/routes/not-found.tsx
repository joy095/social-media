import { Link, useLocation } from 'react-router';
import { Home, ArrowLeft, Search } from 'lucide-react';

export function meta() {
  return [
    { title: "Page Not Found - SocialApp" },
    { name: "description", content: "The page you're looking for doesn't exist" },
  ];
}

export default function NotFound() {
  const location = useLocation();
  
  // Handle Chrome DevTools requests silently
  if (location.pathname.includes('.well-known') || location.pathname.includes('devtools')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-6xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
            404
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Page Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The page you're looking for doesn't exist or may have been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/home"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Home className="mr-2" size={20} />
            Go to Home
          </Link>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <ArrowLeft className="mr-2" size={16} />
              Go Back
            </button>
            
            <Link
              to="/search"
              className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <Search className="mr-2" size={16} />
              Search
            </Link>
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>If you believe this is an error, please contact support.</p>
        </div>
      </div>
    </div>
  );
}
