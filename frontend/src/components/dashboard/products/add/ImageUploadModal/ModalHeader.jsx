import React from "react";
import { X, Plus } from "lucide-react";

const ModalHeader = ({
  images,
  pendingImages,
  validatedImages,
  invalidImages,
  onBrowseClick,
  onClose,
  isUploading,
}) => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-line_clr">
      <div className="flex flex-col">
        <h2 className="text-xl font-semibold">Upload Photos</h2>
        <p className="text-sm text-gray-500 mt-1">
          {images.length} Images selected
          {pendingImages > 0 && ` • ${pendingImages} pending`}
          {validatedImages > 0 && ` • ${validatedImages} valid`}
          {invalidImages > 0 && ` • ${invalidImages} invalid`}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onBrowseClick}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          disabled={isUploading}
        >
          <Plus className="w-5 h-5" />
        </button>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          disabled={isUploading}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ModalHeader;
