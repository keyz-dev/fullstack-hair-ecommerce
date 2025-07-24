import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Logo } from "../../components/ui";
import { useAuth } from "../../hooks";
import { CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";

const CODE_LENGTH = 6;
const REDIRECT_DELAY = 2000; // 3 seconds delay

const VerifyAccount = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const origin = location.state?.origin || null;
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(null); // null: default, true: valid, false: invalid
  const [showSuccess, setShowSuccess] = useState(false);
  const { verifyAccount, loading, resendVerification, redirectBasedOnRole } =
    useAuth();

  if (!email) {
    navigate("/");
    return;
  }
  // Check if all code entries are filled
  const isCodeComplete = code.every((digit) => digit !== "");

  // Handle input change for each code box
  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (!val) return;
    const newCode = [...code];
    newCode[idx] = val[0];
    setCode(newCode);
    setIsValid(null); // Reset validation state on new input
    // Move to next input
    if (idx < CODE_LENGTH - 1 && val) {
      document.getElementById(`code-input-${idx + 1}`).focus();
    }
  };

  // Handle paste event
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, CODE_LENGTH);
    if (pastedData.length === 0) return;

    const newCode = [...code];
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }
    setCode(newCode);
    setIsValid(null); // Reset validation state on paste

    // Focus the next empty input or the last input
    const nextEmptyIndex = newCode.findIndex((digit) => !digit);
    const focusIndex = nextEmptyIndex === -1 ? CODE_LENGTH - 1 : nextEmptyIndex;
    document.getElementById(`code-input-${focusIndex}`).focus();
  };

  // Handle backspace to move to previous input
  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      document.getElementById(`code-input-${idx - 1}`).focus();
    }
  };

  // Submit code
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const codeStr = code.join("");
      const res = await verifyAccount(email, codeStr, origin);

      if (res.success) {
        setIsValid(true);
        setShowSuccess(true);
        // Delay redirection to show success state
        setTimeout(() => {
          if (location.state?.from && location.state.from !== "/") {
            navigate(location.state.from);
          } else {
            redirectBasedOnRole(res.user);
          }
        }, REDIRECT_DELAY);
      } else {
        setIsValid(false);
        setError(res.error);
      }
    } catch (err) {
      setIsValid(false);
      setError(
        err.response?.data?.message || "Verification failed. Please try again."
      );
    }
  };

  // Resend code
  const handleResend = async () => {
    setError("");
    setIsValid(null);
    try {
      const res = await resendVerification(email);
      if (res.success) {
        toast.success("A new code has been sent to your email.");
      } else {
        toast.error("Failed to resend code. Please try again later.");
      }
    } catch {
      toast.error("Failed to resend code. Please try again later.");
    }
  };

  // Get input styling based on validation state
  const getInputStyle = () => {
    if (isValid === null) {
      return "border-line_clr bg-white hover:border-gray-300";
    }
    return isValid
      ? "border-success bg-success-bg-light text-success"
      : "border-error bg-error-bg-light text-error";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="max-w-md w-full p-8 flex flex-col items-center">
        {/* Bus icon */}
        <div className="mb-4">
          {/* Replace with your SVG or logo */}
          <Logo vertical={true} />
        </div>
        <h2 className="text-2xl font-semibold text-center mb-2">
          Verify Your Account
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Enter the code sent to{" "}
          <span className="font-medium">
            {email.replace(/(.{2}).+(@.+)/, "$1*****$2")}
          </span>
        </p>
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center"
        >
          <div className="flex gap-3 mb-4">
            {code.map((digit, idx) => (
              <input
                key={idx}
                id={`code-input-${idx}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className={`w-12 h-12 text-2xl text-center border-2 rounded-sm focus:outline-none transition-all duration-200 ${getInputStyle()}`}
                value={digit}
                onChange={(e) => handleChange(e, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                onPaste={handlePaste}
                autoFocus={idx === 0}
                disabled={showSuccess}
              />
            ))}
          </div>
          {error && <p className="text-error text-sm mb-2">{error}</p>}
          {showSuccess && (
            <div className="flex items-center gap-2 text-green-600 mb-2 animate-fade-in">
              <CheckCircle2 className="w-5 h-5" />
              <span>Verification successful! Redirecting...</span>
            </div>
          )}
          <div className="mb-6 text-center text-gray-500 text-sm">
            Didn't receive the email?{" "}
            <button
              type="button"
              className="text-accent font-medium hover:underline"
              onClick={handleResend}
              disabled={loading || showSuccess}
            >
              Click to resend
            </button>
          </div>
          <div className="flex w-full gap-5 justify-center">
            <Button
              type="button"
              additionalClasses="w-32 bg-white border border-gray-300 text-gray-700"
              onClick={() => navigate(-1)}
              disabled={loading || showSuccess}
            >
              Back
            </Button>
            <Button
              type="submit"
              additionalClasses={`w-32 ${
                isCodeComplete ? "primarybtn" : "bg-gray-300 cursor-not-allowed"
              }`}
              isLoading={loading}
              disabled={loading || showSuccess || !isCodeComplete}
            >
              Verify
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyAccount;
