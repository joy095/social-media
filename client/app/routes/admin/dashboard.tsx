import React from 'react';
import { BarChart3 } from 'lucide-react';

export function meta() {
  return [
    { title: "Admin Dashboard - Social App" },
    { name: "description", content: "Admin dashboard" },
  ];
}

export default function AdminDashboard() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <BarChart3 className="mr-2" size={24} />
          Admin Dashboard
        </h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <p className="text-gray-600 dark:text-gray-400">
          Admin dashboard - Coming soon!
        </p>
      </div>
    </div>
  );
}
