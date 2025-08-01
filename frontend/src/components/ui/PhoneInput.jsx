import React from "react";
import PhoneInputWithCountry from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "./PhoneInput.css";

const PhoneInput = ({
  label,
  name,
  id,
  placeholder,
  additionalClasses = "",
  disabled = false,
  required = true,
  onChangeHandler,
  labelClasses = "",
  value,
  error,
  autoFocus = false,
  onFocusHandler,
  onBlurHandler,
  ...props
}) => {
  // If label is a string and required, append a red asterisk unless already present
  let labelContent = label;
  if (label && typeof label === "string" && required && !/\*/.test(label)) {
    labelContent = (
      <>
        {label} <span className="text-red-500">*</span>
      </>
    );
  }

  const handleChange = (phoneNumber) => {
    // Create a synthetic event object to match the expected onChangeHandler signature
    const syntheticEvent = {
      target: {
        name,
        value: phoneNumber || "",
      },
    };
    onChangeHandler(syntheticEvent);
  };

  return (
    <div className="w-full flex flex-col">
      {label && (
        <label
          htmlFor={id}
          className={`block transition-all duration-300 transform text-base font-medium text-black z-0 px-2 ${labelClasses}`}
        >
          {labelContent}
        </label>
      )}
      <div className="relative">
        <PhoneInputWithCountry
          international
          countryCallingCodeEditable={false}
          defaultCountry="CM"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
          className={`phone-input-custom focus:ring-2 focus:ring-accent  ${additionalClasses} ${
            error ? "phone-input-error" : ""
          }`}
          {...props}
        />
      </div>
      {error && <p className="text-error text-xs mt-1">{error}</p>}
    </div>
  );
};

export default PhoneInput; 