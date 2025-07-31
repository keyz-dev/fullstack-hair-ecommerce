import React from "react";

const FormHeader = ({ title, description }) => {
  return (
    <div className="text-center mb-4">
      <h1 className="text-2xl font-bold text-primary mb-2">{title}</h1>
      <p className="text-placeholder text-sm">{description}</p>
    </div>
  );
};

export default FormHeader;
