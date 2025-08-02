import React from "react";

const TextArea = ({
  label = null,
  name,
  cols = 30,
  rows = 4,
  id,
  placeholder = null,
  additionalClasses = "border-transparent",
  labelClasses = "",
  value,
  onChangeHandler,
  error,
  required = false,
  props,
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

  return (
    <div className="w-full flex flex-col">
      {label && (
        <label
          htmlFor={id}
          className={`block transition-all duration-300 transform text-base font-normal text-primary z-0 px-2 ${labelClasses}`}
        >
          {labelContent}
        </label>
      )}
      <textarea
        name={name}
        id={id}
        cols={cols}
        rows={rows}
        placeholder={placeholder}
        className={`placeholder:text-xs text-primary placeholder:font-normal placeholder:text-placeholder outline-none p-2 form-input w-full bg-light_bg border-2  focus:border-accent transition-all ease-in-out duration-600 ${additionalClasses} ${
          error && "border-error"
        }`}
        value={value}
        onChange={onChangeHandler}
        {...props}
      ></textarea>
      {error && <p className="text-error text-xs mt-1">{error}</p>}
    </div>
  );
};

export default TextArea;
