import React from 'react';
import { Store } from '../../types/store';
import { Trash2 } from 'lucide-react';

interface StoreFormProps {
  store: Omit<Store, 'id'>;
  index: number;
  canDelete: boolean;
  onUpdate: (index: number, field: keyof Omit<Store, 'id'>, value: any) => void;
  onDelete: (index: number) => void;
}

export default function StoreForm({
  store,
  index,
  canDelete,
  onUpdate,
  onDelete
}: StoreFormProps) {
  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Store #{index + 1}</h4>
        {canDelete && (
          <button
            type="button"
            onClick={() => onDelete(index)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Store Name
          </label>
          <input
            type="text"
            required
            value={store.name}
            onChange={(e) => onUpdate(index, 'name', e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            required
            value={store.phone}
            onChange={(e) => onUpdate(index, 'phone', e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            required
            value={store.address}
            onChange={(e) => onUpdate(index, 'address', e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            required
            value={store.city}
            onChange={(e) => onUpdate(index, 'city', e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <input
            type="text"
            required
            value={store.state}
            onChange={(e) => onUpdate(index, 'state', e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ZIP Code
          </label>
          <input
            type="text"
            required
            value={store.zipCode}
            onChange={(e) => onUpdate(index, 'zipCode', e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}