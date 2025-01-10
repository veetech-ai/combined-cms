import React from 'react';
import { Building2, Users, Calendar } from 'lucide-react';
import { Organization } from '../../types';

interface CustomerCardProps {
  customer: Organization;
  onClick: () => void;
}

export default function CustomerCard({ customer, onClick }: CustomerCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
          <p className="text-sm text-gray-500">{customer.company}</p>
        </div>
        {customer.logo && (
          <img
            src={customer.logo}
            alt={`${customer.name} logo`}
            className="w-12 h-12 rounded-full object-cover"
          />
        )}
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <Building2 size={16} className="mr-2" />
          <span>{customer.stores?.length || 0} Stores</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Users size={16} className="mr-2" />
          <span>{customer.users?.length || 0} Users</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Calendar size={16} className="mr-2" />
          <span>
            {new Date(customer.subscriptionRenewal || '').toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className={`px-2 py-1 text-xs rounded-full ${
          customer.subscriptionStatus === 'ACTIVE'
            ? 'bg-green-100 text-green-800'
            : customer.subscriptionStatus === 'PENDING'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {customer.subscriptionPlan} - {customer.subscriptionStatus}
        </span>
      </div>
    </div>
  );
}