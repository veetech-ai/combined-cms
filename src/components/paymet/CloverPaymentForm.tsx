import React, { useEffect, useState } from 'react';
import './CloverPayment.css';

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
}

const CloverPaymentForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cloverInstance, setCloverInstance] = useState<CloverInstance | null>(
    null
  );

  useEffect(() => {
    const initializeClover = async () => {
      try {
        if (!window.Clover) {
          throw new Error('Clover SDK not loaded');
        }

        if (document.getElementById('card-number-element')?.children.length) {
          return;
        }

        const clover = new window.Clover('62862dc628972e7b4e7fbffd18ab0cdb', {
          merchantId: 'PSK40XM0M8ME1'
        });

        // test merchant credentials
        // const clover = new window.Clover('04750d1c04d58c8b1e4e5be9dc3ae37f', {
        //   merchantId: 'RCTSTAVI0010002'
        // });

        const elements = clover.elements();

        // Create Card Elements
        const cardNumber = elements.create('CARD_NUMBER');
        const cardDate = elements.create('CARD_DATE');
        const cardCvv = elements.create('CARD_CVV');
        const cardPostal = elements.create('CARD_POSTAL_CODE');

        cardNumber.mount('#card-number-element');
        cardDate.mount('#card-date-element');
        cardCvv.mount('#card-cvv-element');
        cardPostal.mount('#card-postal-element');

        // ✅ Google Pay Button
        const googlePayData = {
          total: {
            label: 'Total Amount',
            amount: 1 // Amount in cents (e.g., $10.99)
          },
          options: {
            button: {
              buttonType: 'short' // or 'long' for additional text
            }
          }
        };

        const googlePayButton = elements.create('PAYMENT_REQUEST_BUTTON', {
          paymentReqData: googlePayData
        });
        googlePayButton.mount('#google-pay-button');

        googlePayButton.addEventListener('paymentMethod', async (event) => {
          console.log('Google Pay token received:', event);
          console.log(
            'Google Pay token received:',
            event.detail?.tokenReceived
          );
          alert(`Google Pay Token: ${event.detail?.tokenReceived?.id}`);
        });

        // ✅ Apple Pay Button
        const applePayData = {
          total: {
            label: 'Total Amount',
            amount: 1 // Amount in cents (e.g., $10.99)
          },
          options: {
            button: {
              buttonType: 'short' // or 'long' for additional text
            }
          }
        };

        const applePayButton = elements.create(
          'PAYMENT_REQUEST_BUTTON_APPLE_PAY',
          {
            paymentReqData: applePayData
          }
        );

        applePayButton.mount('#apple-pay-button');

        applePayButton.addEventListener('paymentMethod', async (event) => {
          console.log('Apple Pay token received:', event);
          console.log('Apple Pay token received:', event.detail?.tokenReceived);
          alert(`Apple Pay Token: ${event.detail?.tokenReceived?.id}`);
        });

        setCloverInstance(clover);

        return () => {
          [cardNumber, cardDate, cardCvv, cardPostal].forEach((element) =>
            element.unmount()
          );
        };
      } catch (err) {
        console.error('Clover initialization error:', err);
        setError('Failed to initialize payment system');
      }
    };

    initializeClover();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cloverInstance) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log('Creating payment token...', cloverInstance);
      const result = await cloverInstance.createToken();
      if (result.token) {
        console.log(result.token, 'token');
        alert(`Payment Token Created: ${result.token}`);
      } else {
        console.error('Tokenization failed:', result);
        setError('Failed to create payment token. Please try again.');
      }

      // const { token } = await cloverInstance.createPaymentToken();
      console.log(result, 'token');

      // Send token to backend for processing
      alert('Payment token created! Check console for details.');
    } catch (err) {
      console.error('Payment error:', err);
      setError('Payment failed. Please check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="clover-payment-container">
      <h2>Secure Payment</h2>
      <form onSubmit={handleSubmit} className="payment-form">
        <div className="form-group">
          <label>Card Number</label>
          <div id="card-number-element" className="clover-element" />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Expiration Date</label>
            <div id="card-date-element" className="clover-element" />
          </div>

          <div className="form-group">
            <label>CVV</label>
            <div id="card-cvv-element" className="clover-element" />
          </div>
        </div>

        <div className="form-group">
          <label>Postal Code</label>
          <div id="card-postal-element" className="clover-element" />
        </div>

        {/* ✅ Google Pay Button */}
        <div id="google-pay-button" className="payment-button"></div>

        {/* ✅ Apple Pay Button */}
        <div id="apple-pay-button" className="payment-button"></div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
};

export default CloverPaymentForm;
