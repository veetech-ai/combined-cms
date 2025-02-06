import { useState, useEffect } from "react";
import { BackButton } from "./ui/BackButton";
import { Timer } from "./ui/Timer";
import { motion } from "framer-motion";
import QRCode from "qrcode";
import { useNavigate, useParams } from "react-router-dom";
import googlePayLogo from "../images/image.png"; // Replace with actual Google Pay logo
import applePayLogo from "../images/apple-pay.png"; // Add Apple Pay logo image
import { useCartStore } from '../stores/cartStore';


export function PaymentModal() {
  const [qrCode, setQrCode] = useState("");
  const [step, setStep] = useState("initial");
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    clearCart,
  } = useCartStore();

  useEffect(() => {
    QRCode.toDataURL("https://payment.example.com/order/123")
      .then((url) => setQrCode(url))
      .catch((err) => console.error("Failed to generate QR code:", err));
  }, []);

  const handleGotIt = () => {
    navigate(`/kiosk/${id}/feedback`);
  };

  const handleSuccess = () => {
    navigate(`/kiosk/${id}/success`);
  };

  const handleClose = () => {
    navigate(`/kiosk/${id}/details`);
  };

  const handleStartOver = () => {
    clearCart();
    navigate(`/kiosk/${id}`);
  };

  return (
    <div className="fixed inset-0 bg-white">
      {step === "initial" && (
        <>
          <div className="flex justify-between items-start p-8">
            <BackButton onClick={handleClose} />
            <Timer
              seconds={60}
              onComplete={handleClose}
              onStartOver={handleStartOver}
            />
          </div>

          <div className="max-w-5xl mx-auto px-8">
            <div className="flex justify-around items-center">
              {/* Payment methods section */}
              <div className="flex flex-col">
                <h2 className="text-3xl font-bold mb-4">Scan to pay with</h2>
                <div className="flex items-center gap-4">
                  <img src={googlePayLogo} alt="Google Pay" className="h-32" />
                  {/* <img src={applePayLogo} alt="Apple Pay" className="h-10" /> */}
                </div>
              </div>

              {/* Clickable QR Code */}
              <div
                className="w-[200px] h-[200px] bg-white p-2 rounded-lg shadow-md cursor-pointer"
                onClick={handleSuccess}
              >
                {qrCode && (
                  <img
                    src={qrCode}
                    alt="Payment QR Code"
                    className="w-full h-full"
                  />
                )}
              </div>
            </div>

            {/* OR separator */}
            <div className="mt-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 h-px bg-gray-300" />
                <span className="text-gray-500 text-lg font-medium px-4">OR</span>
                <div className="flex-1 h-px bg-gray-300" />
              </div>

              {/* Cash/Card Payment Button */}
              <motion.button
                onClick={() => setStep("cash")}
                className="w-full h-14 bg-black text-white text-lg font-medium rounded-xl hover:bg-gray-900 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Pay by Cash or Card
              </motion.button>
            </div>
          </div>
        </>
      )}

      {step === "cash" && (
        <div className="h-full flex flex-col">
          <div className="flex items-center p-8">
            <BackButton onClick={() => setStep("initial")} />
          </div>

          <div className="flex-1 flex flex-col items-center justify-center px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-md mx-auto"
            >
              <h2 className="text-3xl font-bold mb-4">Customer,</h2>
              <p className="text-xl mb-12">Give your name at the cashier and pay.</p>

              <motion.button
                onClick={handleGotIt}
                className="w-full bg-black text-white py-4 text-xl font-medium rounded-xl hover:bg-gray-900 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Got it
              </motion.button>
            </motion.div>
          </div>

          <div className="absolute top-4 right-4">
            <Timer seconds={30} onComplete={handleClose} onStartOver={handleStartOver} />
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentModal;
