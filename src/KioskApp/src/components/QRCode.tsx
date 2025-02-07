import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface QRCodeProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onBack: () => void;
  orderDetail: { id: string; note: string; total: number };
}

export default function QRCode({
  isOpen,
  onClose,
  amount,
  onBack,
  orderDetail
}: QRCodeProps) {
  const [timeLeft, setTimeLeft] = useState(60);
  const [orderData, setOrderData] = useState<any>();

  useEffect(() => {
    const obj = {
      orderId: orderDetail.id,
      note: orderDetail.note,
      amount: orderDetail.total
    };

    setOrderData(obj);
  }, [orderDetail]);

  useEffect(() => {
    if (isOpen && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen, timeLeft]);

  if (!isOpen) return null; // Don't render if modal is closed

  // Stringify the order data and then URL encode it
  const paymentData = encodeURIComponent(
    JSON.stringify({
      orderId: orderData?.orderId,
      note: orderData?.note,
      amount: orderData?.amount
    })
  );

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <div className="flex flex-col items-center">
          <div className="bg-black p-4 rounded-full mb-4">
            <span className="text-black text-3xl">📱</span>
          </div>
          <h2 className="text-lg font-semibold">Scan to Pay</h2>
          <p className="text-black font-semibold text-xl">
            Amount to Pay: ${amount.toFixed(2)}
          </p>
          <div className="bg-gray-100 p-4 rounded-lg mt-4 relative flex items-center justify-center">
            <img
              // Use the dynamically created and URL encoded data for the QR code
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${paymentData}`}
              alt="QR Code"
              className="w-40 h-40"
            />
            <Loader2 className="absolute top-2 right-2 text-black animate-spin" />
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
