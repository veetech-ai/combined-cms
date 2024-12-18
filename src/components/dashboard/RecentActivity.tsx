import React from 'react';

const activities = [
  {
    id: 1,
    type: 'customer',
    action: 'New customer registered',
    time: '2 hours ago',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=faces',
  },
  {
    id: 2,
    type: 'store',
    action: 'Store integration updated',
    time: '4 hours ago',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces',
  },
  {
    id: 3,
    type: 'module',
    action: 'New module activated',
    time: '6 hours ago',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces',
  },
];

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
            <img
              src={activity.image}
              alt=""
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-medium">{activity.action}</p>
              <p className="text-sm text-gray-600">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}