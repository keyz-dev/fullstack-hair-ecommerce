import React, { useRef, useState } from "react";
import { X, ImageIcon, Plus, Trash2, GripVertical, Edit3 } from "lucide-react";
import { Button, Input } from "../../ui";
import { useDropzone } from "react-dropzone";

const PostImageUploadModal = ({
  isOpen,
  onClose,
  images,
  onImagesChange,
}) => {
  const fileInputRef = useRef(null);
  const [editingCaption, setEditingCaption] = useState(null);

  const onDrop = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage = {
            id: Date.now() + Math.random(),
            file,
            url: e.target.result,
            name: file.name,
            caption: '',
            order: images.length
          };
          onImagesChange((prev) => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    noClick: true // Prevent dropzone from handling clicks
  });

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
            caption: '',
            order: images.length
          };
          onImagesChange((prev) => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      }
    });
    event.target.value = "";
  };

  const removeImage = (imageId) => {
    onImagesChange((prev) => {
      const filtered = prev.filter((img) => img.id !== imageId);
      // Reorder remaining images
      return filtered.map((img, index) => ({ ...img, order: index }));
    });
  };

  const updateCaption = (imageId, caption) => {
    onImagesChange((prev) =>
      prev.map((img) =>
        img.id === imageId ? { ...img, caption } : img
      )
    );
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    
    if (dragIndex === dropIndex) return;

    onImagesChange((prev) => {
      const newImages = [...prev];
      const draggedItem = newImages[dragIndex];
      
      // Remove the dragged item
      newImages.splice(dragIndex, 1);
      
      // Insert at new position
      newImages.splice(dropIndex, 0, draggedItem);
      
      // Update order for all items
      return newImages.map((img, index) => ({ ...img, order: index }));
    });
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = () => {
    onClose();
  };

  const startEditingCaption = (imageId) => {
    setEditingCaption(imageId);
  };

  const saveCaption = (imageId, caption) => {
    updateCaption(imageId, caption);
    setEditingCaption(null);
  };

  const cancelEditingCaption = () => {
    setEditingCaption(null);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(2px)",
      }}
    >
      <div className="bg-white rounded-xs w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-semibold">Upload Images</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">
              {images.length} Images selected • Drag to reorder • Add captions
            </p>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 ml-2">
            <button
              onClick={handleBrowseClick}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Add more images"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 max-h-96 overflow-y-auto">
          {images.length === 0 ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-12 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-accent bg-accent/10' : 'hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-50 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                    {isDragActive ? 'Drop images here' : 'Drag and Drop'}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    or browse for images
                  </p>
                </div>
                <Button
                  onClickHandler={handleBrowseClick}
                  additionalClasses="bg-accent text-white hover:bg-accent/90 px-4 sm:px-6 py-2 text-sm"
                >
                  Browse
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  {/* Drag Handle */}
                  <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 flex-shrink-0">
                    <GripVertical className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>

                  {/* Image */}
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute top-1 right-1 bg-white rounded-full p-1 text-xs font-medium text-gray-600">
                      {index + 1}
                    </div>
                  </div>

                  {/* Caption Input */}
                  <div className="flex-1 min-w-0">
                    {editingCaption === image.id ? (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Input
                          value={image.caption}
                          onChangeHandler={(e) => updateCaption(image.id, e.target.value)}
                          onBlur={() => saveCaption(image.id, image.caption)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              saveCaption(image.id, image.caption);
                            } else if (e.key === 'Escape') {
                              cancelEditingCaption();
                            }
                          }}
                          placeholder="Add a caption for this image..."
                          required={false}
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveCaption(image.id, image.caption)}
                            className="px-3 py-2 bg-success text-white rounded-xs hover:bg-success/90 text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEditingCaption}
                            className="px-3 py-2 bg-gray-500 text-white rounded-xs hover:bg-gray-600 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 min-w-0">
                          {image.caption ? (
                            <p className="text-sm text-gray-700 truncate">{image.caption}</p>
                          ) : (
                            <p className="text-sm text-gray-400 italic">No caption</p>
                          )}
                        </div>
                        <button
                          onClick={() => startEditingCaption(image.id)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                          title="Edit caption"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeImage(image.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors flex-shrink-0"
                    title="Remove image"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 sm:px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm sm:text-base"
          >
            Done
          </button>
          <Button
            onClickHandler={handleUpload}
            isDisabled={images.length === 0}
            additionalClasses="bg-accent text-white hover:bg-accent/90 px-4 sm:px-6 py-2 text-sm"
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

export default PostImageUploadModal; 