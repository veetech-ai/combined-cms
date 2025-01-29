import React, { useState, useEffect } from 'react';
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
  ExternalLink,
  Plus
} from 'lucide-react';
import { OnboardClientModal } from './OnBoardClientModal';
import { toast, Toaster } from 'react-hot-toast';
import { displayService, Display } from '../../services/displayService';

// Add environment variable
const VITE_HOST_URL = import.meta.env.VITE_HOST_URL || 'http://localhost:5173';

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

export const DisplayMenus = () => {
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [displays, setDisplays] = useState<Display[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDisplays();
  }, []);

  const loadDisplays = async () => {
    try {
      setIsLoading(true);
      const data = await displayService.getDisplays();
      setDisplays(data);
    } catch (error: any) {
      toast.error('Failed to load displays');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisplaySubmit = async (newDisplay: Display) => {
    try {
      await displayService.addDisplay(newDisplay);
      setDisplays(prevDisplays => [...prevDisplays, newDisplay]); // Update local state immediately
      toast.success('Display added successfully');
      setIsOnboardingOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add display');
      throw error; // Propagate error to modal
    }
  };
  const OpenHexdisplay =() => {
    window.open(`${VITE_HOST_URL}/code`, '_blank');
  };

  const openDisplayView = (hexCode: string) => {
    window.open(`${VITE_HOST_URL}/store/${hexCode}`, '_blank');
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Display Management</h1>
          <p className="text-gray-600">Manage your digital menu displays</p>
        </div>
        <div className="flex gap-4">
        <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
            onClick={OpenHexdisplay}
          >
            Generate Display Code
          </button>
        <button
          onClick={() => setIsOnboardingOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Onboard Display</span>
        </button>
        </div>
      </div>

      {displays.length === 0 ? (
        <div className="text-center py-12">
          <Monitor size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">No Displays Found</h2>
          <p className="text-gray-500 mb-4">
            Get started by onboarding your first display
          </p>
          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>Onboard Display</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displays.map((display) => (
            <div
              key={display.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    display.status === 'Online' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <Monitor className={`w-6 h-6 ${
                      display.status === 'Online' ? 'text-green-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{display.name}</h3>
                    <p className="text-sm text-gray-500">{display.location}</p>
                  </div>
                </div>
                <div className={`text-sm ${
                  display.status === 'Online' ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {display.status}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Store className="w-4 h-4" />
                  <span>{display.store}</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Last seen: {display.lastSeen}
                </p>
                <p className="text-xs text-gray-400">
                  Hex Code: {display.hexCode}
                </p>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => openDisplayView(display.hexCode)}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View Display</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isOnboardingOpen && (
        <OnboardClientModal
          store={null}
          onClose={() => setIsOnboardingOpen(false)}
          onSubmit={handleDisplaySubmit}
        />
      )}
    </div>
  );
};

export default DisplayMenus;
