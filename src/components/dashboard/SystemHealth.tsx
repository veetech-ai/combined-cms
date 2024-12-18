import React from 'react';
import { CheckCircle, AlertTriangle, Clock } from 'lucide-react';

const services = [
  { name: 'API Gateway', status: 'operational', latency: '45ms', uptime: '99.99%' },
  { name: 'Database Cluster', status: 'operational', latency: '12ms', uptime: '99.95%' },
  { name: 'POS Integration', status: 'degraded', latency: '180ms', uptime: '99.80%' },
  { name: 'Menu Service', status: 'operational', latency: '65ms', uptime: '99.97%' },
];

export default function SystemHealth() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">System Health</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {services.map((service) => (
            <div key={service.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="flex items-center space-x-2">
                  {service.status === 'operational' ? (
                    <CheckCircle size={16} className="text-green-500" />
                  ) : (
                    <AlertTriangle size={16} className="text-yellow-500" />
                  )}
                  <h3 className="font-medium text-gray-900">{service.name}</h3>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Uptime: {service.uptime}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 text-sm">
                  <Clock size={14} className="text-gray-400" />
                  <span className="text-gray-600">{service.latency}</span>
                </div>
                <span className={`text-sm font-medium ${
                  service.status === 'operational' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-4">Recent Alerts</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <AlertTriangle size={16} className="text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">High Latency Warning</p>
                  <p className="text-sm text-gray-500">POS Integration experiencing delays</p>
                  <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertTriangle size={16} className="text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Database Load</p>
                  <p className="text-sm text-gray-500">High query volume detected</p>
                  <p className="text-xs text-gray-400 mt-1">4 hours ago</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-4">System Metrics</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">CPU Usage</span>
                  <span className="text-gray-900">42%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-green-500 rounded-full" style={{ width: '42%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Memory Usage</span>
                  <span className="text-gray-900">68%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '68%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Storage</span>
                  <span className="text-gray-900">23%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-green-500 rounded-full" style={{ width: '23%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}