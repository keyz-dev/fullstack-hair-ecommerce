import React from "react";
import logoImg from "../../assets/logo/logo.png";

export const Logo = ({ size = 90, destination = "/" }) => {
  return (
    <a href={destination} className="grid place-items-center h-full">
      <img
        src={logoImg}
        alt="Logo"
        className="object-center object-contain inline-block"
        style={{ width: size }}
      />
    </a>
  );
};
