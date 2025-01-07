import React from 'react';
import { Menu } from '../../types/menu';
import { Eye, Edit, Trash2, Globe } from 'lucide-react';

interface MenuGridProps {
  menus: Menu[];
  onView: (menu: Menu) => void;
  onEdit: (menu: Menu) => void;
  onDelete: (menu: Menu) => void;
  onToggleLive: (menu: Menu) => void;
}

export default function MenuGrid({ menus, onView, onEdit, onDelete, onToggleLive }: MenuGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {menus.map((menu) => (
        <div key={menu.id} className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">{menu.name}</h3>
              <p className="text-sm text-gray-500">Version {menu.version}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onView(menu)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Eye size={18} />
              </button>
              <button
                onClick={() => onEdit(menu)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit size={18} />
              </button>
              {!menu.isLive && (
                <button
                  onClick={() => onDelete(menu)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Items</span>
              <span className="font-medium">{menu.items.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Categories</span>
              <span className="font-medium">{menu.categories.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Last Updated</span>
              <span className="font-medium">
                {new Date(menu.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => onToggleLive(menu)}
              className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                menu.isLive
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Globe size={18} />
              <span>{menu.isLive ? 'Live Menu' : 'Make Live'}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}