import React from 'react';
import { Users, Box, CreditCard, UserCircle } from 'lucide-react';
import StatsCard from './StatsCard';

const stats = [
  { label: 'Active Customers', value: '8,392', icon: UserCircle, color: 'bg-blue-500' },
  { label: 'Modules Enabled', value: '147', icon: Box, color: 'bg-green-500' },
  { label: 'POS Integrations', value: '1,234', icon: CreditCard, color: 'bg-purple-500' },
  { label: 'Total Users', value: '12,345', icon: Users, color: 'bg-yellow-500' },
];

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat) => (
        <StatsCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}