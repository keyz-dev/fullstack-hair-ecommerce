import React from "react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

const ValidationSummary = ({ images, onRetryAllFailed, isUploading }) => {
  const pendingImages = images.filter((img) => img.isValid === null).length;
  const validatedImages = images.filter((img) => img.isValid === true).length;
  const invalidImages = images.filter((img) => img.isValid === false).length;

  return (
    <div className="px-6 py-3 border-t border-line_clr bg-gray-50">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <span className="text-secondary">
            {images.length} image{images.length !== 1 ? "s" : ""} selected
          </span>
          {images.some((img) => img.isValid === true) && (
            <span className="text-green-600 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              {validatedImages} valid
            </span>
          )}
          {images.some((img) => img.isValid === false) && (
            <span className="text-red-600 flex items-center gap-1">
              <XCircle className="w-4 h-4" />
              {invalidImages} invalid
            </span>
          )}
          {images.some((img) => img.isValid === null) && (
            <span className="text-gray-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {pendingImages} pending
            </span>
          )}
        </div>
        {images.some((img) => img.isValid === false) && (
          <button
            onClick={onRetryAllFailed}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            disabled={isUploading}
          >
            Retry All Failed
          </button>
        )}
      </div>
    </div>
  );
};

export default ValidationSummary;
