import { removeEmojis } from "./sanitize";

export const isValidCMNumber = (number) => {
  if (!/^(?:\+?\d+|00\d+)$/.test(number)) return false;
  return true;
};

export const validateRegisterForm = (formData, setErrors) => {
  const newErrors = {};
  // Sanitize all text fields
  const sanitized = {
    fullName: removeEmojis(formData.fullName || ""),
    email: removeEmojis(formData.email || ""),
    phone: removeEmojis(formData.phone || ""),
    password: removeEmojis(formData.password || ""),
    confirmPassword: removeEmojis(formData.confirmPassword || ""),
  };
  if (!sanitized.fullName.trim()) newErrors.fullName = "Full Name is required";
  if (!sanitized.email.trim()) newErrors.email = "Email is required";
  if (!sanitized.phone.trim()) newErrors.phone = "Phone Number is required";
  if (!sanitized.password) newErrors.password = "Password is required";
  if (!sanitized.confirmPassword)
    newErrors.confirmPassword = "Confirm Password is required";
  if (sanitized.password && sanitized.password.length < 5)
    newErrors.password = "Password must be at least 5 characters long";
  if (sanitized.password !== sanitized.confirmPassword)
    newErrors.confirmPassword = "Passwords do not match";
  const phone = sanitized.phone.replace(/\s+/g, ""); // Remove spaces
  if (!phone) {
    newErrors.phone = "Phone Number is required";
  } else if (!isValidCMNumber(phone)) {
    newErrors.phone = "Phone number must start with 6, 2376, or +2376";
  }
  // Block emojis (edge case)
  Object.keys(sanitized).forEach((key) => {
    if (sanitized[key] !== formData[key]) {
      newErrors[key] = "Emojis are not allowed";
    }
  });
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

export const validateLocationForm = (agencyCreationData, coordinates) => {
  const newErrors = {
    headAddress: "",
    coordinates: "",
  };

  let isValid = true;

  // Sanitize address
  const sanitizedAddress = removeEmojis(agencyCreationData.headAddress || "");
  if (!sanitizedAddress.trim()) {
    newErrors.headAddress = "Headquarters address is required";
    isValid = false;
  }

  if (!coordinates) {
    newErrors.coordinates = "Please select a valid address with coordinates";
    isValid = false;
  }

  // Block emojis (edge case)
  if (sanitizedAddress !== agencyCreationData.headAddress) {
    newErrors.headAddress = "Emojis are not allowed";
    isValid = false;
  }

  return isValid;
};
