import React from "react";
import { Trash2, RefreshCw, CheckCircle, XCircle, Loader2 } from "lucide-react";

const ImageItem = ({
  image,
  validationStatus,
  onRemove,
  onRetry,
  isUploading,
}) => {
  const renderValidationIndicator = () => {
    switch (validationStatus) {
      case "validating":
        return (
          <div className="absolute top-2 left-2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        );
      case "valid":
        return (
          <div className="absolute top-2 left-2 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center">
            <CheckCircle className="w-4 h-4" />
          </div>
        );
      case "invalid":
        return (
          <div className="absolute top-2 left-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center">
            <XCircle className="w-4 h-4" />
          </div>
        );
      case "pending":
        return null;
      default:
        return null;
    }
  };

  const getValidationMessage = () => {
    if (image.isValid === null) {
      return "Click Upload to validate";
    }

    if (image.isValid) {
      return "Valid hair image";
    }

    const message = image.validationMessage || "Not a valid hair image";
    if (message.length > 80) {
      return message.substring(0, 80) + "...";
    }

    return message;
  };

  return (
    <div className="relative group">
      <div className="aspect-square rounded-sm overflow-hidden bg-gray-100">
        <img
          src={image.url}
          alt={image.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Validation Status Indicator */}
      {renderValidationIndicator()}

      {/* Remove Button */}
      <button
        onClick={() => onRemove(image.id)}
        className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
        disabled={isUploading}
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Retry Button for Invalid Images */}
      {!image.isValid && image.isValid !== null && (
        <button
          onClick={() => onRetry(image.id)}
          className="absolute top-2 right-12 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-600"
          disabled={isUploading}
          title="Retry validation"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      )}

      {(image.isValid === true || image.isValid === false) && (
        <div
          className={`absolute bottom-2 left-2 right-2 text-white text-xs p-2 rounded ${
            image.isValid
              ? "bg-green-500 bg-opacity-70"
              : "bg-red-500 bg-opacity-70"
          }`}
        >
          <div
            className="truncate font-medium"
            title={
              image.validationMessage ||
              (image.isValid ? "Valid hair image" : "Not a valid hair image")
            }
          >
            {getValidationMessage()}
          </div>

          {/* Show error details for invalid images */}
          {image.isValid === false && image.validationMessage && (
            <div className="mt-1 text-red-200 text-xs">
              <details className="cursor-pointer">
                <summary className="hover:text-red-100 font-medium">
                  View details
                </summary>
                <div className="mt-1 p-2 bg-red-900 bg-opacity-70 rounded text-xs break-words max-h-20 overflow-y-auto">
                  {image.validationMessage}
                </div>
              </details>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageItem;
