import React, { useState } from 'react';
import { Menu } from '../../types/menu';
import MenuGrid from './MenuGrid';
import { Search, ArrowLeft } from 'lucide-react';

interface MenusPageProps {
  storeId?: string;
}

export default function MenusPage({ storeId }: MenusPageProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleBack = () => {
    if (storeId) {
      window.location.hash = '#/stores';
    }
  };
  const [menus, setMenus] = useState<Menu[]>([
    {
      id: 'menu-1',
      name: 'Lunch & Dinner Menu',
      version: 1,
      isLive: true,
      storeId: 'store-1',
      categories: [],
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'menu-2',
      name: 'Breakfast Menu',
      version: 1,
      isLive: false,
      storeId: 'store-1',
      categories: [],
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'menu-3',
      name: 'Happy Hour Menu',
      version: 1,
      isLive: false,
      storeId: 'store-1',
      categories: [],
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);

  const filteredMenus = menus.filter(menu => 
    menu.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleLive = (menu: Menu) => {
    if (menu.isLive) return;
    setMenus(menus.map(m => ({
      ...m,
      isLive: m.id === menu.id
    })));
  };

  return (
    <main className="p-6">
      <div className="flex items-center space-x-4 mb-6">
        {storeId && (
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">All Menus</h1>
          <p className="text-gray-600 mt-1">Manage and organize your digital menus</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search menus..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <MenuGrid
        menus={filteredMenus}
        onView={(menu) => window.location.hash = `#/menus/${menu.id}`}
        onEdit={(menu) => window.location.hash = `#/menus/${menu.id}/edit`}
        onDelete={(menu) => setMenus(menus.filter(m => m.id !== menu.id))}
        onToggleLive={handleToggleLive}
      />
    </main>
  );
}