import React from 'react';
import { MapPin, Phone, ChevronRight } from 'lucide-react';
import { Store } from '../../types/store';
import ModulesList from './ModulesList';

interface StoreCardProps {
  store: Store;
  onClick: () => void;
  onModuleToggle: (moduleId: string, enabled: boolean) => void;
}

export default function StoreCard({ store, onClick, onModuleToggle }: StoreCardProps) {
  return (
    <div 
      className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-semibold text-lg text-gray-900">{store.name}</h3>
        <ChevronRight size={20} className="text-gray-400" />
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-start space-x-2">
          <MapPin size={18} className="text-gray-400 mt-0.5" />
          <div className="text-sm">
            <p>{store.address}</p>
            <p>{store.city}, {store.state} {store.zipCode}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Phone size={18} className="text-gray-400" />
          <span className="text-sm">{store.phone}</span>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-sm text-gray-700 mb-2">Active Modules</h4>
        <div 
          className="text-sm text-gray-500" 
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <ModulesList
            modules={store.modules}
            onToggle={onModuleToggle}
          />
        </div>
      </div>
    </div>
  );
}