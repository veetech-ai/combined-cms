import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CartItem } from './CartItem';
import { CustomerDetailsModal } from './CustomerDetailsModal';
import { PaymentModal } from './PaymentModal';
import { FeedbackModal } from './FeedbackModal';
import { DiscountModal } from './DiscountModal';
import { useCartStore } from '../stores/cartStore';
import { useMenuStore } from '../stores/menuStore';
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams


interface CartSectionProps {
  onStartOver: () => void;
}

export function CartSection({ onStartOver }: CartSectionProps) {
  const { t } = useTranslation();
  const {
    items,
    customerName,
    removeItem,
    updateQuantity,
    updateInstructions,
    setCustomerInfo,
    setPhoneDiscount,
    setDiscountCode,
    clearCart,
    getDiscountedTotal,
    isEligibleForPhoneDiscount
  } = useCartStore();

  const menuItems = useMenuStore((state) => state.menuItems);
  const [discountCode, setLocalDiscountCode] = useState('');

  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [showDiscountDialog, setShowDiscountDialog] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  const handleStartOrder = () => {
    // Navigate to the `/kiosk` route relative to the current route
    navigate(`/kiosk/${id}/details`); // This will resolve to `/kiosk/${id}/kiosk`
  };

  const getItemTotal = (item: CartItem) => {
    let total = item.price;
    
    try {
      const instructions = JSON.parse(item.instructions);
      if (instructions.addOns) {
        instructions.addOns.forEach((addOn: any) => {
          total += addOn.price / 100; // Convert cents to dollars
        });
      }
    } catch (e) {
      //console.error('Error parsing item instructions:');
    }
    
    return total * item.quantity;
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + getItemTotal(item), 0);
  };

  const { subtotal, phoneDiscountAmount, couponDiscountAmount, total } = 
    getDiscountedTotal(calculateSubtotal());

  const [orderDetails, setOrderDetails] = useState();

  const handleCustomerSubmit = (name: string, phone: string, order: any) => {
    setCustomerInfo(name, phone);
    setShowCustomerDetails(false);
    setOrderDetails(order);
  
    if (isEligibleForPhoneDiscount(phone)) {
      setShowDiscountDialog(true);
    } else {
      setShowPaymentDialog(true);
    }
  };

  const handleDiscountResponse = (accepted: boolean) => {
    setShowDiscountDialog(false);
    setPhoneDiscount(accepted);
    setShowPaymentDialog(true);
  };

  const handlePaymentComplete = () => {
    setShowPaymentDialog(false);
    setShowFeedbackDialog(true);
  };

  const handleFeedbackComplete = () => {
    setShowFeedbackDialog(false);
    clearCart();
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      setError(t('errors.emptyCart'));
      return;
    }
    if (total < 0.01) {
      setError(t('errors.invalidAmount'));
      return;
    }
    setError('');
    setShowCustomerDetails(true);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm flex flex-col h-full"
      role="complementary"
      aria-label={t('cart.title')}
    >
      {/* Cart Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold text-neutral-800">
          {t('cart.title')}
        </h2>
      </div>

      {/* Cart Items - Scrollable Area */}
      <div className="flex-1 overflow-y-auto min-h-0 p-4">
        <div className="space-y-2">
          {items.map((item) => {
            const menuItem = menuItems.find((i) => i.id === item.id);
            return (
              <CartItem
                key={item.cartId}
                {...item}
                imageUrl={menuItem?.imageUrl || ''}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
                onUpdateInstructions={updateInstructions}
                category={menuItem?.category}
              />
            );
          })}
          {items.length === 0 && (
            <div className="text-center py-8">
              <p className="text-neutral-400">{t('cart.empty')}</p>
              <p className="text-sm text-neutral-400 mt-2">
                {t('cart.addItems')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-4 py-2 bg-black">
          <p className="text-white text-sm">{error}</p>
        </div>
      )}

      {/* Cart Footer */}
      <div className="p-4 border-t bg-neutral-50">
        <div className="mb-4">
          <label
            htmlFor="discountCode"
            className="block text-sm font-medium text-neutral-600 mb-1"
          >
            {t('cart.discountCode')}
          </label>
          <input
            type="text"
            id="discountCode"
            value={discountCode}
            onChange={(e) => {
              setLocalDiscountCode(e.target.value.toUpperCase());
              setDiscountCode(e.target.value.toUpperCase());
            }}
            placeholder={t('cart.enterCode')}
            className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          />
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span>{t('cart.subtotal')}:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {phoneDiscountAmount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>{t('cart.phoneDiscount')}:</span>
              <span>-${phoneDiscountAmount.toFixed(2)}</span>
            </div>
          )}
          {couponDiscountAmount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>{t('cart.couponDiscount')}:</span>
              <span>-${couponDiscountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold pt-2 border-t">
            <span>{t('cart.total')}:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={handleStartOrder}
          disabled={items.length === 0 || total < 0.01}
          className={`w-full py-3 text-base font-semibold rounded-lg transition-all duration-300 ${
            items.length > 0 && total >= 0.01
              ? 'bg-black hover:bg-primary/90 text-white shadow-lg hover:shadow-xl'
              : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
          }`}
        >
          {items.length === 0
            ? t('cart.cartEmpty')
            : total < 0.01
            ? t('cart.invalidAmount')
            : t('cart.checkout')}
        </button>
      </div>

      {/* Modals */}
      {/* <CustomerDetailsModal
        isOpen={showCustomerDetails}
        onClose={() => setShowCustomerDetails(false)}
        onStartOver={onStartOver}
        onSubmit={handleCustomerSubmit}
      /> */}

      <DiscountModal
        isOpen={showDiscountDialog}
        onResponse={handleDiscountResponse}
      />

      {/* <PaymentModal
        isOpen={showPaymentDialog}
        onClose={() => setShowPaymentDialog(false)}
        onComplete={handlePaymentComplete}
        customerName={customerName}
        total={total}
        orderDetails={orderDetails}
        onStartOver={onStartOver}
        
      />

      <FeedbackModal
        isOpen={showFeedbackDialog}
        onComplete={handleFeedbackComplete}
        onStartOver={onStartOver}
      /> */}
    </div>
  );
}
