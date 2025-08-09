import React from "react";
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";

const ValidationOverlay = ({ validationState, showConfidence = false }) => {
  const { status, isValid, confidence, message } = validationState;

  const getOverlayContent = () => {
    switch (status) {
      case "validating":
        return (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-sm">
            <div className="text-center text-white">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
              <p className="text-xs font-medium">Validating...</p>
            </div>
          </div>
        );

      case "completed":
        if (isValid) {
          return null;
        } else {
          return (
            <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center rounded-sm">
              <div className="text-center text-red-700">
                <XCircle className="w-6 h-6 mx-auto mb-1" />
                <p className="text-xs font-medium">Invalid</p>
                <p className="text-xs opacity-75 max-w-[80px] leading-tight">
                  {message}
                </p>
              </div>
            </div>
          );
        }

      case "error":
        return (
          <div className="absolute inset-0 bg-orange-500/20 flex items-center justify-center rounded-sm">
            <div className="text-center text-orange-700">
              <AlertCircle className="w-6 h-6 mx-auto mb-1" />
              <p className="text-xs font-medium">Error</p>
              <p className="text-xs opacity-75 max-w-[80px] leading-tight">
                Validation failed
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return <>{getOverlayContent()}</>;
};

export default ValidationOverlay;
