import { useState, useEffect } from "react";

export const useImagePreloader = (imageUrls) => {
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [loadedCount, setLoadedCount] = useState(0);
  
    useEffect(() => {
      if (!imageUrls || imageUrls.length === 0) return;
  
      let loadedImages = 0;
      const totalImages = imageUrls.length;
  
      const preloadImage = (src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            loadedImages++;
            setLoadedCount(loadedImages);
            if (loadedImages === totalImages) {
              // Add a small delay to ensure smooth transition
              setTimeout(() => {
                setImagesLoaded(true);
              }, 300);
            }
            resolve();
          };
          img.onerror = () => {
            loadedImages++;
            setLoadedCount(loadedImages);
            if (loadedImages === totalImages) {
              setTimeout(() => {
                setImagesLoaded(true);
              }, 300);
            }
            resolve();
          };
          img.src = src;
        });
      };
  
      // Preload all images
      Promise.all(imageUrls.map(url => preloadImage(url)));
    }, [imageUrls]);
  
    return { imagesLoaded, loadedCount };
  };