import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useGoogleLogin } from "@react-oauth/google";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
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
    // Redirect based on role
    switch (user.role) {
      case "passenger":
        navigate("/passenger");
        break;
      case "agency_admin":
        navigate("/agency/admin");
        break;
      case "station_manager":
        navigate("/agency/manager");
        break;
      case "system_admin":
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
          // Validate token with backend
          const response = await api.get("/user/verify-token");
          if (response.data.valid) {
            const { user } = response.data.data;
            setUserAndToken(user, storedToken);
          } else {
            // Token is invalid, clear everything
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
      const response = await api.post("/user/login", { email, password });
      const { user } = response.data.data;
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
      // Create FormData object
      const formData = new FormData();

      // Append all user data
      Object.keys(userData).forEach((key) => {
        if (key == "avatar" && userData[key]) {
          formData.append("avatar", userData[key]);
        } else {
          formData.append(key, userData[key]);
        }
      });

      const response = await api.post("/user/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const { user } = response.data.data;
      return { success: true, user };
    } catch (error) {
      setAuthError(
        error.response?.data?.error ||
        error.response?.data?.error?.[0]?.message ||
        error.response?.data?.message ||
        error.message ||
        "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyAccount = async (email, code, origin) => {
    setLoading(true);
    try {
      const response = await api.post("/user/verify-email", {
        email,
        code,
        origin,
      });
      const { user, token } = response.data.data;
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
      await api.post("/user/resend-verification", { email });
      return { success: true };
    } catch (error) {
      console.error("Resend verification failed:", error);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const registerAgency = async (agencyData) => {
    try {
      // TODO: Replace with actual API call
      // Mock API call
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            token: "mock-token",
            user: {
              id: "1",
              ...agencyData,
              role: "agency_admin",
            },
          });
        }, 1000);
      });

      setUserAndToken(response.user, response.token);
      navigate("/agency/admin");
      return { success: true };
    } catch (error) {
      console.error("Agency registration failed:", error);
      return {
        success: false,
        error:
          error.response?.data?.error ||
          error.response?.data?.error?.[0]?.message ||
          error.response?.data?.message ||
          error.message ||
          "Agency registration failed",
      };
    }
  };

  // Function called when user clicks "Sign in with Google"
  const handleGoogleLogin = useGoogleLogin({
    scope: "profile email openid",
    onSuccess: async (tokenResponse) => {
      const { access_token } = tokenResponse;

      // send the token to the backend.
      if (access_token) {
        try {
          const response = await api.post("/user/google-oauth", {
            access_token,
          });

          if (response.data?.data) {
            const { user, token } = response.data.data;
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

  const acceptInvitation = async (userData) => {
    setAuthError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      // Append all user data
      Object.keys(userData).forEach((key) => {
        if (key == "avatar" && userData[key]) {
          formData.append("avatar", userData[key]);
        } else {
          formData.append(key, userData[key]);
        }
      });

      const response = await api.post("/user/accept-invitation", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { user } = response.data.data;
      return { success: true, user };
    } catch (error) {
      setAuthError(
        error.response?.data?.error ||
        error.response?.data?.error?.[0]?.message ||
        error.response?.data?.message ||
        error.message ||
        "Profile completion failed"
      );
    } finally {
      setLoading(false);
    }
  };
  const value = {
    user,
    loading,
    token,
    authError,
    setLoading,
    login,
    register,
    registerAgency,
    logout,
    setAuthError,
    verifyAccount,
    resendVerification,
    setUserAndToken,
    handleGoogleLogin,
    redirectBasedOnRole,
    acceptInvitation,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
