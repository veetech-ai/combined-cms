import React from 'react';
import { Users, Store, CreditCard, AlertTriangle, TrendingUp } from 'lucide-react';
import { Bar } from 'react-chartjs-2';

// High-level overview stats
const overviewStats = [
  {
    label: 'Total Customers',
    value: '1,234',
    change: '+12%',
    icon: Users,
    color: 'bg-blue-600'
  },
  {
    label: 'Active Stores',
    value: '892',
    change: '+5%',
    icon: Store,
    color: 'bg-green-600'
  },
  {
    label: 'POS Integrations',
    value: '567',
    change: '+8%',
    icon: CreditCard,
    color: 'bg-purple-600'
  }
];

// Module usage data
const moduleData = {
  labels: ['Venu', 'Kiosk', 'Kitchen Display', 'Rewards'],
  datasets: [
    {
      label: 'Active Users',
      data: [867, 884, 195, 255],
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 1
    },
    {
      label: 'Total Devices',
      data: [1200, 950, 300, 400],
      backgroundColor: 'rgba(16, 185, 129, 0.5)',
      borderColor: 'rgb(16, 185, 129)',
      borderWidth: 1
    }
  ]
};

const chartOptions = {
  responsive: true,
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

export default function DashboardContent() {
  return (
    <main className="p-6 space-y-6">
      {/* System Status Banner */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-green-600">
              <TrendingUp size={20} />
              <span className="font-medium">System Status: Operational</span>
            </div>
            <div className="h-4 w-px bg-gray-200" />
            <div className="flex items-center space-x-2 text-yellow-600">
              <AlertTriangle size={20} />
              <span className="font-medium">2 Active Alerts</span>
            </div>
          </div>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View System Status →
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {overviewStats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-600 text-sm font-medium">{stat.change}</span>
            </div>
            <h3 className="text-2xl font-bold mt-4">{stat.value}</h3>
            <p className="text-gray-600 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Module Usage Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Module Usage Overview</h2>
            <p className="text-gray-600 text-sm mt-1">Active users and devices across modules</p>
          </div>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View Detailed Analytics →
          </button>
        </div>
        <div className="h-[400px]">
          <Bar data={moduleData} options={chartOptions} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <p className="text-gray-600 text-sm mt-1">Latest system events and updates</p>
          </div>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All Activity →
          </button>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">New Customer Registration</p>
                <p className="text-gray-600 text-sm">Restaurant Chain Inc. added as a new customer</p>
                <p className="text-gray-400 text-sm mt-1">2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}