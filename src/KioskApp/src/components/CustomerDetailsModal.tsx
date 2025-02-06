import React, { useState, useEffect } from 'react';
import { useCustomerStore } from '../stores/customerStore';
import { toast } from 'react-hot-toast';
import { ChevronLeft } from 'lucide-react';
import { Timer } from './ui/Timer';
import { useNavigate, useParams } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';

type Step = 'name' | 'phone';

export function CustomerDetailsModal() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<Step>('name');
  useCustomerStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const { clearCart } = useCartStore();

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

  const handleStartOver = () => {
    clearCart();
    navigate(`/kiosk/${id}`);
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
      formattedValue = `(${numericValue.slice(0, 3)}) ${numericValue.slice(3, 6)}-${numericValue.slice(6, 10)}`;
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
      const orderDetails = {
        customerName: name,
        customerPhone: phone,
        timestamp: new Date().toISOString()
      };
      navigate(`/kiosk/${id}/payment`);
      console.log('Hello');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save customer data');
    }
  };

  const handleBack = () => {
    if (step === 'phone') {
      setStep('name');
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center p-4">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <ChevronLeft size={18} />
          <span>Back</span>
        </button>
      </div>

      <div className="flex-1 px-6 relative">
        <div className="w-full max-w-4xl mx-auto grid grid-cols-2 gap-12 items-center">
          {step === 'name' ? (
            <>
              <div>
                <h1 className="text-4xl font-medium mb-4">What's your name?</h1>
                <p className="text-gray-500 text-lg max-w-sm">
                  We will call your name when your order is ready
                </p>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-5xl bg-transparent focus:outline-none placeholder-gray-300 py-4 focus:ring-0"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && name.trim()) {
                      handleNameSubmit();
                    }
                  }}
                />
                <div className="absolute left-0 right-0 h-0.5 bg-gray-200 bottom-0" />
              </div>
            </>
          ) : (
            <>
              <div>
                <h1 className="text-4xl font-medium mb-4">What's your phone number?</h1>
                <p className="text-gray-500 text-lg max-w-sm">
                  We will also text you when your order is ready
                </p>
              </div>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="(XXX) XXX-XXXX"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="w-full text-5xl bg-transparent focus:outline-none placeholder-gray-300 py-4 focus:ring-0"
                  maxLength={14}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && phone.trim()) {
                      handlePhoneSubmit();
                    }
                  }}
                />
                <div className="absolute left-0 right-0 h-0.5 bg-gray-200 bottom-0" />
              </div>
            </>
          )}
        </div>
      </div>

      {/* <div className="flex justify-center p-4">
        <button
          onClick={step === 'name' ? handleNameSubmit : handlePhoneSubmit}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {step === 'name' ? 'Next' : 'Submit'}
        </button>
      </div> */}

      <Timer 
        seconds={30} 
        isActive={true} 
        onStartOver={handleStartOver} 
      />
    </div>
  );
}