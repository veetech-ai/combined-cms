import React, { useEffect, useState } from 'react';
import './CloverPayment.css'; // Create this CSS file

declare global {
  interface Window {
    Clover: {
      new (merchantId: string, config: CloverConfig): CloverInstance;
    };
  }
}

interface CloverConfig {
  // environment: 'sandbox' | 'production';
  // tokenizationKey: string;
  merchantId: string;
  // paymentMethods?: ('card' | 'google_pay' | 'apple_pay')[];
  // style?: {
  //   theme?: 'light' | 'dark';
  // };
}

interface CloverInstance {
  elements: () => any;
  createToken: () => Promise<{ token: string }>;
  // createPaymentToken: () => Promise<{ token: string }>;
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

        // Use TEST credentials
        // const clover = new window.Clover('04750d1c04d58c8b1e4e5be9dc3ae37f', {
        //   merchantId: 'RCTSTAVI0010002',
        //   environment: 'sandbox', // Change to 'sandbox' for testing
        //   tokenizationKey: '04750d1c04d58c8b1e4e5be9dc3ae37f', // Use sandbox tokenization key
        //   paymentMethods: ['card', 'apple_pay', 'google_pay'],
        //   style: {
        //     theme: 'dark'
        //   }
        // });

        // const clover = new window.Clover('04750d1c04d58c8b1e4e5be9dc3ae37f', {
        //   merchantId: 'RCTSTAVI0010002'
        //   // environment: 'sandbox', // Change to 'sandbox' for testing
        //   // tokenization
        // });

        const clover = new window.Clover('62862dc628972e7b4e7fbffd18ab0cdb', {
          merchantId: 'PSK40XM0M8ME1'
          // environment: 'sandbox', // Change to 'sandbox' for testing
          // tokenization
        });

        const elements = clover.elements();

        const cardNumber = elements.create('CARD_NUMBER');
        const cardDate = elements.create('CARD_DATE');
        const cardCvv = elements.create('CARD_CVV');
        const cardPostal = elements.create('CARD_POSTAL_CODE');

        cardNumber.mount('#card-number-element');
        cardDate.mount('#card-date-element');
        cardCvv.mount('#card-cvv-element');
        cardPostal.mount('#card-postal-element');

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

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
};

export default CloverPaymentForm;
