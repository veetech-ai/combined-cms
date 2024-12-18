import React, { useState } from 'react';
import { Plus, Monitor, AlertCircle } from 'lucide-react';
import { Device } from '../../types/device';
import AddDeviceModal from './AddDeviceModal';

interface ModuleDevicesProps {
  moduleId: string;
}

export default function ModuleDevices({ moduleId }: ModuleDevicesProps) {
  const [isAddingDevice, setIsAddingDevice] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);

  const handleAddDevice = (device: Omit<Device, 'id'>) => {
    const newDevice: Device = {
      ...device,
      id: `device-${Date.now()}`,
      moduleId,
      lastSeen: new Date().toISOString(),
    };
    setDevices([...devices, newDevice]);
    setIsAddingDevice(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Connected Devices</h2>
        <button
          onClick={() => setIsAddingDevice(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          <span>Add Device</span>
        </button>
      </div>

      {devices.length === 0 ? (
        <div className="text-center py-12">
          <Monitor size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Devices Connected</h3>
          <p className="text-gray-500">
            Click the "Add Device" button to connect your first device.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {devices.map((device) => (
            <div
              key={device.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${
                  device.status === 'online' ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <Monitor className={`w-6 h-6 ${
                    device.status === 'online' ? 'text-green-600' : 'text-gray-500'
                  }`} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{device.name}</h3>
                  <p className="text-sm text-gray-500">{device.settings.location}</p>
                </div>
              </div>

              {device.status !== 'online' && (
                <div className="flex items-center text-sm text-yellow-600">
                  <AlertCircle size={16} className="mr-1" />
                  Offline
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <AddDeviceModal
        isOpen={isAddingDevice}
        onClose={() => setIsAddingDevice(false)}
        onAdd={handleAddDevice}
      />
    </div>
  );
}