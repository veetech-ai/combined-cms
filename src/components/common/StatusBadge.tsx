import React from 'react';

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}