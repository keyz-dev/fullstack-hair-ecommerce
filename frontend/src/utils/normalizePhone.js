import { parsePhoneNumber, isValidPhoneNumber, getCountryCallingCode } from 'libphonenumber-js';

// Normalize phone number to international format
export const normalizeNumber = (phoneNumber) => {
  if (!phoneNumber) return null;
  
  try {
    // Remove any existing formatting
    const cleanNumber = phoneNumber.replace(/\s+/g, "");
    
    // If it's already a valid international number, return it
    if (isValidPhoneNumber(cleanNumber)) {
      const parsed = parsePhoneNumber(cleanNumber);
      return parsed.format('E.164'); // Returns +1234567890 format
    }
    
    // Legacy support for Cameroon numbers
    if (cleanNumber.startsWith("6")) {
      return `+237${cleanNumber}`;
    } else if (cleanNumber.startsWith("2376")) {
      return `+${cleanNumber}`;
    } else if (cleanNumber.startsWith("+237 6")) {
      return cleanNumber.replace("+237 ", "+237");
    }
    
    return cleanNumber;
  } catch {
    return phoneNumber;
  }
};

// Validate phone number
export const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return { isValid: false, error: "Phone number is required" };
  
  try {
    if (isValidPhoneNumber(phoneNumber)) {
      const parsed = parsePhoneNumber(phoneNumber);
      return { 
        isValid: true, 
        country: parsed.country,
        countryCode: parsed.countryCallingCode,
        nationalNumber: parsed.nationalNumber,
        international: parsed.format('E.164')
      };
    } else {
      return { isValid: false, error: "Invalid phone number format" };
    }
  } catch {
    return { isValid: false, error: "Invalid phone number" };
  }
};

// Format phone number for display
export const formatPhoneNumber = (phoneNumber, format = 'NATIONAL') => {
  if (!phoneNumber) return '';
  
  try {
    if (isValidPhoneNumber(phoneNumber)) {
      const parsed = parsePhoneNumber(phoneNumber);
      return parsed.format(format);
    }
    return phoneNumber;
  } catch {
    return phoneNumber;
  }
};

// Get country calling code
export const getCountryCode = (country) => {
  try {
    return getCountryCallingCode(country);
  } catch {
    return null;
  }
};
