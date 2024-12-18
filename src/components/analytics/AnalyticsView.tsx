import React from 'react';
import { Box, ShoppingCart, AlertCircle } from 'lucide-react';
import KpiCard from './KpiCard';
import ModuleUsageChart from './ModuleUsageChart';
import type { ModuleUsageData } from '../../types/analytics';

const mockModuleData: ModuleUsageData[] = [
  { module: 'Venue', users: 1200, orders: 5400, errors: 23 },
  { module: 'Kiosk', users: 800, orders: 3200, errors: 15 },
  { module: 'Kitchen', users: 450, orders: 4100, errors: 8 },
  { module: 'Rewards', users: 2300, orders: 6800, errors: 31 },
];

const chartData = {
  labels: mockModuleData.map(d => d.module),
  datasets: [
    {
      label: 'Active Users',
      data: mockModuleData.map(d => d.users),
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 1,
    },
    {
      label: 'Orders Processed',
      data: mockModuleData.map(d => d.orders),
      backgroundColor: 'rgba(16, 185, 129, 0.5)',
      borderColor: 'rgb(16, 185, 129)',
      borderWidth: 1,
    },
  ],
};

export default function AnalyticsView() {
  const totalModules = mockModuleData.length;
  const totalOrders = mockModuleData.reduce((sum, d) => sum + d.orders, 0);
  const totalErrors = mockModuleData.reduce((sum, d) => sum + d.errors, 0);

  return (
    <main className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Monitor your system's performance and usage statistics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <KpiCard
          title="Active Modules"
          value={totalModules}
          change={{ value: 12, type: 'increase' }}
          icon={Box}
          color="bg-blue-600"
        />
        <KpiCard
          title="Orders Processed"
          value={totalOrders.toLocaleString()}
          change={{ value: 8, type: 'increase' }}
          icon={ShoppingCart}
          color="bg-green-600"
        />
        <KpiCard
          title="POS Errors"
          value={totalErrors}
          change={{ value: 5, type: 'decrease' }}
          icon={AlertCircle}
          color="bg-red-600"
        />
      </div>

      <ModuleUsageChart data={chartData} />
    </main>
  );
}