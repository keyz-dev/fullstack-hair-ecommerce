import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/auth";
import { useGoogleLogin } from "@react-oauth/google";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("userData");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

  const invalidateToken = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setUser(null);
    setToken(null);
  };

  const setUserAndToken = (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userData", JSON.stringify(user));
    setUser(user);
    setToken(token);
  };

  const redirectBasedOnRole = (user) => {
    switch (user.role) {
      case "admin":
        navigate("/admin");
        break;
      default:
        navigate("/");
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
          const response = await authApi.verifyToken();
          if (response.valid) {
            const { user } = response.data;
            setUserAndToken(user, storedToken);
          } else {
            invalidateToken();
          }
        } else {
          invalidateToken();
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        invalidateToken();
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    setLoading(true);
    try {
      const response = await authApi.login(email, password);
      const { user, token } = response.data;
      setUserAndToken(user, token);
      redirectBasedOnRole(user);
      return { success: true, user };
    } catch (error) {
      setAuthError(
        error.response?.data?.error ||
        error.response?.data?.error?.[0]?.message ||
        error.response?.data?.message ||
        error.message ||
        "Invalid credentials"
      );
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setAuthError(null);
    setLoading(true);
    try {
      const response = await authApi.register(userData);
      const { user, token } = response.data;
      setUserAndToken(user, token);
      redirectBasedOnRole(user);
      return { success: true, user };
    } catch (error) {
      setAuthError(
        error.response?.data?.error ||
        error.response?.data?.error?.[0]?.message ||
        error.response?.data?.message ||
        error.message ||
        "Registration failed"
      );
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const verifyAccount = async (email, code, origin) => {
    setLoading(true);
    try {
      const response = await authApi.verifyEmail(email, code, origin);
      const { user, token } = response.data;
      setUserAndToken(user, token);
      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.response?.data?.error?.[0]?.message ||
          "Verification failed. Please try again.",
      };
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async (email) => {
    setLoading(true);
    try {
      await authApi.resendVerification(email);
      return { success: true };
    } catch (error) {
      console.error("Resend verification failed:", error);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    scope: "profile email openid",
    onSuccess: async (tokenResponse) => {
      const { access_token } = tokenResponse;
      if (access_token) {
        try {
          const response = await authApi.googleOAuth(access_token);
          if (response.data) {
            const { user, token } = response.data;
            setUserAndToken(user, token);
            setAuthError(null);
            redirectBasedOnRole(user);
          }
        } catch (error) {
          setAuthError(
            error.response?.data?.message ||
            "Google login failed. Please try again."
          );
        }
      }
    },
    onError: (error) => {
      setAuthError(error.message || "Google login failed. Please try again.");
    },
  });

  const logout = () => {
    invalidateToken();
    navigate("/");
  };

  const value = {
    user,
    loading,
    token,
    authError,
    
    setLoading,
    login,
    register,
    logout,
    setAuthError,
    verifyAccount,
    resendVerification,
    setUserAndToken,
    handleGoogleLogin,
    redirectBasedOnRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };