import React from 'react';
import { Menu, MenuItem } from '../../types/menu';
import { Edit, Trash2, Eye, Grid, List, Globe } from 'lucide-react';
import { useState } from 'react';

interface MenuListProps {
  menu: Menu;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}

type ViewMode = 'grid' | 'list';

export default function MenuList({ menu, onEdit, onDelete, onView }: MenuListProps) {
  const activeItems = menu.items.filter(item => item.isAvailable).length;
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isLive, setIsLive] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-gray-900">Menu Overview</h3>
          <p className="text-sm text-gray-500 mt-1">
            Last updated {new Date(menu.updatedAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${
                viewMode === 'grid'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${
                viewMode === 'list'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List size={18} />
            </button>
          </div>
          
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors ${
              isLive
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Globe size={18} />
            <span className="text-sm font-medium">
              {isLive ? 'Live' : 'Go Live'}
            </span>
          </button>

          <button
            onClick={onView}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700">Total Items</h4>
          <p className="text-2xl font-bold mt-1">{menu.items.length}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700">Active Items</h4>
          <p className="text-2xl font-bold mt-1">{activeItems}</p>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menu.categories.map(category => {
            const categoryItems = menu.items.filter(
              item => item.categoryId === category.id
            );
            
            return (
              <div key={category.id} className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-4">{category.name}</h4>
                <div className="space-y-3">
                  {categoryItems.map(item => (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg p-4 shadow-sm"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                      )}
                      <div className="flex items-start justify-between">
                        <div>
                          <h5 className="font-medium">{item.name}</h5>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-medium">
                            ${item.price.toFixed(2)}
                          </span>
                          <div className="mt-1">
                            <span
                              className={`inline-block w-2 h-2 rounded-full ${
                                item.isAvailable
                                  ? 'bg-green-500'
                                  : 'bg-red-500'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
        {menu.categories.map(category => {
          const categoryItems = menu.items.filter(item => item.categoryId === category.id);
          
          return (
            <div key={category.id} className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-2">{category.name}</h4>
              <div className="space-y-2">
                {categoryItems.map(item => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${
                        item.isAvailable ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
}