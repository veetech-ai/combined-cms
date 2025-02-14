import React, { useState, useEffect } from 'react';
import {
  Star,
  Instagram,
  ArrowLeft,
  Check,
  TagIcon as TacoIcon
} from 'lucide-react';
import { useCustomerStore } from '../stores/customerStore';
import { createCharge } from '../api/clover';
import { useLocation } from 'react-router-dom';
import { orderService } from '../../../services/orderService';
import io from 'socket.io-client';
import { useTimer } from '../contexts/TimerContext';

declare global {
  interface Window {
    Clover: {
      new (merchantId: string, config: CloverConfig): CloverInstance;
    };
  }
}

interface CloverConfig {
  merchantId: string;
}

interface CloverInstance {
  elements: () => any;
  createToken: () => Promise<{ token: string }>;
  createApplePaymentRequest: ({
    amount,
    currencyCode,
    countryCode
  }: {
    amount: number;
    currencyCode: string;
    countryCode: string;
  }) => Promise<{ token: string }>;
}

interface OrderData {
  orderId: string;
  customerName: string;
  customerPhone: string;
  timestamp: string;
  items: Array<{
    id: number | string;
    name: {
      en: string;
      es: string;
    };
    price: number;
    quantity: number;
    addons: Array<{
      id: string;
      name: string;
      price: number;
    }>;
    customization: Record<string, string>;
    extras: Array<{
      id: string;
      name: string;
      price: number;
    }>;
    instructions?: string;
  }>;
  totalBill: string;
}

