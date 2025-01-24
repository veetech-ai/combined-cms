import React from 'react';
import { Store } from '../../types/store';

interface StoreFilterProps {
  stores: Store[];
  selectedStoreId: string;
  onStoreSelect: (storeId: string) => void;
}

export default function StoreFilter({ stores, selectedStoreId, onStoreSelect }: StoreFilterProps) {
  return (
    <div className="flex items-center space-x-4">
      <label htmlFor="store-filter" className="text-sm font-medium text-gray-700">
        Filter by Store:
      </label>
      <select
        id="store-filter"
        value={selectedStoreId}
        onChange={(e) => onStoreSelect(e.target.value)}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
      >
        <option value="">All Stores</option>
        {stores.map((store) => (
          <option key={store.id} value={store.id}>
            {store.name}
          </option>
        ))}
      </select>
    </div>
  );
} 