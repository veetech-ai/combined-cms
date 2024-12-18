import React from 'react';
import { Store } from '../../types/store';
import { MapPin, Phone, ChevronRight } from 'lucide-react';
import ModulesList from '../customers/ModulesList';

interface StoresListProps {
  stores: (Store & { customerName: string })[];
  onStoreClick: (store: Store & { customerName: string }) => void;
}

export default function StoresList({ stores, onStoreClick }: StoresListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stores.map((store) => (
        <div
          key={store.id}
          onClick={() => onStoreClick(store)}
          className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{store.name}</h3>
              <p className="text-sm text-gray-500">Customer: {store.customerName}</p>
            </div>
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
            <div className="text-sm text-gray-500">
              {store.modules.filter(m => m.isEnabled).length} of {store.modules.length} enabled
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}