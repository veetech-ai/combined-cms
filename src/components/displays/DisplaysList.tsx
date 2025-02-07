import React from 'react';
import { Monitor, Trash2, Edit2 } from 'lucide-react';
import { Display } from '../../types/display';

interface DisplaysListProps {
  displays: Display[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: Partial<Display>) => void;
}

export default function DisplaysList({
  displays,
  onDelete,
  onUpdate
}: DisplaysListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displays.map((display) => {
        return (
          <div
            key={display.id}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-lg ${
                    display.status === 'online' ? 'bg-green-100' : 'bg-gray-100'
                  }`}
                >
                  <Monitor
                    className={`w-5 h-5 ${
                      display.status === 'online'
                        ? 'text-green-600'
                        : 'text-gray-500'
                    }`}
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{display.name}</h3>
                  <p className="text-sm text-gray-500">{display.hexCode}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onDelete(display.id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Store:</span>
                <span className="font-medium">{display.store.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span
                  className={`font-medium ${
                    display.status === 'online'
                      ? 'text-green-600'
                      : 'text-gray-600'
                  }`}
                >
                  {display.status.charAt(0).toUpperCase() +
                    display.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Last Seen:</span>
                <span className="font-medium">
                  {new Date(display.lastSeen).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
