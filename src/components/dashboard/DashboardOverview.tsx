import React from 'react';
import { Users, Store, Box, CreditCard, TrendingUp, AlertTriangle } from 'lucide-react';

const stats = [
  {
    label: 'Total Customers',
    value: '1,234',
    change: '+12%',
    trend: 'up',
    icon: Users,
    color: 'bg-blue-500',
  },
  {
    label: 'Active Stores',
    value: '892',
    change: '+5%',
    trend: 'up',
    icon: Store,
    color: 'bg-green-500',
  },
  {
    label: 'Module Usage',
    value: '3,456',
    change: '+18%',
    trend: 'up',
    icon: Box,
    color: 'bg-purple-500',
  },
  {
    label: 'POS Integrations',
    value: '567',
    change: '-2%',
    trend: 'down',
    icon: CreditCard,
    color: 'bg-orange-500',
  },
];

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Real-time system metrics and performance</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
            <TrendingUp size={16} />
            <span className="text-sm font-medium">System Healthy</span>
          </div>
          <div className="flex items-center space-x-2 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
            <AlertTriangle size={16} />
            <span className="text-sm font-medium">2 Alerts</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className={`text-sm font-medium ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-500 text-sm">{stat.label}</h3>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}