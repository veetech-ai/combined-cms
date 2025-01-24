import React from 'react';

interface CustomerInfoProps {
  customerName: string;
  phoneNumber: string;
  discountCode: string;
  error: string;
  onNameChange: (value: string) => void;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDiscountChange: (value: string) => void;
}

export function CustomerInfo({ 
  customerName, 
  phoneNumber, 
  discountCode,
  error, 
  onNameChange, 
  onPhoneChange,
  onDiscountChange
}: CustomerInfoProps) {
  return (
    <div className="mb-2 space-y-1">
      <input
        type="text"
        placeholder="Your Name"
        value={customerName}
        onChange={(e) => onNameChange(e.target.value)}
        className="w-full p-1 border rounded text-sm"
      />
      <input
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={onPhoneChange}
        className="w-full p-1 border rounded text-sm"
        maxLength={14}
      />
      <input
        type="text"
        placeholder="Discount Code"
        value={discountCode}
        onChange={(e) => onDiscountChange(e.target.value)}
        className="w-full p-1 border rounded text-sm"
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}