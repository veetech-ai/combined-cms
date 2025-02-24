import React, { useState, useEffect } from 'react';

function TestPaymentPage() {
  const [amount, setAmount] = useState(10.0);
  const [error, setError] = useState(null);
  const [cloverInstance, setCloverInstance] = useState(null);
  const [isApplePayMounted, setIsApplePayMounted] = useState(false);
  const [isGooglePayMounted, setIsGooglePayMounted] = useState(false);

  const initializePaymentButtons = async () => {
    if (!window.Clover) {
      setError("Clover SDK not loaded");
      return;
    }
    if (!cloverInstance) {
      const clover = new window.Clover("62862dc628972e7b4e7fbffd18ab0cdb", { merchantId: "PSK40XM0M8ME1" });
      setCloverInstance(clover);
    }
    const clover = cloverInstance || new window.Clover("62862dc628972e7b4e7fbffd18ab0cdb", { merchantId: "PSK40XM0M8ME1" });
    const elements = clover.elements();
    const appleContainer = document.getElementById("apple-pay-button");
    if (appleContainer && !appleContainer.querySelector("iframe") && !isApplePayMounted) {
      const applePayRequest = clover.createApplePaymentRequest({
        amount: amount * 100,
        countryCode: "US",
        currencyCode: "USD"
      });
      const applePayButton = elements.create("PAYMENT_REQUEST_BUTTON_APPLE_PAY", {
        applePaymentRequest: applePayRequest,
        sessionIdentifier: "PSK40XM0M8ME1"
      });
      applePayButton.mount("#apple-pay-button");
      setIsApplePayMounted(true);
      applePayButton.addEventListener("paymentMethod", (event) => {
        if (!event.token) {
          setError("Apple Pay failed");
        } else {
          alert("Apple Pay token: " + event.token);
        }
      });
    }
    const googleContainer = document.getElementById("google-pay-button");
    if (googleContainer && !googleContainer.querySelector("iframe") && !isGooglePayMounted) {
      const googlePayButton = elements.create("PAYMENT_REQUEST_BUTTON", {
        paymentReqData: {
          total: { label: "Total Amount", amount: amount * 100 },
          options: { button: { buttonType: "short" } }
        }
      });
      googlePayButton.mount("#google-pay-button");
      setIsGooglePayMounted(true);
      googlePayButton.addEventListener("paymentMethod", (event) => {
        if (!event.token) {
          setError("Google Pay failed");
        } else {
          alert("Google Pay token: " + event.token);
        }
      });
    }
  };

  useEffect(() => {
    initializePaymentButtons();
  }, [amount, cloverInstance]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Test Payment Page</h1>
      <p>Amount: ${amount.toFixed(2)}</p>
      <div id="apple-pay-button" style={{ margin: "20px 0" }}></div>
      <div id="google-pay-button" style={{ margin: "20px 0" }}></div>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}

export default TestPaymentPage;
