import React from 'react';
import { MapPin, Phone } from 'lucide-react';
import { Store } from '../../types/store';

interface StoreInfoProps {
  store: Store;
}

export default function StoreInfo({ store }: StoreInfoProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex items-start space-x-3">
        <div className="p-1.5 bg-blue-50 rounded-lg">
          <MapPin className="w-4 h-4 text-blue-600" />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-medium text-gray-900">Address</h4>
          <p className="text-sm text-gray-600 truncate">{store.address}</p>
          <p className="text-sm text-gray-600">{store.city}, {store.state} {store.zipCode}</p>
        </div>
      </div>

      <div className="flex items-start space-x-3">
        <div className="p-1.5 bg-blue-50 rounded-lg">
          <Phone className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-900">Contact</h4>
          <p className="text-sm text-gray-600">{store.phone}</p>
        </div>
      </div>
    </div>
  );
}