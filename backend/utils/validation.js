/**
 * Input Validation Utilities
 */

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhoneNumber = (phone) => {
  // Accept 10-15 digit phone numbers with optional +, -, (), spaces
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

const validateCustomerData = (data) => {
  const errors = [];

  if (!data.customerName || typeof data.customerName !== 'string' || data.customerName.trim().length === 0) {
    errors.push('Customer name is required and must be a non-empty string');
  }

  if (!data.phoneNumber || typeof data.phoneNumber !== 'string') {
    errors.push('Phone number is required');
  } else if (!validatePhoneNumber(data.phoneNumber)) {
    errors.push('Phone number format is invalid');
  }

  if (!data.address || typeof data.address !== 'string' || data.address.trim().length === 0) {
    errors.push('Delivery address is required and must be a non-empty string');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateGarments = (garments) => {
  const errors = [];

  if (!Array.isArray(garments) || garments.length === 0) {
    errors.push('Garments must be a non-empty array');
    return { isValid: false, errors };
  }

  garments.forEach((garment, index) => {
    if (!garment.type || typeof garment.type !== 'string' || garment.type.trim().length === 0) {
      errors.push(`Garment ${index + 1}: type is required and must be a non-empty string`);
    }

    if (!Number.isInteger(garment.quantity) || garment.quantity <= 0) {
      errors.push(`Garment ${index + 1}: quantity must be a positive integer`);
    }

    if (typeof garment.price !== 'number' || garment.price < 0) {
      errors.push(`Garment ${index + 1}: price must be a non-negative number`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateOrderStatus = (status) => {
  const validStatuses = ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'];
  return validStatuses.includes(status);
};

const validateCreateOrderRequest = (data) => {
  const errors = [];

  const customerValidation = validateCustomerData(data);
  if (!customerValidation.isValid) {
    errors.push(...customerValidation.errors);
  }

  const garmentsValidation = validateGarments(data.garments);
  if (!garmentsValidation.isValid) {
    errors.push(...garmentsValidation.errors);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateCustomerData,
  validateGarments,
  validateOrderStatus,
  validateCreateOrderRequest,
  validatePhoneNumber
};
