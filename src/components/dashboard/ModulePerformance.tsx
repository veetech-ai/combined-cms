import React from 'react';
import { ArrowRight } from 'lucide-react';

const modules = [
  { name: 'Venu', usage: 78, trend: '+12%', status: 'Healthy' },
  { name: 'Kiosk', usage: 92, trend: '+8%', status: 'Healthy' },
  { name: 'Kitchen Display', usage: 64, trend: '-3%', status: 'Warning' },
  { name: 'Rewards', usage: 85, trend: '+15%', status: 'Healthy' },
];

export default function ModulePerformance() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Module Performance</h2>
        <button className="flex items-center text-blue-600 hover:text-blue-700">
          <span className="text-sm">View All</span>
          <ArrowRight size={16} className="ml-1" />
        </button>
      </div>

      <div className="space-y-4">
        {modules.map((module) => (
          <div key={module.name} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">{module.name}</h3>
              <p className="text-sm text-gray-500">
                {module.usage}% utilization
              </p>
            </div>
            <div className="text-right">
              <span className={`text-sm font-medium ${
                module.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {module.trend}
              </span>
              <p className={`text-sm mt-1 ${
                module.status === 'Healthy' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {module.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}