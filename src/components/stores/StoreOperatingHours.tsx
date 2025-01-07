import React from 'react';
import { Clock } from 'lucide-react';
import { OperatingHours } from '../../types/store';

interface StoreOperatingHoursProps {
  operatingHours: OperatingHours;
}

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function StoreOperatingHours({ operatingHours }: StoreOperatingHoursProps) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
      {daysOfWeek.map((day) => {
        const hours = operatingHours[day];
        const isOpen = !!hours;
        
        return (
          <div key={day} className="flex items-center justify-between text-sm py-1">
            <span className="font-medium capitalize text-gray-700">{day}</span>
            {isOpen ? (
              <div className="flex items-center space-x-1 text-gray-600">
                <Clock size={12} className="text-gray-400" />
                <span>{hours.open} - {hours.close}</span>
              </div>
            ) : (
              <span className="text-gray-500">Closed</span>
            )}
          </div>
        );
      })}
    </div>
  );
}