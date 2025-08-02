import React, { useRef } from "react";
import { X, ImageIcon, Plus, Trash2 } from "lucide-react";
import { Button } from "../../../ui";

const ImageUploadModal = ({
  isOpen,
  onClose,
  images,
  onImagesChange,
}) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage = {
            id: Date.now() + Math.random(),
            file,
            url: e.target.result,
            name: file.name,
          };
          onImagesChange((prev) => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      }
    });
    event.target.value = "";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage = {
            id: Date.now() + Math.random(),
            file,
            url: e.target.result,
            name: file.name,
          };
          onImagesChange((prev) => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (imageId) => {
    onImagesChange((prev) => prev.filter((img) => img.id !== imageId));
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(2px)",
      }}
    >
      <div className="bg-white rounded-sm w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-line_clr">
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold">Upload Photos</h2>
            <p className="text-sm text-gray-500 mt-1">
              {images.length} Items selected
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBrowseClick}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 max-h-96 overflow-y-auto">
          {images.length === 0 ? (
            <div
              className="border-2 border-dashed border-gray-300 rounded-sm p-12 text-center"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-blue-50 rounded-sm flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <h3 className="font-medium text-primary">Drag and Drop</h3>
                  <p className="text-sm text-secondary  mt-1">
                    or browse for photos
                  </p>
                </div>
                <Button
                  onClickHandler={handleBrowseClick}
                  additionalClasses="primarybtn min-h-fit min-w-fit px-6 py-2"
                >
                  Browse
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  <div className="aspect-square rounded-sm overflow-hidden bg-gray-100">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => removeImage(image.id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-6 border-t border-line_clr bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 text-secondary hover:text-gray-800 transition-colors"
          >
            Done
          </button>
          <Button
            onClickHandler={handleUpload}
            isDisabled={images.length === 0}
            additionalClasses="primarybtn px-6 py-2"
          >
            Upload
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ImageUploadModal;
