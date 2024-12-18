import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Customer } from '../../types/customer';

interface CustomerSelectProps {
  customers: Customer[];
  value: string;
  onChange: (customerId: string) => void;
}

export default function CustomerSelect({
  customers,
  value,
  onChange,
}: CustomerSelectProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full bg-white border border-gray-200 px-4 py-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {customers.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.name} - {customer.company}
          </option>
        ))}
      </select>
      <ChevronDown
        size={20}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  );
}