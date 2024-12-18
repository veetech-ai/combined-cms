import React from 'react';
import { MapPin, Phone } from 'lucide-react';
import { Store } from '../../types/store';

interface StoreInfoProps {
  store: Store;
}

export default function StoreInfo({ store }: StoreInfoProps) {
  return (
    <>
      <h3 className="font-medium text-gray-700 mb-4">Store Information</h3>
      <div className="space-y-4">
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
    </>
  );
}