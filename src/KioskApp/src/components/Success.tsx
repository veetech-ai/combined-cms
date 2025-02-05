import { useState } from "react";
import { BackButton } from "./ui/BackButton";
import { Timer } from "./ui/Timer";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useCartStore } from '../stores/cartStore';


export function Success() {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    clearCart,
  } = useCartStore();

  const handleGotIt = () => {
    navigate(`/kiosk/${id}/feedback`);
  };

  const handleClose = () => {
    navigate(-1);
  };

  const handleStartOver = () => {
    clearCart();
    navigate(`/kiosk/${id}`);
  };

  return (
    <div className="fixed inset-0 bg-white">
      <div className="h-full flex flex-col">
        <div className="flex items-center p-8">
          <BackButton onClick={handleClose} />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4 text-green-600">
              Payment Success!
            </h2>
            <p className="text-xl mb-12">We’ll notify you when your order is ready.</p>

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
    </div>
  );
}

export default Success;
