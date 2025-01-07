import React from 'react';
import { Users, Store, CreditCard, TrendingUp, ChevronRight } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { useCustomer } from '../contexts/CustomerContext';

export default function DashboardContent() {
  const { state: { customers } } = useCustomer();

  // Calculate total stats
  const totalStats = customers.reduce((acc, customer) => {
    // Count active stores
    acc.activeStores += customer.stores.length;

    // Count enabled modules across all stores
    customer.stores.forEach(store => {
      store.modules.forEach(module => {
        if (module.isEnabled) {
          acc.activeModules++;
          if (module.stats) {
            acc.totalUsers += module.stats.activeUsers;
            acc.totalDevices += module.stats.activeDevices;
          }
        }
      });
    });

    // Count synced POS integrations
    if (customer.posIntegration.status === 'synced') {
      acc.syncedPos++;
    }

    return acc;
  }, {
    activeStores: 0,
    activeModules: 0,
    totalUsers: 0,
    totalDevices: 0,
    syncedPos: 0
  });

  // Module usage data
  const moduleData = {
    labels: ['Venu', 'Kiosk', 'Kitchen', 'Rewards'],
    datasets: [
      {
        label: 'Active Users',
        data: [45, 32, 24, 89],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      },
      {
        label: 'Active Devices',
        data: [12, 8, 6, 1],
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <main className="p-6 max-w-7xl mx-auto">
      {/* System Status */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Real-time system metrics and performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
            <TrendingUp size={16} />
            <span className="text-sm font-medium">All Systems Operational</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Store className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-gray-500 text-sm">Active Stores</h3>
          <div className="flex items-end justify-between mt-1">
            <p className="text-2xl font-bold">{totalStats.activeStores}</p>
            <span className="text-green-600 text-sm">+12%</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-gray-500 text-sm">Total Users</h3>
          <div className="flex items-end justify-between mt-1">
            <p className="text-2xl font-bold">{totalStats.totalUsers}</p>
            <span className="text-green-600 text-sm">+8%</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-gray-500 text-sm">POS Integrations</h3>
          <div className="flex items-end justify-between mt-1">
            <p className="text-2xl font-bold">{totalStats.syncedPos}</p>
            <span className="text-green-600 text-sm">+5%</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <h3 className="text-gray-500 text-sm">Active Devices</h3>
          <div className="flex items-end justify-between mt-1">
            <p className="text-2xl font-bold">{totalStats.totalDevices}</p>
            <span className="text-green-600 text-sm">+15%</span>
          </div>
        </div>
      </div>

      {/* Module Usage Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">Module Usage Overview</h2>
              <p className="text-sm text-gray-500 mt-1">Active users and devices across modules</p>
            </div>
            <button className="flex items-center text-sm text-blue-600 hover:text-blue-700">
              <span>View Details</span>
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
          <div className="h-[400px]">
            <Bar data={moduleData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">System Health</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">API Gateway</p>
                <p className="text-sm text-gray-500">Response Time: 45ms</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                Healthy
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Database</p>
                <p className="text-sm text-gray-500">Query Time: 12ms</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                Healthy
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">POS Integration</p>
                <p className="text-sm text-gray-500">Last Sync: 5m ago</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                Healthy
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}