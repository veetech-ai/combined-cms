import React from 'react';
import { Bell, LogOut } from 'lucide-react';

export default function Header() {
  const handleLogout = () => {
    // Clear user session and redirect to login
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <header className="bg-white shadow-sm fixed top-0 right-0 h-16 flex items-center justify-between px-6 ml-64 w-[calc(100%-16rem)]">
      <h1 className="text-2xl font-bold text-gray-800">
        Super Admin Dashboard
      </h1>

      <div className="flex items-center space-x-4">
        <button className="p-2 hover:bg-gray-100 rounded-full relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
