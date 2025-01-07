import React, { useState } from 'react';
import { Plus, Upload, QrCode, ArrowRight } from 'lucide-react';
import { Menu } from '../../types/menu';
import CreateMenuModal from './CreateMenuModal';
import UploadMenuModal from './UploadMenuModal';
import CreatorAppQrModal from './CreatorAppQrModal';
import MenuOverview from './MenuOverview';

export default function StoreMenuSection() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [menus] = useState<Menu[]>([
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
  const liveMenu = menus.find(m => m.isLive);
  const recentMenus = menus.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Menu Management</h3>
          <p className="text-sm text-gray-500">Create and manage your digital menus</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => window.location.href = '/menus'}
            className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <span>View All Menus</span>
            <ArrowRight size={18} />
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            <span>Create Menu</span>
          </button>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Upload size={18} />
            <span>Upload Menu</span>
          </button>
          <button
            onClick={() => setIsQrModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <QrCode size={18} />
            <span>Creator App</span>
          </button>
        </div>
      </div>

      <MenuOverview 
        liveMenu={liveMenu}
        recentMenus={recentMenus}
        onCreateMenu={() => setIsCreateModalOpen(true)}
      />

      {isCreateModalOpen && (
        <CreateMenuModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={() => {
            setIsCreateModalOpen(false);
            window.location.href = '/menus';
          }}
        />
      )}

      {isUploadModalOpen && (
        <UploadMenuModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUploadComplete={() => {
            setIsUploadModalOpen(false);
            window.location.href = '/menus';
          }}
        />
      )}

      {isQrModalOpen && (
        <CreatorAppQrModal
          isOpen={isQrModalOpen}
          onClose={() => setIsQrModalOpen(false)}
          storeId="store-1"
        />
      )}
    </div>
  );
}