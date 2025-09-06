import React from 'react';
import { Bell } from 'lucide-react';

export function meta() {
  return [
    { title: "Notifications - Social App" },
    { name: "description", content: "User notifications" },
  ];
}

export default function Notifications() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Bell className="mr-2" size={24} />
          Notifications
        </h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <p className="text-gray-600 dark:text-gray-400">
          Notifications page - Coming soon!
        </p>
      </div>
    </div>
  );
}
