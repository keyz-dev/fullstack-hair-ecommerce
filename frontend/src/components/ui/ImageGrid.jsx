import React, { useRef } from "react";
import { Plus, Trash2 } from "lucide-react";

const ImageGrid = ({
  existingImages = [],
  newImages = [],
  onRemoveExisting,
  onRemoveNew,
  onAddImages,
  label = "Images",
  gridCols = 4,
  imageHeight = "h-26"
}) => {
  const fileInputRef = useRef(null);

  // Map gridCols to actual Tailwind classes
  const getGridClass = (cols) => {
    const gridClasses = {
      1: "grid-cols-1",
      2: "grid-cols-2", 
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6"
    };
    return gridClasses[cols] || "grid-cols-3";
  };

  const handleAddImages = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    onAddImages(files);
    event.target.value = "";
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-secondary mb-2">
        {label}
      </label>
      
      <div className={`grid ${getGridClass(gridCols)} gap-2`}>
        {/* Existing Images */}
        {existingImages.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={image}
              alt={`Image ${index + 1}`}
              className={`w-full ${imageHeight} object-cover rounded-lg border border-gray-200`}
            />
            <button
              type="button"
              onClick={() => onRemoveExisting(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
        
        {/* New Images */}
        {newImages.map((image) => (
          <div key={image.id} className="relative group">
            <img
              src={image.url}
              alt={image.name}
              className={`w-full ${imageHeight} object-cover rounded-lg border border-gray-200`}
            />
            <button
              type="button"
              onClick={() => onRemoveNew(image.id)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
        
        {/* Add Image Button */}
        <button
          type="button"
          onClick={handleAddImages}
          className={`w-full ${imageHeight} border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors duration-200`}
        >
          <Plus size={24} />
          <span className="text-xs mt-1">Add Image</span>
        </button>
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
  );
};

export default ImageGrid; 