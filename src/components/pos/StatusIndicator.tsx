import React from 'react';
import { CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';
import { ConnectionStatus } from '../../types/pos';

interface StatusConfig {
  icon: typeof CheckCircle2;
  color: string;
  bgColor: string;
  label: string;
}

const statusConfig: Record<ConnectionStatus, StatusConfig> = {
  synced: {
    icon: CheckCircle2,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    label: 'Synced',
  },
  disconnected: {
    icon: XCircle,
    color: 'text-gray-500',
    bgColor: 'bg-gray-50',
    label: 'Disconnected',
  },
  error: {
    icon: AlertCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    label: 'Error',
  },
  pending: {
    icon: Clock,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
    label: 'Pending',
  },
};

interface StatusIndicatorProps {
  status: ConnectionStatus;
}

export default function StatusIndicator({ status }: StatusIndicatorProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`flex items-center space-x-2 ${config.color}`}>
      <div className={`p-1.5 rounded-full ${config.bgColor}`}>
        <Icon size={16} />
      </div>
      <span className="text-sm font-medium">{config.label}</span>
    </div>
  );
}