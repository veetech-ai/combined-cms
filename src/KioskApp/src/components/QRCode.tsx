import { useState, useEffect } from 'react';

interface QRCodeProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number; // Added to make amount dynamic
  orderId: string; // Added to accept order ID
  orderNote: string; // Added to accept order note
  onBack: () => void;
}

export default function QRCode({
  isOpen,
  onClose,
  amount,
  orderId, // Accept order ID as a prop
  orderNote, // Accept order note as a prop
  onBack
}: QRCodeProps) {
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (isOpen && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen, timeLeft]);

  if (!isOpen) return null; // Fix: Don't render if modal is closed

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold">Scan to Pay</h2>
          <p className="text-red-500 font-semibold text-xl">
            Amount to Pay: ${amount.toFixed(2)}
          </p>
          <p className="text-gray-500 font-semibold text-lg">
            Order ID: {orderId} {/* Display Order ID */}
          </p>
          <div className="bg-gray-100 p-4 rounded-lg mt-4 relative flex items-center justify-center">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=payment-link/${orderId}&note=${encodeURIComponent(orderNote)}`} // Use order ID and note in the payment link
              alt="QR Code"
              className="w-40 h-40"
            />
          </div>
          <p className="text-gray-500 mt-2">Time Remaining: {timeLeft}s</p>
          <p className="text-gray-500 text-sm">
            Open your camera app and scan the QR code
          </p>
          <div className="flex gap-2 mt-4 w-full">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex-1"
              onClick={onClose}
            >
              I Have Paid
            </button>
            <button
              className="border border-gray-300 px-4 py-2 rounded-lg flex-1"
              onClick={onBack}
            >
              Change Payment Method
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
