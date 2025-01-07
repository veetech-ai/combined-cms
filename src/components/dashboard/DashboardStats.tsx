import React from 'react';
import { Users, Box, CreditCard, UserCircle } from 'lucide-react';
import { mockCustomers } from '../../data/mockData';
import { calculateDashboardStats } from '../../utils/stats';
import StatsCard from './StatsCard';

export default function DashboardStats() {
  const stats = calculateDashboardStats(mockCustomers);

  const statsCards = [
    { 
      label: 'Active Customers', 
      value: stats.activeCustomers.toLocaleString(), 
      icon: UserCircle, 
      color: 'bg-blue-500' 
    },
    { 
      label: 'Modules Enabled', 
      value: stats.modulesEnabled.toLocaleString(), 
      icon: Box, 
      color: 'bg-green-500' 
    },
    { 
      label: 'POS Integrations', 
      value: stats.posIntegrations.toLocaleString(), 
      icon: CreditCard, 
      color: 'bg-purple-500' 
    },
    { 
      label: 'Total Users', 
      value: stats.totalUsers.toLocaleString(), 
      icon: Users, 
      color: 'bg-yellow-500' 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {statsCards.map((stat) => (
        <StatsCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}