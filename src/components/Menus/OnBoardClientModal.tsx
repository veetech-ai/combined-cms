import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { X, Monitor, Text } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { displayService, Display } from '../../services/displayService';

interface Props {
  store: any;
  onClose: () => void;
  onSubmit: (newDisplay: Display) => void;
}

export function OnboardClientModal({ store, onClose, onSubmit }: Props) {
  const navigate = useNavigate();
  const [hexCode, setHexCode] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!hexCode || hexCode.length !== 8) {
        toast.error('Please enter a valid 8-character hex code.');
        return;
      }

      const validationCode = localStorage.getItem('hexaCode');
      const cleanedHexString = validationCode && validationCode.replace(/\s+/g, '');
      // if (hexCode !== cleanedHexString) {
      //   toast.error('Hex code mismatch');
      //   return;
      // }

      const newDisplay: Display = {
        id: uuidv4(),
        name: displayName || `Display ${hexCode}`,
        location: 'Pending Setup',
        store: store?.name || 'Default Store',
        organization: 'Default Organization',
        status: 'Online',
        lastSeen: new Date().toISOString(),
        hexCode: hexCode
      };

      await onSubmit(newDisplay);
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to onboard display');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl sm:max-w-lg sm:w-full">
        <div className="px-6 py-4 flex justify-between items-center border-b">
          <h3 className="text-lg font-medium text-gray-900">
            Onboard New Display
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 py-4">
          <p className="text-sm text-gray-500">
            Enter the 8-character hex code to onboard the display.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label
                htmlFor="hexCode"
                className="block text-sm font-medium text-gray-700"
              >
                Hex Code <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1">
                <Monitor className="absolute inset-y-0 left-0 pl-3 text-gray-400" />
                <input
                  type="text"
                  id="hexCode"
                  value={hexCode}
                  onChange={(e) => setHexCode(e.target.value.toUpperCase())}
                  placeholder="E.g., 1A2B3C4D"
                  maxLength={8}
                  required
                  className="pl-10 w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="displayName"
                className="block text-sm font-medium text-gray-700"
              >
                Display Name
              </label>
              <div className="relative mt-1">
                <Text className="absolute inset-y-0 left-0 pl-3 text-gray-400" />
                <input
                  type="text"
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="E.g., My New Display"
                  className="pl-10 w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Onboarding...' : 'Onboard Display'}
            </button>
          </form>
        </div>
      </div>

      <Toaster />
    </div>
  );
}
