import React from 'react';
import { Store } from '../../types/store';
import { Store as StoreIcon, Phone, MapPin } from 'lucide-react';

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
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <StoreIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{store.name}</h3>
                <p className="text-sm text-gray-500">{store.customerName}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-start space-x-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <p>{store.address}</p>
                <p>{store.city}, {store.state} {store.zipCode}</p>
              </div>
            </div>
            
            {store.phone && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{store.phone}</span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">
                {store.modules.filter(m => m.enabled).length} Active Modules
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}