import React, { useState, useEffect } from 'react';
import { X, Monitor } from 'lucide-react';
import { io } from 'socket.io-client';
import { Store } from '../../types/store';
import { displayService } from '../../services/displayService';
import { toast, Toaster } from 'react-hot-toast';

const socket = io('http://localhost:4000'); // Replace with your backend server address

interface CreateDisplayModalProps {
  stores: Store[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateDisplayModal({
  stores,
  onClose,
  onSuccess
}: CreateDisplayModalProps) {
  const [form, setForm] = useState({
    name: '',
    hexCode: '',
    storeId: '',
    moduleId: 'kiosk' // Default to kiosk module
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.hexCode || !form.storeId) {
      toast.error('Please fill in all required fields');
      return;
    }

    const validationCode = localStorage.getItem('hexaCode');
    const cleanedHexString =
      validationCode && validationCode.replace(/\s+/g, '');
    if (form.hexCode != cleanedHexString) {
      toast.error('Hex code mismatch');
      return;
    } else {
      toast.success('Hex Code Matched');
    }

    setIsSubmitting(true);
    try {
      await displayService.createDisplay(form);
      toast.success('Display created successfully');
      onSuccess();
    } catch (error) {
      toast.error('Failed to create display');
      console.error('Error creating display:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Add New Display
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Display Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label
                htmlFor="store"
                className="block text-sm font-medium text-gray-700"
              >
                Store <span className="text-red-500">*</span>
              </label>
              <select
                id="store"
                value={form.storeId}
                onChange={(e) => setForm({ ...form, storeId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
                <option value="">Select a store</option>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="hexCode"
                className="block text-sm font-medium text-gray-700"
              >
                Hex Code <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Monitor className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="hexCode"
                  value={form.hexCode}
                  onChange={(e) =>
                    setForm({ ...form, hexCode: e.target.value.toUpperCase() })
                  }
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm uppercase"
                  placeholder="E.g., 1A2B3C4D"
                  pattern="[0-9A-Fa-f]{8}"
                  maxLength={8}
                  required
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Enter an 8-character hex code (0-9, A-F)
              </p>
            </div>

            <div className="mt-5 sm:mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Display'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Toaster />
    </div>
  );
}
