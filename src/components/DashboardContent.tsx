import React from 'react';
import DashboardStats from './dashboard/DashboardStats';
import QuickActions from './dashboard/QuickActions';
import RecentActivity from './dashboard/RecentActivity';
import SystemStatus from './dashboard/SystemStatus';

export default function DashboardContent() {
  return (
    <main className="p-6 bg-gray-50">
      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <QuickActions />
          <SystemStatus />
        </div>
        <RecentActivity />
      </div>
    </main>
  );
}