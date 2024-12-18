import React from 'react';
import { Bar } from 'react-chartjs-2';
import { ArrowRight } from 'lucide-react';

export default function CustomerMetrics() {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New Customers',
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
      {
        label: 'Active Stores',
        data: [28, 48, 40, 19, 86, 27],
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Customer Growth</h2>
        <button className="flex items-center text-blue-600 hover:text-blue-700">
          <span className="text-sm">View Details</span>
          <ArrowRight size={16} className="ml-1" />
        </button>
      </div>
      <div className="h-[300px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}