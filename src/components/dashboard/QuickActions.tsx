import React from 'react';
import { UserPlus, Store, Box, CreditCard } from 'lucide-react';

const actions = [
  { label: 'Add Customer', icon: UserPlus, color: 'bg-blue-500' },
  { label: 'New Store', icon: Store, color: 'bg-green-500' },
  { label: 'Add Module', icon: Box, color: 'bg-purple-500' },
  { label: 'New Integration', icon: CreditCard, color: 'bg-yellow-500' },
];

export default function QuickActions() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-4">
        {actions.map(({ label, icon: Icon, color }) => (
          <button
            key={label}
            className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className={`${color} p-2 rounded-lg`}>
              <Icon size={18} className="text-white" />
            </div>
            <span className="font-medium text-sm">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}