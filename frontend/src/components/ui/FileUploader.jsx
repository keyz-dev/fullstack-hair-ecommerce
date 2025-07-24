import React, { useRef } from "react";
import { UploadCloud } from "lucide-react";

const FileUploader = ({ preview, onChange, className = "", text = null, accept = "image/*" }) => {
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onChange(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      onChange(file);
    }
  };

  return (
    <div
      className={
        "flex min-w-[35%] flex-col items-center justify-center border-2 border-dashed border-line_clr rounded-xs min-h-[140px] cursor-pointer bg-blue-50/30 relative overflow-hidden " +
        className
      }
      onClick={() => fileInputRef.current.click()}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      tabIndex={0}
      role="button"
      aria-label="Upload profile picture"
    >
      {preview ? (
        <img
          src={preview}
          alt="Avatar Preview"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-accent">
          <UploadCloud className="w-8 h-8 mb-1" />
          <span className="text-xs text-secondary">
            Drop or <span className="text-accent underline">Upload</span>
          </span>
          <span className="text-xs text-secondary">{`${text ? text : "profile picture"
            }`}</span>
        </div>
      )}
      <input
        type="file"
        accept={accept}
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FileUploader;
