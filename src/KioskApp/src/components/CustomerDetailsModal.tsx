import React, { useState, useEffect } from 'react';
import { useCustomerStore } from '../stores/customerStore';
import { toast } from 'react-hot-toast';
import { ChevronLeft } from 'lucide-react';
import { Timer } from './ui/Timer';
import { useNavigate, useParams } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { CheckoutLayout } from '../components/CheckoutLayout';
type Step = 'name' | 'phone';

export function CustomerDetailsModal() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<Step>('name');
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(true);
  useCustomerStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const { clearCart } = useCartStore();
  const { setCustomerName } = useCustomerStore();

  useEffect(() => {
    if (step === 'phone') {
      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length === 10 && /^[2-9]\d{9}$/.test(cleanPhone)) {
        handlePhoneSubmit();
      }
    }
  }, [phone, step]);

  useEffect(() => {
    if (!isTimerActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isTimerActive]);

  const resetTimer = () => {
    setTimeLeft(30);
  };

  const handleNameSubmit = () => {
    if (!name.trim()) {
      toast.error('Please enter youra name');
      return;
    }
    setStep('phone');
  };

  const handleBack = () => {
    if (step === 'phone') {
      setStep('name');
    } else {
      navigate(`/kiosk/${id}`);
    }
  };

  const handleStartOver = () => {
    clearCart();
    navigate(`/kiosk/${id}`);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    resetTimer();
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/\D/g, '');
    resetTimer();

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
      setCustomerName(name);
      navigate(`/kiosk/${id}/payment`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save customer data');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors 
            focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring 
            disabled:pointer-events-none disabled:opacity-50
            hover:bg-gray-100 h-9 px-4 py-2 
            text-gray-900"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
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
                  onChange={handleNameChange}
                  className="w-full text-5xl bg-transparent focus:outline-none placeholder-gray-300 py-4 focus:ring-0"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && name.trim()) {
                      handleNameSubmit();
                      resetTimer();
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
                      resetTimer();
                    }
                  }}
                />
                <div className="absolute left-0 right-0 h-0.5 bg-gray-200 bottom-0" />
              </div>
            </>
          )}
        </div>
      </div>

      <Timer 
        seconds={timeLeft} 
        isActive={isTimerActive} 
        onStartOver={handleStartOver}
        onComplete={handleStartOver}
      />
    </div>
  );
}