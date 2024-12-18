import React from 'react';
import { Monitor } from 'lucide-react';
import { Device } from '../../types/device';

interface ModuleDevicesListProps {
  moduleId: string;
  devices?: Device[];
}

export default function ModuleDevicesList({ moduleId, devices = [] }: ModuleDevicesListProps) {
  if (devices.length === 0) {
    return (
      <div className="text-center py-8">
        <Monitor size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500 mb-2">No devices connected</p>
        <p className="text-sm text-gray-400">Add a device to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {devices.map((device) => (
        <div
          key={device.id}
          className="border rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer"
        >
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-lg ${
              device.status === 'online' ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <Monitor className={`w-5 h-5 ${
                device.status === 'online' ? 'text-green-600' : 'text-gray-500'
              }`} />
            </div>
            <div>
              <h4 className="font-medium">{device.name}</h4>
              <p className="text-sm text-gray-500">{device.settings.location}</p>
              <p className="text-xs text-gray-400 mt-1">
                Last seen: {new Date(device.lastSeen).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}