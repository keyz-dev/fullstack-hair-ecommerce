import { useState, useEffect, useRef } from 'react';

const useImageManager = (initialImages = []) => {
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const prevInitialImagesRef = useRef(initialImages);

  useEffect(() => {
    // Only update if initialImages actually changed
    if (JSON.stringify(prevInitialImagesRef.current) !== JSON.stringify(initialImages)) {
      setExistingImages(initialImages || []);
      setNewImages([]);
      prevInitialImagesRef.current = initialImages;
    }
  }, [initialImages]);

  const addImages = (files) => {
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
          setNewImages((prev) => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeExistingImage = (imageIndex) => {
    setExistingImages((prev) => prev.filter((_, index) => index !== imageIndex));
  };

  const removeNewImage = (imageId) => {
    setNewImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const getFormData = () => {
    const data = new FormData();
    
    // Add existing images that weren't deleted
    data.append("existingImages", JSON.stringify(existingImages));
    
    // Add new images
    newImages.forEach((image) => {
      data.append("productImages", image.file);
    });

    return data;
  };

  const hasChanges = (originalImages = []) => {
    return existingImages.length !== originalImages.length || newImages.length > 0;
  };

  return {
    existingImages,
    newImages,
    addImages,
    removeExistingImage,
    removeNewImage,
    getFormData,
    hasChanges,
  };
};

export default useImageManager; 