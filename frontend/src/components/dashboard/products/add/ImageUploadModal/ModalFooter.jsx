import React from "react";
import { Button } from "../../../../ui";

const ModalFooter = ({
  images,
  pendingImages,
  isUploading,
  onClose,
  onUpload,
  onRevalidateFailed,
  hasInvalidImages,
}) => {
  return (
    <div className="flex items-center justify-between p-6 border-t border-line_clr bg-gray-50">
      <button
        onClick={onClose}
        className="px-6 py-2 text-secondary hover:text-gray-800 transition-colors"
        disabled={isUploading}
      >
        Cancel
      </button>
      <div className="flex gap-3">
        {/* Upload Button - show when there are images and not currently uploading */}
        {images.length > 0 && (
          <Button
            onClickHandler={onUpload}
            isDisabled={isUploading || images.length === 0}
            additionalClasses="primarybtn px-6 py-2"
          >
            {isUploading
              ? `Validating images...`
              : `Upload ${images.length} Image${
                  images.length !== 1 ? "s" : ""
                }`}
          </Button>
        )}

        {/* Re-validate Button - show if there are invalid images and no pending */}
        {hasInvalidImages && pendingImages === 0 && (
          <Button
            onClickHandler={onRevalidateFailed}
            isDisabled={isUploading}
            additionalClasses="border border-line_clr text-secondary px-6 py-2"
          >
            Re-validate Failed Images
          </Button>
        )}
      </div>
    </div>
  );
};

export default ModalFooter;
