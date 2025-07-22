import { isValidCMNumber } from "./validateForm";

export const validateContactForm = (contactFields, setErrors) => {
  const newErrors = {
    contactFields: "",
  };

  let isValid = true;

  if (contactFields.length === 0) {
    newErrors.contactFields = "Please add at least one contact information";
    isValid = false;
  }

  // Validate each contact field
  const contactErrors = contactFields.map((field) => {
    const error = { value: "" };

    if (!field.value.trim()) {
      error.value = `${field.label} is required`;
      isValid = false;
      return error;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    switch (field.type) {
      case "email":
        if (!emailRegex.test(field.value)) {
          error.value = "Please enter a valid email address";
          isValid = false;
        }
        break;

      case "tel":
        if (!isValidCMNumber(field.value)) {
          error.value = "Please enter a valid phone number";
          isValid = false;
        }
        break;

      case "url":
        try {
          new URL(field.value);
        } catch {
          error.value = "Please enter a valid URL";
          isValid = false;
        }
        break;
    }

    return error;
  });

  setErrors({
    ...newErrors,
    contactFields: contactErrors,
  });

  return isValid;
};
