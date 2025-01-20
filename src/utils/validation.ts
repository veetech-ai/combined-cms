export const formatPhoneNumber = (value: string): string => {
  // Only remove special characters but keep + for international numbers
  return value.replace(/[^\d+]/g, '');
};

export const validatePhoneNumber = (phone: string): boolean => {
  // Basic validation: at least 10 digits, allowing + and spaces
  return phone.length >= 10 && /^[+\d\s]+$/.test(phone);
};

export const validateZipCode = (zipCode: string): boolean => {
  const zipRegex = /^\d{5}$/;
  return zipRegex.test(zipCode);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}; 