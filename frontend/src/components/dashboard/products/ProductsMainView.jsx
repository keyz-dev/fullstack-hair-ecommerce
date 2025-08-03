import React, { useState, useEffect } from "react";
import { ProductStatSection, ProductTable, UpdateProductModal, ViewProductModal } from ".";
import { Button, DeleteModal, LoadingSpinner, EmptyState } from "../../ui";
import { toast } from "react-toastify";
import { useProducts } from "../../../hooks/useProducts";

const ProductsMainView = ({ setView }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const { 
    products,
    loading,
    error,
    filteredProducts,
    stats,
    actions,
    fetchProducts,
    deleteProduct
  } = useProducts();

  // Load products on component mount only
  useEffect(() => {
    fetchProducts();
  }, []); // Empty dependency array - only run on mount

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setViewModalOpen(true);
  };

  const handleDelete = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    
    setDeleteLoading(true);
    try {
      await deleteProduct(productToDelete._id);
      toast.success("Product deleted successfully");
      setDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (error) {
      toast.error("Failed to delete product");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleRefresh = () => {
    actions.refreshProducts();
    fetchProducts();
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <EmptyState
          title="Failed to Load Products"
          description={error}
          action={
            <Button onClick={handleRefresh} variant="primary">
              Try Again
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <ProductStatSection stats={stats} loading={loading} />
      
      <div className="flex justify-end items-center">
        <Button onClickHandler={() => setView('add')} additionalClasses="bg-accent text-white">
          Add Product
        </Button>
      </div>
      
      <ProductTable 
        onEdit={handleEdit} 
        onView={handleView} 
        onDelete={handleDelete} 
      />
      
      <UpdateProductModal
        isOpen={editModalOpen}
        onClose={() => { 
          setEditModalOpen(false); 
          setSelectedProduct(null);
          fetchProducts(); // Refresh products after edit
        }}
        initialData={selectedProduct}
      />

      <ViewProductModal
        isOpen={viewModalOpen}
        onClose={() => { 
          setViewModalOpen(false); 
          setSelectedProduct(null); 
        }}
        product={selectedProduct}
      />
      
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => { 
          setDeleteModalOpen(false); 
          setProductToDelete(null); 
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        loading={deleteLoading}
      />
    </section>
  );
};

export default ProductsMainView;