import React from 'react';

const statusItems = [
  { label: 'Server Uptime', status: 'Operational', uptime: '99.9%' },
  { label: 'API Response', status: 'Operational', latency: '45ms' },
  { label: 'Database Status', status: 'Operational', load: 'Normal' },
];

export default function SystemStatus() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">System Status</h2>
      <div className="space-y-4">
        {statusItems.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div>
              <span className="font-medium">{item.label}</span>
              <span className="text-sm text-gray-500 ml-2">
                {item.uptime || item.latency || item.load}
              </span>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}