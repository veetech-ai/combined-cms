import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Store,
  Monitor,
  MapPin,
  Building2,
  Copy,
  Eye,
  Trash2,
  Pen,
  ExternalLink
} from 'lucide-react';
import { OnboardClientModal } from './OnBoardClientModal';
import { toast, Toaster } from 'react-hot-toast';


interface Menu {
  id: string;
  name: string;
  location: string;
  store: string;
  organization: string;
  status: string;
  lastSeen: string;
}

const initialMenus: Menu[] = [
  {
    id: '1',
    name: "Shariq's TV",
    location: 'Pending Setup',
    store: 'FoodTruck 1',
    organization: 'Mexikhana',
    status: 'Offline',
    lastSeen: '1/21/2025, 6:52:21 AM',
  },
  {
    id: '2',
    name: "Shariq's Tablet",
    location: 'Front Desk',
    store: 'Main Room',
    organization: 'Mexikhana',
    status: 'Online',
    lastSeen: '1/19/2025, 6:45:08 AM',
  },
];

export default function DisplayMenus() {
  const [menus, setMenus] = useState(initialMenus);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [onboardModalVisible, setOnboardModalVisible] = useState(false);

  const handleNewMenu = (newMenu: Menu) => setMenus((prev) => [...prev, newMenu]);

  const handleDeleteMenu = (id: string) => {
    setMenus((prev) => prev.filter((menu) => menu.id !== id));
    toast.success('Menu deleted successfully!');
  };

  const filteredMenus = selectedFilter === 'all'
    ? menus
    : menus.filter((menu) => menu.store === selectedFilter);
    const OpenHexdisplay =() => {
      window.open('http://localhost:5173/code', '_blank');
    }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">KDS Menu</h1>
        
        <div className="flex gap-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
            onClick={OpenHexdisplay}
          >
            Generate Display Code
          </button>
          
        <button
          onClick={() => setOnboardModalVisible(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          + Onboard Digital Menu
        </button>
        </div>
      </div>

      {onboardModalVisible && (
        <OnboardClientModal
          store={{ name: 'FoodTruck 1' }}
          onClose={() => setOnboardModalVisible(false)}
          onSubmit={handleNewMenu}
        />
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
            selectedFilter === 'all'
              ? 'bg-blue-100 text-blue-600'
              : 'bg-gray-100 text-gray-700'
          } hover:bg-gray-200`}
        >
          <Store className="w-5 h-5 mr-2" />
          All Stores
        </button>
        <button
          onClick={() => setSelectedFilter('FoodTruck 1')}
          className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
            selectedFilter === 'FoodTruck 1'
              ? 'bg-blue-100 text-blue-600'
              : 'bg-gray-100 text-gray-700'
          } hover:bg-gray-200`}
        >
          <Store className="w-5 h-5 mr-2" />
          FoodTruck 1
        </button>
        <button
          onClick={() => setSelectedFilter('Main Room')}
          className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
            selectedFilter === 'Main Room'
              ? 'bg-blue-100 text-blue-600'
              : 'bg-gray-100 text-gray-700'
          } hover:bg-gray-200`}
        >
          <Store className="w-5 h-5 mr-2" />
          Main Room
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMenus.map((menu) => (
          <div
            key={menu.id}
            className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-gray-500 text-sm font-medium">Menu</p>
                  <h3 className="font-semibold text-lg text-gray-900">{menu.name}</h3>
                </div>
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-500 p-2">
              <p className="flex items-center">
                <Store className="mr-2" />
                {menu.store}
              </p>
              <p className="flex items-center mt-1">
                {menu.location}
              </p>
              <p className="flex items-center mt-1">
                {menu.organization}
              </p>
              <div className="flex justify-between items-center mt-3">
                <span className="bg-gray-200 px-2 py-1 rounded text-xs font-semibold">
                  {menu.status}
                </span>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                Last seen: {menu.lastSeen}
              </p>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                onClick={() =>  window.open(`http://localhost:5173/store/18343e6d-d3af-4827-a9e0-7e8641b77a6d`, '_blank')}
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </button>
              <button
                className="flex items-center text-sm text-red-600 hover:text-red-800"
                onClick={() => handleDeleteMenu(menu.id)}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Toaster />
    </div>
  );
}
