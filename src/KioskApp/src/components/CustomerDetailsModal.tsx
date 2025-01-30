import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '../stores/cartStore';
import { createCloverOrder } from '../api/clover';
import { toast } from 'react-hot-toast';

interface CustomerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, phone: string) => void;
}

export function CustomerDetailsModal({ isOpen, onClose, onSubmit }: CustomerDetailsModalProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { items } = useCartStore();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/\D/g, '');
    let formattedValue = '';
    if (numericValue.length > 0) {
      formattedValue = numericValue.match(/.{1,3}/g)?.join('-') || numericValue;
      if (numericValue.length > 3) {
        formattedValue = `(${formattedValue.slice(0, 3)}) ${formattedValue.slice(4)}`;
      }
    }
    setPhone(formattedValue);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error(t('errors.nameRequired'));
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      toast.error(t('errors.invalidPhone'));
      return;
    }

    if (items.length === 0) {
      toast.error(t('errors.emptyCart'));
      return;
    }

    setIsSubmitting(true);
    try {
      // Create order directly in Clover
      const orderNote = `Customer: ${name} | Phone: ${phone}`;
      console.log('Creating Clover order with items:', items);
      const order = await createCloverOrder(items, orderNote);
      
      if (!order) {
        throw new Error('Failed to create order in Clover');
      }

      console.log('Order created successfully:', order);
      toast.success('Order created successfully!');

      // Proceed with payment flow
      onSubmit(name, phone);
      setName('');
      setPhone('');
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process checkout');
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2">{t('cart.almostThere')}</h2>
              <p className="text-gray-600 text-sm mb-4">
                {t('cart.phoneNotification')}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('cart.name')}
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder={t('cart.enterName')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('cart.phone')}
                </label>
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder={t('cart.enterPhone')}
                  value={phone}
                  onChange={handlePhoneChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                  maxLength={14}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition"
                disabled={isSubmitting}
              >
                {t('cart.cancel')}
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('common.processing')}
                  </>
                ) : (
                  <>
                    {t('cart.continueToPayment')}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}