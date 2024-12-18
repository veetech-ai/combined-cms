import React from 'react';
import { Clock } from 'lucide-react';
import { OperatingHours } from '../../types/store';

interface StoreOperatingHoursProps {
  operatingHours: OperatingHours;
}

export default function StoreOperatingHours({ operatingHours }: StoreOperatingHoursProps) {
  return (
    <>
      <h3 className="font-medium text-gray-700 mb-4">Operating Hours</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(operatingHours).map(([day, hours]) => (
          <div key={day} className="space-y-1">
            <p className="text-sm font-medium text-gray-700 capitalize">{day}</p>
            {hours ? (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock size={14} className="text-gray-400" />
                <span>{hours.open} - {hours.close}</span>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Closed</p>
            )}
          </div>
        ))}
      </div>
    </>
  );
}