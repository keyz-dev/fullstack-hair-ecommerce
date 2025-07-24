import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks";
import { Input, Button, FileUploader } from "../../components/ui";
import { validateRegisterForm } from "../../utils/validateForm";
import { normalizeNumber } from "../../utils/normalizePhone";

const Register = () => {
  const navigate = useNavigate();
  const { register, loading, handleGoogleLogin, authError, setAuthError } =
    useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "+237 6",
    password: "",
    confirmPassword: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateRegisterForm(formData, setErrors)) return;
    setErrors({});
    try {
      const registrationData = { ...formData };
      delete registrationData.confirmPassword;
      registrationData.phone = normalizeNumber(registrationData.phone);
      const { success, user } = await register({ ...registrationData, avatar });
      if (success) {
        navigate("/verify-account", { state: { email: user.email } });
      }
    } catch (error) {
      setAuthError(
        error.response?.data?.message || "An error occurred during registration"
      );
    }
  };

  return (
    <div className="min-h-fit flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="p-2 md:p-8 max-w-lg w-full mx-auto flex flex-col"
        autoComplete="off"
        encType="multipart/form-data"
      >
        <div className="flex flex-col items-center">
          {/* <Logo />
          <span className="text-primary font-bold text-lg mt-2 mb-1">OmniBuzz</span> */}
          <h1 className="text-2xl font-bold text-primary dark:text-white mt-2 mb-4">
            Create Your Account
          </h1>
        </div>
        {errors.submit && (
          <div className="rounded-xs bg-error-bg-light dark:bg-error-bg-dark p-4 my-4">
            <p className="text-sm text-error dark:text-error-text-dark text-center">{errors.submit}</p>
          </div>
        )}
        {authError && (
          <div className="rounded-xs bg-error-bg-light dark:bg-error-bg-dark p-4 my-4">
            <p className="text-sm text-error dark:text-error-text-dark text-center">{authError}</p>
          </div>
        )}
        <div className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            placeholder="Enter your full name"
            error={errors.name}
            onChangeHandler={handleChange}
            required
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            placeholder="Enter your email"
            error={errors.email}
            onChangeHandler={handleChange}
            required
          />
          <Input
            label="Phone Number"
            name="phone"
            value={formData.phone}
            placeholder="+2376XXXXXXXXX"
            error={errors.phone}
            onChangeHandler={handleChange}
            required
          />
        </div>
        <div className="flex flex-col-reverse sm:flex-row mt-4 gap-4">
          {/* Avatar Upload */}
          <FileUploader
            preview={avatarPreview}
            onChange={(file) => {
              setAvatar(file);
              setAvatarPreview(URL.createObjectURL(file));
            }}
          />
          {/* Password Fields */}
          <div className="flex flex-col gap-4 flex-1">
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              placeholder="Enter password"
              error={errors.password}
              onChangeHandler={handleChange}
              required
            />
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              placeholder="Confirm password"
              error={errors.confirmPassword}
              onChangeHandler={handleChange}
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          id="register-btn"
          additionalClasses="w-full mt-6 primarybtn"
          isLoading={loading}
        >
          Create Account
        </Button>

        <p className="text-center text-sm text-secondary mt-2">
          Already have an account?{" "}
          <RouterLink to="/login" className="text-accent hover:underline">
            Login here
          </RouterLink>
        </p>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="mx-2 text-gray-400 text-sm">Or</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <Button
          type="button"
          onClickHandler={handleGoogleLogin}
          isLoading={loading}
          id="google-signIn"
          additionalClasses="w-full flex items-center justify-center border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </Button>
      </form>
    </div>
  );
};

export default Register;
