import React from 'react';
import DashboardOverview from './DashboardOverview';
import CustomerMetrics from './CustomerMetrics';
import ModulePerformance from './ModulePerformance';
import SystemHealth from './SystemHealth';

export default function DashboardContent() {
  return (
    <main className="p-6 space-y-6">
      <DashboardOverview />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomerMetrics />
        <ModulePerformance />
      </div>

      <SystemHealth />
    </main>
  );
}