export function Payment() {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const testDummyPayment = queryParams.get('testDummyPayment') === 'true';
  const orderId = queryParams.get('orderId');
  const [cloverInstance, setCloverInstance] = useState<CloverInstance | null>(
    null
  );
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<
    'payment' | 'processing' | 'confirmation' | 'retry'
  >('payment');
  const [rating, setRating] = useState<number>(0);
  const [retryPayment, setRetryPayment] = useState<boolean>(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isApplePaySupported, setIsApplePaySupported] = useState(true);
  const [isGooglePaySupported, setIsGooglePaySupported] = useState(true);
  const [isPaymentButtonsLoading, setIsPaymentButtonsLoading] = useState(false);

  const WS_URL = import.meta.env.VITE_WS_URL;

  const { 
    timeLeft, 
    isTimerActive, 
    showTimer, 
    resetTimer, 
    handleUserActivity 
  } = useTimer();

  // Initialize socket connection and handle payment processing
  useEffect(() => {
    const socket = io(WS_URL);

    // Connect to WebSocket server
    socket.connect();

    // Handle successful connection
    socket.on('connect', () => {
      console.log('Payment component connected to socket server');
    });

    // Handle payment processing status updates
    socket.on('paymentStatus', (data) => {
      if (data.orderId === orderId) {
        switch (data.status) {
          case 'processing':
            setCurrentScreen('processing');
            break;
          case 'success':
            setCurrentScreen('confirmation');
            break;
          case 'failed':
            // Show error and allow retry
            setError(data.error || 'Payment failed');
            setRetryPayment(true);
            break;
        }
      }
    });

    // Add to your existing socket event handlers
    socket.on('resetTimer', (data) => {
      if (data.orderId === orderId) {
        resetTimer();
        // If you need to reset any other state in Payment component
        setCurrentScreen('payment');
      }
    });

    // Cleanup socket connection
    return () => {
      socket.disconnect();
    };
  }, [orderId]);

  const initializeClover = async () => {
    if (!window.Clover) {
      console.error('Clover SDK is not loaded');
      setError('Payment system not initialized.');
      return;
    }

    // ✅ Avoid reinitializing Clover if it already exists
    if (cloverInstance) {
      console.log(
        'Clover instance already initialized, skipping reinitialization.'
      );
      return;
    }

    const clover = new window.Clover('62862dc628972e7b4e7fbffd18ab0cdb', {
      merchantId: 'PSK40XM0M8ME1'
    });

    setCloverInstance(clover);
  };

  const initializeCloverPaymentMethods = async () => {
    try {
      if (!amount || amount <= 0 || !orderData) {
        console.error('Invalid amount, cannot proceed with Google Pay.');
        setError('Payment amount is required.');
        return;
      }

      if (!window.Clover) {
        console.error('Clover SDK is not loaded');
        setError('Payment system not initialized.');
        return;
      }

      // ✅ Avoid reinitializing Clover if it already exists
      if (cloverInstance) {
        console.log(
          'Clover instance already initialized, skipping reinitialization.'
        );
        return;
      }

      // ✅ Avoid reinitializing Clover if it already exists
      // if (!cloverInstance) {
      //   console.log(
      //     'Clover instance not initialized, skipping reinitialization.'
      //   );
      //   return;
      // }

      const paymentReqData = {
        total: {
          label: 'Total Amount',
          amount: amount * 100 // Convert to cents
        },
        options: {
          button: {
            buttonType: 'short', // or 'long' for full text
            style: {
              height: '40px',
              width: '100%',
              borderRadius: '12px',
              fontSize: '18px'
            }
          }
        }
      };

      console.log('Initializing Clover payment methods...');

      const googlePayContainer = document.getElementById('google-pay-button');
      if (!googlePayContainer) {
        console.error('Google Pay button container not found.');
        setError('Google Pay button not available.');
        return;
      }

      // // avoid re-initializing Clover if already initialized
      if (googlePayContainer.querySelector('iframe')) {
        return;
      }

      const applePayContainer = document.getElementById('apple-pay-button');
      if (!applePayContainer) {
        console.error('Apple Pay button container not found.');
        // setError('Apple Pay button not available.');
        return;
      }

      // Avoid re-initializing Clover if already initialized
      if (applePayContainer.querySelector('iframe')) {
        return;
      }

      // if (document.getElementById('card-number-element')?.children.length) {
      //   return;
      // }

      const clover = new window.Clover('62862dc628972e7b4e7fbffd18ab0cdb', {
        merchantId: 'PSK40XM0M8ME1'
      });
      // const clover = cloverInstance;

      // test merchant credentials
      // const clover = new window.Clover('04750d1c04d58c8b1e4e5be9dc3ae37f', {
      //   merchantId: 'RCTSTAVI0010002'
      // });

      const elements = clover.elements();

      // ✅ Google Pay Button
      const googlePayData = {
        total: {
          label: 'Total Amount',
          amount: amount * 100 // Convert to cents
        },
        options: {
          button: {
            buttonType: 'short' // or 'long' for additional text
          }
        }
      };

      const paymentRequestButton = elements.create('PAYMENT_REQUEST_BUTTON', {
        paymentReqData
      });

      const applePayRequest = clover.createApplePaymentRequest({
        amount: amount * 100,
        countryCode: 'US',
        currencyCode: 'USD'
      });

      const paymentRequestAppleButton = elements.create(
        'PAYMENT_REQUEST_BUTTON_APPLE_PAY',
        {
          applePaymentRequest: applePayRequest,
          sessionIdentifier: 'PSK40XM0M8ME1'
        }
      );

      // ✅ Mount to Apple Pay & Google Pay Containers
      paymentRequestAppleButton.mount('#apple-pay-button');
      paymentRequestButton.mount('#apple-pay-button');
      paymentRequestButton.mount('#google-pay-button');

      // ✅ Apply Size to `#payment-request-button`
      const paymentButtonContainer = document.getElementById(
        'payment-request-button'
      );
      if (paymentButtonContainer) {
        paymentButtonContainer.style.width = '100%';
        paymentButtonContainer.style.height = '40px';
        paymentButtonContainer.style.borderRadius = '12px';
        paymentButtonContainer.style.overflow = 'hidden';
      }

      // ✅ Mount Apple Pay & Google Pay to `#payment-request-button`
      paymentRequestButton.mount('#payment-request-button');
      paymentRequestAppleButton.mount('#payment-request-button');

      // ✅ Ensure iFrame Styling
      setTimeout(() => {
        const iframe = document.querySelector('#payment-request-button iframe');
        if (iframe) {
          (iframe as HTMLIFrameElement).style.width = '100%';
          (iframe as HTMLIFrameElement).style.height = '40px';
          (iframe as HTMLIFrameElement).style.border = 'none';
          (iframe as HTMLIFrameElement).style.borderRadius = '12px';
        }
      }, 1000);

      // ✅ Handle Payment Events
      paymentRequestButton.addEventListener(
        'paymentMethodStart',
        function (ev) {
          console.log('Payment processing started...');
        }
      );

      paymentRequestButton.addEventListener(
        'paymentMethod',
        async function (ev) {
          console.log('Payment method received:', ev);
          const token = ev.token;

          if (!token) {
            console.error('Payment tokenization failed:', ev);
            setError('Transaction failed. Please try again.');
            return;
          }

          await processPayment(token);
        }
      );

      // const googlePayButton = await elements.create('PAYMENT_REQUEST_BUTTON', {
      //   paymentReqData: googlePayData
      // });

      // if (googlePayButton) {
      //   setIsGooglePaySupported(true);
      // }

      // googlePayButton.mount('#google-pay-button');

      // Ensure iframe inside container has correct height
      // setTimeout(() => {
      //   const iframe = googlePayContainer.querySelector('iframe');
      //   if (iframe) {
      //     iframe.style.height = '50px'; // Adjust height
      //     iframe.style.width = '100%'; // Ensure full width
      //     iframe.style.border = 'none'; // Remove border
      //     iframe.style.overflow = 'hidden'; // Hide any unwanted scrolling
      //   }
      // }, 500);

      // googlePayButton.addEventListener('paymentMethod', async (event) => {
      //   console.log('Google Pay token received:', event);
      //   const token = event.token;
      //   if (!token) {
      //     console.error('Google Pay tokenization failed:', event);
      //     setError('Google Pay transaction failed. Please try again.');
      //     return;
      //   }

      //   await processPayment(token);
      // });

      // const applePayRequest = await clover.createApplePaymentRequest({
      //   amount: amount * 100,
      //   countryCode: 'US',
      //   currencyCode: 'USD'
      // });

      // if (applePayRequest.token) {
      //   setIsApplePaySupported(true);
      // }

      // Create Apple Pay Button Element
      // const applePayButton = elements.create(
      //   'PAYMENT_REQUEST_BUTTON_APPLE_PAY',
      //   {
      //     applePayRequest,
      //     sessionIdentifier: 'PSK40XM0M8ME1'
      //   }
      // );

      // applePayButton.mount('#apple-pay-button');

      // Ensure iframe inside container has correct height
      // setTimeout(() => {
      //   const iframe = applePayContainer.querySelector('iframe');
      //   if (iframe) {
      //     iframe.style.height = '50px'; // Adjust height
      //     iframe.style.width = '100%'; // Ensure full width
      //     iframe.style.border = 'none'; // Remove border
      //     iframe.style.overflow = 'hidden'; // Hide any unwanted scrolling
      //   }

      // document.addEventListener('DOMContentLoaded', function () {
      //   const iframe = document.querySelector('#apple-pay-button iframe');

      //   if (iframe) {
      //     (iframe as HTMLIFrameElement).onload = function () {
      //       const iframeDocument =
      //         (iframe as HTMLIFrameElement).contentDocument ||
      //         (iframe as HTMLIFrameElement).contentWindow?.document;

      //       if (iframeDocument) {
      //         const style = document.createElement('style');
      //         style.innerHTML = `
      //           .apple-pay-button {
      //             height: 56px !important;
      //             width: 100% !important;
      //             border-radius: 12px !important;
      //             background-color: black !important;
      //           }
      //         `;

      // iframeDocument.head.appendChild(style);
      // }
      // };
      //     }
      //   });
      // }, 500);

      // ✅ Apple Pay Button
      // const applePayData = {
      //   total: {
      //     label: 'Total Amount',
      //     amount: 1 // Amount in cents (e.g., $10.99)
      //   },
      //   options: {
      //     button: {
      //       buttonType: 'short' // or 'long' for additional text
      //     }
      //   }
      // };

      // const applePayButton = elements.create(
      //   'PAYMENT_REQUEST_BUTTON_APPLE_PAY',
      //   {
      //     paymentReqData: applePayData
      //   }
      // );

      // applePayButton.addEventListener('paymentMethod', async (event) => {
      //   console.log('Apple Pay token received:', event);

      //   if (!event.detail || !event.detail.tokenReceived) {
      //     setError('Apple Pay transaction failed. Please try again.');
      //     return;
      //   }

      //   if (!event.token) {
      //     console.error('Apple Pay tokenization failed:', event);
      //     setError('Apple Pay transaction failed. Please try again.');
      //     return;
      //   }

      //   const token = event.token || event.detail.tokenReceived.i;
      //   console.log('Apple Pay token:', token);

      //   // Send token to backend for processing
      //   await processPayment(token);
      // });

      // setCloverInstance(clover);
      setIsPaymentButtonsLoading(false); // ✅ Mark payment methods as loaded
    } catch (err) {
      console.error('Clover initialization error:', err);
      setError('Failed to initialize payment system');
    }
    // setIsPaymentButtonsLoading(false);
    // return () => {};
  };

  // useEffect(() => {
  //   initializeClover();
  // }, []);

  useEffect(() => {
    const checkPaymentSupport = async () => {
      setIsPaymentButtonsLoading(true);

      if (window.Clover) {
        const clover = new window.Clover('62862dc628972e7b4e7fbffd18ab0cdb', {
          merchantId: 'PSK40XM0M8ME1'
        });

        const elements = clover.elements();

        try {
          const applePayRequest = await clover.createApplePaymentRequest({
            amount: amount * 100,
            countryCode: 'US',
            currencyCode: 'USD'
          });

          if (applePayRequest.token) {
            setIsApplePaySupported(true);
          }
        } catch (error) {
          console.log('❌ Apple Pay not supported:', error);
        }

        try {
          const googlePayButton = elements.create('PAYMENT_REQUEST_BUTTON', {
            paymentReqData: {
              total: {
                label: 'Total Amount',
                amount: amount * 100
              },
              options: {
                button: {
                  buttonType: 'short'
                }
              }
            }
          });

          if (googlePayButton) {
            setIsGooglePaySupported(true);
          }
        } catch (error) {
          console.log('❌ Google Pay not supported:', error);
        }
      }

      setIsPaymentButtonsLoading(false);
    };

    // checkPaymentSupport();
    initializeCloverPaymentMethods();
  }, [amount]);

  // apple pay & google pay buttons
  const renderAppleGooglePayButtons = () => (
    <div className="p-6 space-y-4 bg-white shadow-xl rounded-t-[2.5rem] fixed bottom-0 left-0 right-0 max-w-lg mx-auto">
      {isPaymentButtonsLoading ? (
        <div className="text-center text-gray-600">
          Checking payment options...
        </div>
      ) : (
        <>
          <div id="payment-request-button">
            <div id="apple-pay-button" className="payment-button"></div>
            <div id="google-pay-button" className="payment-button"></div>
          </div>

          {/* <div id="payment-request-button" className="payment-button"></div> */}

          {/* Apple Pay Button */}
          {/* {isApplePaySupported && ( */}
          {/* <div
            id="apple-pay-button"
            className="w-full h-14  text-xl font-bold rounded-lg py-4 flex items-center justify-center gap-3 transition-all  active:scale-95 font-roboto"
          ></div> */}
          {/* )} */}

          {/* Google Pay Button */}
          {/* {isGooglePaySupported && ( */}
          {/* <div
            id="google-pay-button"
            className="w-full h-14 text-xl font-bold rounded-lg py-4 flex items-center justify-center gap-3 transition-all  active:scale-95 font-roboto"
          ></div> */}
          {/* )} */}

          {/* If no payment method is supported */}
          {!isApplePaySupported && !isGooglePaySupported && (
            <div className="text-center text-gray-500">
              No supported payment methods available.
            </div>
          )}

          {/* Iframe styling adjustments */}
          <style>{`
          #apple-pay-button iframe,
          #google-pay-button iframe {

          }

          @supports (-webkit-appearance: -apple-pay-button) {
            .apple-pay-button {
              display: block;
              height: 40px !important;
              width: 100% !important;
              border: none !important;
              border-radius: 12px !important;
              -webkit-appearance: -apple-pay-button;
            }
            .apple-pay-button-black {
              -apple-pay-button-style: black;
            }
          }

          .payment-button iframe {
  width: 100% !important;
  height: 4px !important;
  border-radius: 12px !important;
  overflow: hidden !important;
}

#payment-request-button iframe {
  width: 100% !important;
  height: 40px !important;
  border-radius: 12px !important;
  overflow: hidden !important;
}


        `}</style>
        </>
      )}
    </div>
  );

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      setIsLoading(true);
      await orderService.updateOrder(orderId, {
        status
      });
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError('Order ID is required');
        setIsLoading(false);
        return;
      }

      // update order
      updateOrderStatus(orderId, 'payment_processing');

      try {
        const orderData = await orderService.getOrder(orderId);
        setOrderData(orderData);

        // Set amount after getting order data
        const calculatedAmount = testDummyPayment
          ? 0.01
          : orderData.totalBill
          ? parseFloat(orderData.totalBill)
          : 0;

        setAmount(calculatedAmount);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, testDummyPayment]);

  // Handle payment processing
  const processPayment = async (token: string) => {
    try {
      // Attempt to create charge
      const response: any = await createCharge(
        amount * 100,
        token,
        'Payment for order',
        'usd'
      );

      if (response.status === 'succeeded') {
        // Payment successful
        setCurrentScreen('confirmation');
        if (orderId) {
          await updateOrderStatus(orderId, 'completed');
        }
      } else {
        // Payment failed - update order status and show retry screen
        if (orderId) {
          await updateOrderStatus(orderId, 'failed_retry');
        }
        setRetryPayment(true);
        setError('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      setError('Payment processing failed. Please try again.');
      // Emit socket event for payment failure
      socket.emit('paymentFailed', {
        orderId,
        error: 'Payment processing failed'
      });
    }
  };

  // Handle retry payment attempts
  const handleRetryPayment = async () => {
    setError(null);
    setRetryPayment(false);
    setCurrentScreen('initial');
    // Emit event to show QR code retry screen in PaymentModal
    socket.emit('orderStatusUpdated', {
      orderId,
      status: 'payment_retry'
    });
  };

  useEffect(() => {
    setError(null);
    if (currentScreen === 'payment') {
      // handleApplePay();
      // handleGooglePay();
    }

    // Perform any setup or initialization here
    console.log('Payment component mounted');

    return () => {
      // Cleanup if necessary
      console.log('Payment component unmounted');
    };
  }, [currentScreen, amount]);

  const renderErrorMessage = () =>
    error ? (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-4">{error}</div>
    ) : null;
  console.log(
    'Payment component mounted - pass testDummyPayment=true to test 0.01 usd payment'
  );
  const items = orderData?.items || [];

  const handleStarClick = (value: number) => {
    setRating(value);
    setTimeout(() => {
      setFeedbackSubmitted(true);
    }, 300);
  };

  const handleApplePay = async () => {
    try {
      if (!amount || amount <= 0 || !orderData) {
        console.error('Invalid amount, cannot proceed with Apple Pay.');
        setError('Payment amount is required.');
        return;
      }

      if (!window.Clover) {
        console.error('Clover SDK is not loaded');
        setError('Payment system not initialized.');
        return;
      }

      const applePayContainer = document.getElementById('apple-pay-button');
      if (!applePayContainer) {
        console.error('Apple Pay button container not found.');
        // setError('Apple Pay button not available.');
        return;
      }

      // Avoid re-initializing Clover if already initialized
      if (applePayContainer.querySelector('iframe')) {
        return;
      }

      // Initialize Clover
      const clover = new window.Clover('62862dc628972e7b4e7fbffd18ab0cdb', {
        merchantId: 'PSK40XM0M8ME1'
      });

      const applePayRequest = clover.createApplePaymentRequest({
        amount: amount * 100,
        countryCode: 'US',
        currencyCode: 'USD'
      });

      const elements = clover.elements();
      // applePayContainer.innerHTML = '';

      // Create Apple Pay Button Element
      const applePayButton = elements.create(
        'PAYMENT_REQUEST_BUTTON_APPLE_PAY',
        {
          applePayRequest,
          sessionIdentifier: 'PSK40XM0M8ME1'
        }
      );
      // const applePayButton = elements.create(
      //   'PAYMENT_REQUEST_BUTTON_APPLE_PAY',
      //   {
      //     paymentReqData: {
      //       total: {
      //         label: 'Total Amount',
      //         amount: amount * 100 // Convert to cents
      //       },
      //       options: {
      //         button: {
      //           buttonType: 'short'
      //         }
      //       }
      //     }
      //   }
      // );

      applePayButton.mount('#apple-pay-button');

      // Ensure iframe inside container has correct height
      setTimeout(() => {
        const iframe = applePayContainer.querySelector('iframe');
        if (iframe) {
          iframe.style.height = '50px'; // Adjust height
          iframe.style.width = '100%'; // Ensure full width
          iframe.style.border = 'none'; // Remove border
          iframe.style.overflow = 'hidden'; // Hide any unwanted scrolling
        }
        const appBtn = document.querySelector('.apple-pay-button');
        if (appBtn) {
          (appBtn as HTMLElement).style.display = 'block';
          (appBtn as HTMLElement).style.width = '100%';
          (appBtn as HTMLElement).style.height = '40px';
          (appBtn as HTMLElement).style.border = 'none';
          (appBtn as HTMLElement).style.borderRadius = '12px';
          // border: none !important;
          // border-radius: 12px !important;
        }
      }, 500);

      // Listen for Apple Pay event
      applePayButton.addEventListener('paymentMethod', async (event) => {
        console.log('Apple Pay token received:', event);
        if (!event.detail || !event.detail.tokenReceived) {
          setError('Apple Pay transaction failed. Please try again.');
          return;
        }

        if (!event.token) {
          console.error('Apple Pay tokenization failed:', event);
          setError('Apple Pay transaction failed. Please try again.');
          return;
        }

        const token = event.token || event.detail.tokenReceived.i;
        console.log('Apple Pay token:', token);

        // Send token to backend for processing
        await processPayment(token);
      });
    } catch (error) {
      console.error('Error initiating Apple Pay:', error);
      setError('Failed to initiate Apple Pay.');
    }
  };

  const handleGooglePay = async () => {
    try {
      if (!amount || amount <= 0 || !orderData) {
        console.error('Invalid amount, cannot proceed with Google Pay.');
        setError('Payment amount is required.');
        return;
      }

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
        await processPayment(token);
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
        // await handleGooglePay();
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

  const renderPaymentScreen = () => (
    <div className="flex flex-col h-full bg-[#EEEEEE] animate-fadeIn relative">
      <div className="overflow-y-auto flex-1 pb-[140px]">
        <header className="bg-black p-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <TacoIcon className="w-12 h-12 text-[#06C167]" />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">MexiKhana</h1>
                <p className="text-gray-400 text-sm">{orderData?.orderId}</p>
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
                    {orderData?.customerName.charAt(0)}
                  </span>
                </div>
                <span className="text-lg text-gray-700 font-medium">
                  {orderData?.customerName}
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

      {/* Show Apple Pay & Google Pay Buttons */}

      <div className="p-6 space-y-4 bg-white shadow-xl rounded-t-[2.5rem] fixed bottom-0 left-0 right-0 max-w-lg mx-auto">
        {renderAppleGooglePayButtons()}
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
            <p className="text-gray-400 text-sm">Order {orderId}</p>
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

  const renderTimer = () => {
    if (showTimer) {
      return (
        <div className="absolute top-4 right-4">
          <Timer
            seconds={timeLeft}
            isActive={isTimerActive}
            variant="light"
            onStartOver={resetTimer}
            onComplete={resetTimer}
          />
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="h-[100dvh] max-w-lg mx-auto bg-white shadow-2xl overflow-hidden">
        <div className="flex flex-col h-full items-center justify-center p-8">
          <div className="w-16 h-16 border-4 border-[#06C167] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xl text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (retryPayment || (error && !orderData)) {
    return (
      <div className="h-[100dvh] max-w-lg mx-auto bg-white shadow-2xl overflow-hidden">
        <div className="flex flex-col h-full items-center justify-center p-8">
          <div className="w-16 h-16 text-red-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p className="text-xl text-red-600 text-center mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#06C167] text-white rounded-lg hover:bg-[#05a057] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] max-w-lg mx-auto bg-white shadow-2xl overflow-hidden">
      {renderTimer()}
      {currentScreen === 'payment' && renderPaymentScreen()}
      {currentScreen === 'processing' && renderProcessingScreen()}
      {currentScreen === 'confirmation' && renderConfirmationScreen()}
    </div>
  );
}
