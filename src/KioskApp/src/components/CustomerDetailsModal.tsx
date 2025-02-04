import React, { useState, useEffect } from 'react';
import { useCustomerStore } from '../stores/customerStore';
import { toast } from 'react-hot-toast';
import { Timer } from './ui/Timer';
import { BackButton } from './ui/BackButton';

interface CustomerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, phone: string, order: any) => void;
  onStartOver: () => void;
}

type Step = 'name' | 'phone';

export function CustomerDetailsModal({ isOpen, onClose, onSubmit, onStartOver }: CustomerDetailsModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<Step>('name');
  const { findOrCreate, isLoading } = useCustomerStore();

  useEffect(() => {
    if (step === 'phone') {
      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length === 10 && /^[2-9]\d{9}$/.test(cleanPhone)) {
        handlePhoneSubmit();
      }
    }
  }, [phone, step]);

  const handleNameSubmit = () => {
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    setStep('phone');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/\D/g, '');

    let formattedValue = '';
    if (numericValue.length <= 3) {
      formattedValue = numericValue;
    } else if (numericValue.length <= 6) {
      formattedValue = `(${numericValue.slice(0, 3)}) ${numericValue.slice(3)}`;
    } else {
      formattedValue = `(${numericValue.slice(0, 3)}) ${numericValue.slice(
        3,
        6
      )}-${numericValue.slice(6, 10)}`;
    }

    if (numericValue.length >= 1 && !/[2-9]/.test(numericValue[0])) {
      return;
    }

    if (numericValue.length <= 10) {
      setPhone(formattedValue);
    }
  };

  const handlePhoneSubmit = async () => {
    const cleanPhone = phone.replace(/\D/g, '');

    try {
      // const customer = await findOrCreate(name, cleanPhone);
      // Create a basic order object with customer details
      const orderDetails = {
        customerName: name,
        customerPhone: phone,
        timestamp: new Date().toISOString()
      };
      onSubmit(name, phone, orderDetails);
      setName('');
      setPhone('');
      setStep('name');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save customer data');
    }
  };

  const handleBack = () => {
    if (step === 'phone') {
      setStep('name');
    } else {
      onClose();
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-white flex flex-col h-screen">
        <div className="flex items-center p-4">
          <BackButton onClick={handleBack} />
        </div>

        <div className="flex-1 p-4">
          <div className="max-w-md mx-auto space-y-6">
            {step === 'name' ? (
              <>
                <h2 className="text-2xl mb-8">What's your name?</h2>
                <input
                  type="text"
                  placeholder="Your name"
                  pattern="[A-Za-z ]+"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-0 text-4xl font-light border-0 focus:outline-none focus:ring-0 bg-transparent"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && name.trim()) {
                      handleNameSubmit();
                    }
                  }}
                />
                <p className="text-base text-gray-600 mt-4">
                  We will call your name when your order is ready
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl mb-8">What's your phone number?</h2>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="(XXX) XXX-XXXX"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="w-full p-0 text-4xl font-light border-0 focus:outline-none focus:ring-0 bg-transparent"
                  autoFocus
                  maxLength={14}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && phone.replace(/\D/g, '').length === 10) {
                      handlePhoneSubmit();
                    }
                  }}
                />
                <p className="text-base text-gray-600 mt-4">
                  We will also text you when your order is ready
                </p>
              </>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={step === 'name' ? handleNameSubmit : handlePhoneSubmit}
            disabled={
              (step === 'name' && !name.trim()) ||
              (step === 'phone' && !/^[2-9]\d{9}$/.test(phone.replace(/\D/g, ''))) ||
              isLoading
            }
            className="w-full bg-black text-white py-4 text-lg font-medium rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>

        <div className="absolute top-4 right-4">
          <Timer seconds={30} onComplete={onClose} onStartOver={onStartOver} />
        </div>
      </div>
    )
  );
}