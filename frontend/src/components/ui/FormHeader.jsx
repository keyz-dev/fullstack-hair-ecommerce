import React from "react";

const FormHeader = ({ title, description }) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
      <p className="text-secondary">{description}</p>
    </div>
  );
};

export default FormHeader;
