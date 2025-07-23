import { useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks";
import { Input, Button } from "../../components/ui";
import { removeEmojis } from "../../utils/sanitize";

const Login = () => {
  const { login, setAuthError, handleGoogleLogin, loading, authError } =
    useAuth();
  const navigate = useNavigate();
  const { from } = useLocation().state || { from: "/" };
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: removeEmojis(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sanitizedData = {
      email: removeEmojis(formData.email),
      password: removeEmojis(formData.password),
    };
    try {
      const res = await login(sanitizedData.email, sanitizedData.password);
      if (res.success) {
        const { user } = res;
        navigate("/verify-account", {
          state: { email: user.email, from: from },
        });
      }
    } catch (error) {
      setAuthError(error.response?.data?.error || error.message);
    }
  };

  return (
    <div className="container mx-auto max-w-md px-4 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary dark:text-white">Welcome back</h1>
        <p className="mt-2 text-secondary dark:text-white text-muted-foreground">
          Sign in to your account to continue
        </p>
      </div>
      {authError && (
        <div className="rounded-xs bg-error-bg-light p-4 my-4">
          <p className="text-sm text-error text-center">{authError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChangeHandler={handleChange}
          placeholder="Enter your email"
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChangeHandler={handleChange}
          placeholder="Enter your password"
          required
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="remember"
              className="ml-2 block text-sm text-gray-900"
            >
              Remember me
            </label>
          </div>

          <RouterLink
            to="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Forgot password?
          </RouterLink>
        </div>

        <Button
          type="submit"
          id="register-btn"
          additionalClasses="w-full mt-6 primarybtn"
          isLoading={loading}
        >
          Login
        </Button>

        <p className="text-center text-sm text-secondary mt-2">
          Don't have an account?{" "}
          <RouterLink to="/register" className="text-accent hover:underline">
            Register here
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

export default Login;
