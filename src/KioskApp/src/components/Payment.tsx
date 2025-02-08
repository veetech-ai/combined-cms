import React, { useState, useEffect } from 'react';
import {
  Star,
  Instagram,
  ArrowLeft,
  Check,
  TagIcon as TacoIcon
} from 'lucide-react';
import { useOrder } from '../../../contexts/OrderContext';
import { useCustomerStore } from '../stores/customerStore';
import { createCharge } from '../api/clover';

export function Payment() {
  const { orderItems } = useOrder();
  const { customerName } = useCustomerStore();
  const [currentScreen, setCurrentScreen] = useState<
    'apple' | 'google' | 'processing' | 'confirmation'
  >('apple');
  const [rating, setRating] = useState<number>(0);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processGooglePayPayment = async (token: string) => {
    const response: any = await createCharge(
      amount * 100,
      token,
      'Payment for order',
      'usd'
    );
    console.log(response, 'sdadsadsa');
    if (response.status === 'succeeded') {
      setCurrentScreen('confirmation');
    } else {
      setError('Failed to process payment. Please try again.');
      // setCurrentScreen
    }
  };

  useEffect(() => {
    setError(null);
    if (currentScreen === 'apple') {
      //
    } else if (currentScreen === 'google') {
      handleGooglePay();
    }

    // Perform any setup or initialization here
    console.log('Payment component mounted');

    return () => {
      // Cleanup if necessary
      console.log('Payment component unmounted');
    };
  }, [currentScreen]);

  const renderErrorMessage = () =>
    error ? (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-4">{error}</div>
    ) : null;

  const items = orderItems?.items || [];
  const amount = 0.01; // for testing purposes - dummy payment
  // const amount = orderItems ? parseFloat(orderItems.totalBill) : 0;
  const orderId = orderItems?.orderId || '';

  const handleStarClick = (value: number) => {
    setRating(value);
    setTimeout(() => {
      setFeedbackSubmitted(true);
    }, 300);
  };

  const handleGooglePay = async () => {
    try {
      if (!window.Clover) {
        console.error('Clover SDK is not loaded');
        setError('Payment system not initialized.');
        return;
      }

      const googlePayContainer = document.getElementById('google-pay-button');
      if (!googlePayContainer) {
        console.error('Google Pay button container not found.');
        setError('Google Pay button not available.');
        return;
      }

      // avoid re-initializing Clover if already initialized
      if (googlePayContainer.querySelector('iframe')) {
        return;
      }

      // Initialize Clover
      const clover = new window.Clover('62862dc628972e7b4e7fbffd18ab0cdb', {
        merchantId: 'PSK40XM0M8ME1'
      });

      const elements = clover.elements();
      // Remove any existing buttons before re-creating
      googlePayContainer.innerHTML = '';

      // Create Google Pay Button Element
      const googlePayButton = elements.create('PAYMENT_REQUEST_BUTTON', {
        paymentReqData: {
          total: {
            label: 'Total Amount',
            amount: amount * 100 // Convert to cents
          },
          options: {
            button: {
              buttonType: 'short'
            }
          }
        }
      });

      googlePayButton.mount('#google-pay-button');

      // Ensure iframe inside container has correct height
      setTimeout(() => {
        const iframe = googlePayContainer.querySelector('iframe');
        if (iframe) {
          iframe.style.height = '50px'; // Adjust height
          iframe.style.width = '100%'; // Ensure full width
          iframe.style.border = 'none'; // Remove border
          iframe.style.overflow = 'hidden'; // Hide any unwanted scrolling
        }
      }, 500);

      // Listen for Google Pay event
      googlePayButton.addEventListener('paymentMethod', async (event) => {
        console.log('Google Pay token received:', event);

        if (!event.token) {
          console.error('Google Pay tokenization failed:', event);
          setError('Google Pay transaction failed. Please try again.');
          return;
        }

        const token = event.token;
        console.log('Google Pay token:', token);
        // alert(`Google Pay Token: ${token}`);

        // Send token to backend for processing
        await processGooglePayPayment(token);
      });
    } catch (error) {
      console.error('Error initiating Google Pay:', error);
      setError('Failed to initiate Google Pay.');
    }
  };

  const handlePayment = async (provider: 'apple' | 'google') => {
    try {
      setIsAnimating(true);
      setCurrentScreen('processing');
      if (provider === 'google') {
        await handleGooglePay();
      } else if (provider === 'apple') {
        // await handleApplePay();
      }
      // setCurrentScreen('confirmation');

      // Simulate payment processing
      // setTimeout(() => {
      //   setIsAnimating(false);
      //   setCurrentScreen('confirmation');
      // }, 2000);
    } catch (error) {
      console.error('Error initiating payment:', error);
      setError('Failed to initiate payment.');
    } finally {
      setIsAnimating(false);
    }
  };

  const renderApplePayScreen = () => (
    <div className="flex flex-col h-full bg-[#EEEEEE] animate-fadeIn relative">
      <div className="overflow-y-auto flex-1 pb-[140px]">
        <header className="bg-black p-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <TacoIcon className="w-12 h-12 text-[#06C167]" />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">MexiKhana</h1>
                <p className="text-gray-400 text-sm">{orderId}</p>
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=200&h=200"
              alt="Restaurant"
              className="w-16 h-16 rounded-lg object-cover shadow-lg"
            />
          </div>
          <div className="h-1 w-24 bg-[#06C167] rounded-full mt-4"></div>
        </header>
        {renderErrorMessage()}
        <div className="flex-1 p-8 text-left">
          <h2 className="text-2xl font-bold mb-1 text-black">Total Amount</h2>
          <div className="text-6xl font-bold mb-8 text-black tracking-tight">
            ${amount ? amount.toFixed(2) : 0}
          </div>

          <div className="mb-8">
            <div className="h-px bg-gray-200 w-full mb-8" />
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-500">
                ORDER SUMMARY
              </h3>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#06C167] rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {customerName.charAt(0)}
                  </span>
                </div>
                <span className="text-lg text-gray-700 font-medium">
                  {customerName}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6 mb-8">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-6 bg-white rounded-2xl shadow-sm transition-all hover:shadow-md border border-gray-100"
              >
                <div className="flex items-center gap-4">
                  <span className="w-12 h-12 bg-[#06C167] text-white text-xl font-bold rounded-xl flex items-center justify-center">
                    {item.quantity}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xl font-medium">{item.name.en}</span>
                    {item.customization &&
                      Object.entries(item.customization).map(([key, value]) => (
                        <span key={key} className="text-sm text-gray-500">
                          • {value}
                        </span>
                      ))}
                    {item.addons?.map((addon, idx) => (
                      <span key={idx} className="text-sm text-gray-500">
                        + {addon.name} (${addon.price.toFixed(2)})
                      </span>
                    ))}
                    {item.extras?.map((extra, idx) => (
                      <span key={idx} className="text-sm text-gray-500">
                        + {extra.name} (${extra.price.toFixed(2)})
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-xl font-bold">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4 bg-white shadow-xl rounded-t-[2.5rem] fixed bottom-0 left-0 right-0 max-w-lg mx-auto">
        <button
          onClick={() => handlePayment('apple')}
          className={`w-full text-xl font-bold rounded-2xl py-5 flex items-center justify-center gap-3 shadow-lg transition-all ${
            amount
              ? 'bg-black text-white hover:bg-gray-800 hover:shadow-xl active:transform active:scale-98'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!amount}
        >
          Pay with Apple Pay
        </button>
        <button
          onClick={() => setCurrentScreen('google')}
          className={`w-full bg-white border-2 border-black text-lg font-medium rounded-2xl py-4 transition-colors hover:bg-gray-50 ${
            amount ? '' : 'cursor-not-allowed opacity-50'
          }`}
          disabled={!amount}
        >
          Switch to Google Pay
        </button>
      </div>
    </div>
  );

  const renderGooglePayScreen = () => (
    <div className="flex flex-col h-full bg-[#EEEEEE] animate-fadeIn relative">
      <div className="overflow-y-auto flex-1 pb-[140px]">
        <header className="bg-black p-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <ArrowLeft
              className="w-10 h-10 cursor-pointer transition-transform hover:scale-110"
              onClick={() => setCurrentScreen('apple')}
            />
            <div className="flex items-center space-x-4">
              <TacoIcon className="w-12 h-12 text-[#06C167]" />
              <h1 className="text-2xl font-bold tracking-tight">MexiKhana</h1>
            </div>
            <div className="w-10 h-10"></div>
          </div>
          <div className="h-1 w-24 bg-[#06C167] rounded-full mt-4"></div>
        </header>
        {renderErrorMessage()}

        <div className="flex-1 p-8 text-left">
          <h2 className="text-2xl font-bold mb-1 font-roboto text-black">
            Total Amount
          </h2>
          <div className="text-6xl font-bold mb-8 font-roboto text-black tracking-tight">
            ${amount ? amount.toFixed(2) : 0}
          </div>

          <div className="mb-8">
            <div className="h-px bg-gray-200 w-full mb-8" />
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-500 font-roboto">
                ORDER SUMMARY
              </h3>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#06C167] rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {customerName.charAt(0)}
                  </span>
                </div>
                <span className="text-lg text-gray-700 font-medium font-roboto">
                  {customerName}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6 mb-8">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-6 bg-white rounded-2xl shadow-sm transition-all hover:shadow-md border border-gray-100"
              >
                <div className="flex items-center gap-4">
                  <span className="w-12 h-12 bg-[#06C167] text-white text-xl font-bold rounded-xl flex items-center justify-center">
                    {item.quantity}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xl font-medium font-roboto">
                      {item.name.en}
                    </span>
                    {item.customization &&
                      Object.entries(item.customization).map(([key, value]) => (
                        <span key={key} className="text-sm text-gray-500">
                          • {value}
                        </span>
                      ))}
                    {item.addons?.map((addon, idx) => (
                      <span key={idx} className="text-sm text-gray-500">
                        + {addon.name} (${addon.price.toFixed(2)})
                      </span>
                    ))}
                    {item.extras?.map((extra, idx) => (
                      <span key={idx} className="text-sm text-gray-500">
                        + {extra.name} (${extra.price.toFixed(2)})
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-xl font-bold font-roboto">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4 bg-white shadow-xl rounded-t-[2.5rem] fixed bottom-0 left-0 right-0 max-w-lg mx-auto">
        {/* <button
          id="google-pay-button"
          className="w-full max-w-xs h-12 rounded-lg bg-black flex items-center justify-center shadow-lg hover:bg-gray-800 transition"
        ></button> */}
        <button
          id="google-pay-button"
          className={`w-full h-14 bg-black text-white text-xl font-bold rounded-lg py-4 flex items-center justify-center gap-3 shadow-md transition-all hover:bg-gray-800 hover:shadow-lg active:scale-95 font-roboto ${
            amount ? '' : 'cursor-not-allowed opacity-50'
          }`}
          disabled={!amount}
        ></button>
        <button
          onClick={() => setCurrentScreen('apple')}
          className={`w-full bg-white border-2 border-[#06C167] text-[#06C167] text-lg font-medium rounded-2xl py-4 transition-colors hover:bg-green-50 font-roboto ${
            amount ? '' : 'cursor-not-allowed opacity-50'
          }`}
          disabled={!amount}
        >
          Switch to Apple Pay
        </button>
      </div>
    </div>
  );

  const renderProcessingScreen = () => (
    <div className="flex flex-col h-full bg-[#EEEEEE] animate-fadeIn">
      <header className="bg-black p-8 text-white">
        <div className="flex items-center space-x-4">
          <TacoIcon className="w-12 h-12 text-[#06C167]" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">MexiKhana</h1>
            <p className="text-gray-400 text-sm">Order #{orderId}</p>
          </div>
        </div>
        <div className="h-1 w-24 bg-[#06C167] rounded-full mt-4"></div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="relative mb-12">
          <svg className="w-32 h-32 animate-spin" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#06C167"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="283"
              strokeDashoffset="200"
              className="origin-center rotate-180"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <TacoIcon className="w-16 h-16 text-[#06C167] animate-pulse" />
          </div>
        </div>
        <h2 className="text-4xl font-bold mb-6 text-center">
          Processing Payment
        </h2>
        <p className="text-2xl text-gray-600 text-center max-w-sm">
          Securely processing your payment of{' '}
          <span className="font-semibold text-black">${amount.toFixed(2)}</span>
        </p>
        <div className="mt-8 flex items-center gap-2 text-gray-500">
          <div className="w-2 h-2 bg-[#06C167] rounded-full animate-pulse" />
          <span>Please don't close this screen</span>
        </div>
      </div>
    </div>
  );

  const renderConfirmationScreen = () => (
    <div className="flex flex-col h-full bg-[#EEEEEE] animate-fadeIn relative">
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6 overflow-y-auto pb-[100px]">
        <div className="w-32 h-32 bg-[#06C167] rounded-2xl flex items-center justify-center mb-12 shadow-xl animate-scaleIn">
          <Check className="w-16 h-16 text-white" />
        </div>
        <h2 className="text-4xl font-bold text-center">You've Paid</h2>
        <div className="text-6xl font-bold tracking-tight">
          ${amount.toFixed(2)}
        </div>
        <p className="text-xl text-gray-600 text-center">
          We'll notify you when your order is ready.
        </p>

        {!feedbackSubmitted ? (
          <div className="w-full max-w-md bg-white p-6 rounded-3xl shadow-xl animate-fadeIn">
            <h3 className="text-2xl font-medium text-center mb-4">
              Rate your experience
            </h3>
            <div className="flex justify-center gap-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-12 h-12 cursor-pointer transition-all hover:scale-110 ${
                    star <= rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  onClick={() => handleStarClick(star)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md bg-white p-6 rounded-3xl shadow-xl animate-fadeIn">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                {[...Array(rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-10 h-10 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <h3 className="text-2xl font-medium mb-4">
                Thank you for your rating!
              </h3>
              <p className="text-gray-600">
                Your feedback helps us serve you better.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white shadow-xl rounded-t-[2.5rem] space-y-4 fixed bottom-0 left-0 right-0 max-w-lg mx-auto z-10">
        <a
          href="https://www.instagram.com/eatmexikhana/"
          className="w-full bg-black text-white text-xl font-bold rounded-2xl py-5 flex items-center justify-center gap-4 shadow-lg transition-all hover:bg-gray-900 hover:shadow-xl active:transform active:scale-98"
        >
          <Instagram className="w-10 h-10" />
          FOLLOW US
        </a>
      </div>
    </div>
  );

  return (
    <div className="h-[100dvh] max-w-lg mx-auto bg-white shadow-2xl overflow-hidden">
      {currentScreen === 'apple' && renderApplePayScreen()}
      {currentScreen === 'google' && renderGooglePayScreen()}
      {currentScreen === 'processing' && renderProcessingScreen()}
      {currentScreen === 'confirmation' && renderConfirmationScreen()}
    </div>
  );
}
