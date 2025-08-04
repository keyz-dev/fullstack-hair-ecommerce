import React from "react";
import Loader from "./Loader";

const Button = ({
  additionalClasses = "",
  type = "button",
  id = "",
  leadingIcon = null,
  trailingIcon = null,
  text = null,
  onClickHandler = null,
  isDisabled,
  isLoading,
  children,
  props,
}) => {
  const baseButtonStyles = "btn flexbox gap-2 cursor-pointer disabled:cursor-not-allowed";
  const disabledStyles =
    "opacity-50 bg-gray-300 cursor-not-allowed text-secondary";
  const loadingStyles =
    "relative text-transparent transition-none hover:text-transparent";

  const buttonClasses = [
    baseButtonStyles,
    isDisabled || isLoading ? disabledStyles : "",
    isLoading ? loadingStyles : "",
    additionalClasses,
  ].join(" ");

  return (
    <button
      id={id}
      className={buttonClasses}
      type={type}
      onClick={onClickHandler}
      disabled={isDisabled || isLoading}
      {...props}
    >
      {leadingIcon && (
        <span className="inlinebox">
          {leadingIcon}
        </span>
      )}
      {children}
      {text}
      {trailingIcon && (
        <span className="inlinebox">
          {trailingIcon}
        </span>
      )}
      {isLoading && <Loader />}
    </button>
  );
};

export default Button;
