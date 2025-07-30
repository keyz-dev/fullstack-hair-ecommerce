import React, { useState } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const errors = {
    email: "",
  };

  return (
    <div className="min-h-fit flex items-center justify-center">
      <form className="p-2 md:p-8 max-w-lg w-full mx-auto flex flex-col gap-3 items-center">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-primary mt-2 mb-4">
            Forgot Password
          </h1>
        </div>
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChangeHandler={handleChange}
          error={errors.email}
          placeholder="Enter your email"
          required
        />

        <Button type="submit" id="forgot-password-btn" additionalClasses="primarybtn min-w-fit mt-4 w-fit">
          Send Reset Link
        </Button>
      </form>
    </div>
  );
};

export default ForgotPassword;
