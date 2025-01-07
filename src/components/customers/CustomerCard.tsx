import React from 'react';
import { Store, UserCircle, CreditCard } from 'lucide-react';
import { Customer } from '../../types/customer';
import StatusBadge from '../common/StatusBadge';

interface CustomerCardProps {
  customer: Customer;
  onClick: () => void;
}

export default function CustomerCard({ customer, onClick }: CustomerCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={customer.avatar}
            alt=""
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{customer.name}</h3>
            <p className="text-sm text-gray-500">{customer.company}</p>
          </div>
        </div>
        <StatusBadge status={customer.subscription.status === 'active' ? 'active' : 'inactive'} />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-sm">
          <div className="flex items-center space-x-1 text-gray-500 mb-1">
            <Store size={16} />
            <span>Stores</span>
          </div>
          <p className="font-medium">{customer.stores.length}</p>
        </div>

        <div className="text-sm">
          <div className="flex items-center space-x-1 text-gray-500 mb-1">
            <UserCircle size={16} />
            <span>Plan</span>
          </div>
          <p className="font-medium capitalize">{customer.subscription.plan}</p>
        </div>

        <div className="text-sm">
          <div className="flex items-center space-x-1 text-gray-500 mb-1">
            <CreditCard size={16} />
            <span>POS</span>
          </div>
          <p className="font-medium">{customer.posIntegration.type}</p>
        </div>
      </div>

      <div className="text-sm text-gray-500">
        <div className="flex items-center justify-between">
          <p>Click to view stores and details</p>
          <StatusBadge 
            status={customer.posIntegration.status === 'synced' ? 'active' : 'pending'} 
          />
        </div>
      </div>
    </div>
  );
}