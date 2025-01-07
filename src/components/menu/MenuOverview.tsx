import React from 'react';
import { Menu } from '../../types/menu';
import { Plus, Globe } from 'lucide-react';

interface MenuOverviewProps {
  liveMenu: Menu | undefined;
  onCreateMenu: () => void;
}

export default function MenuOverview({ liveMenu, onCreateMenu }: MenuOverviewProps) {
  if (!liveMenu) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Menu Created Yet</h3>
        <p className="text-gray-500 mb-6">Get started by creating a new menu or uploading an existing one</p>
        <button
          onClick={onCreateMenu}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Create Your First Menu</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-green-100 rounded-lg">
            <Globe className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Live Menu</h3>
            <p className="text-sm text-gray-500">Currently active menu</p>
          </div>
        </div>
        <a 
          href={`#/menus/${liveMenu.id}`}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          View Details →
        </a>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Menu Name</span>
          <span className="font-medium">{liveMenu.name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Version</span>
          <span className="font-medium">{liveMenu.version}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Last Updated</span>
          <span className="font-medium">
            {new Date(liveMenu.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}