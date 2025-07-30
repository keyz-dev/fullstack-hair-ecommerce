import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { productApi } from '../api/product';

export const useProductDetails = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're on a product details page
  const isProductPage = location.pathname.startsWith('/product/');

  // Get product ID from URL
  const getProductIdFromUrl = () => {
    const match = location.pathname.match(/\/product\/([^/]+)/);
    return match ? match[1] : null;
  };

  // Load product by ID
  const loadProduct = useCallback(async (productId) => {
    if (!productId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await productApi.getProduct(productId);
      // Backend returns: { success: true, product }
      setSelectedProduct(response.product);
    } catch (err) {
      setError('Product not found');
      console.error('Error loading product:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Open product details
  const openProductDetails = useCallback((product) => {
    setSelectedProduct(product);
    
    // Update URL
    const productUrl = `/product/${product._id}`;
    navigate(productUrl, { replace: true });
    
    // Open modal on large screens, navigate to page on small screens
    if (window.innerWidth >= 1024) {
      setIsModalOpen(true);
    }
  }, [navigate]);

  // Close product details
  const closeProductDetails = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    
    // Navigate back or to shop
    if (location.pathname.startsWith('/product/')) {
      navigate(-1);
    }
  }, [navigate, location.pathname]);

  // Handle product click from related products
  const handleProductClick = useCallback((product) => {
    openProductDetails(product);
  }, [openProductDetails]);

  // Handle URL changes
  useEffect(() => {
    const productId = getProductIdFromUrl();
    
    if (productId) {
      // If we have a product ID in URL, load the product
      loadProduct(productId);
      
      // On large screens, open modal; on small screens, stay on page
      if (window.innerWidth >= 1024) {
        setIsModalOpen(true);
      }
    } else {
      // No product ID in URL, close modal
      setIsModalOpen(false);
      setSelectedProduct(null);
    }
  }, [location.pathname, loadProduct]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && isModalOpen) {
        // On small screens, close modal and navigate to page
        setIsModalOpen(false);
        if (selectedProduct) {
          navigate(`/product/${selectedProduct._id}`, { replace: true });
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isModalOpen, selectedProduct, navigate]);

  return {
    selectedProduct,
    isModalOpen,
    loading,
    error,
    isProductPage,
    openProductDetails,
    closeProductDetails,
    handleProductClick,
    loadProduct,
  };
}; 