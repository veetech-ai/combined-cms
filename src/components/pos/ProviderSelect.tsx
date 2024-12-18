import React from 'react';
import { ChevronDown } from 'lucide-react';
import { PosProvider } from '../../types/pos';

interface ProviderSelectProps {
  value: PosProvider;
  onChange: (provider: PosProvider) => void;
}

const providers: PosProvider[] = ['Clover', 'Square', 'Toast', 'Stripe'];

export default function ProviderSelect({ value, onChange }: ProviderSelectProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as PosProvider)}
        className="appearance-none w-full bg-white border border-gray-200 px-4 py-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {providers.map((provider) => (
          <option key={provider} value={provider}>
            {provider}
          </option>
        ))}
      </select>
      <ChevronDown
        size={20}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  );
}