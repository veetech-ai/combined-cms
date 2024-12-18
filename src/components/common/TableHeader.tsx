import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface TableHeaderProps {
  label: string;
  sortable?: boolean;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: () => void;
}

export default function TableHeader({
  label,
  sortable,
  sortField,
  sortDirection,
  onSort,
}: TableHeaderProps) {
  return (
    <th
      className={`pb-4 font-medium text-gray-500 ${
        sortable ? 'cursor-pointer hover:text-gray-700' : ''
      }`}
      onClick={sortable ? onSort : undefined}
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        {sortable && sortField && (
          <div className="flex flex-col">
            <ChevronUp
              size={14}
              className={sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'}
            />
            <ChevronDown
              size={14}
              className={sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400'}
            />
          </div>
        )}
      </div>
    </th>
  );
}