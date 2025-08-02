import React, { useState } from "react";
import { ProductStatSection, ProductTable, UpdateProductModal, ViewProductModal } from ".";
import { Button, DeleteModal } from "../../ui";
import { toast } from "react-toastify";
import { useProducts } from "../../../hooks/useProducts";

const ProductsMainView = ({ setView }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { deleteProduct, loading } = useProducts();

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setViewModalOpen(true);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    const result = await deleteProduct(selectedProduct._id);
    if (result) {
      toast.success("Product deleted successfully");
      setDeleteModalOpen(false);
      setSelectedProduct(null);
    }
  };

  return (
    <section>
      <ProductStatSection />
      <div className="flex justify-end items-center mb-4">
        <Button onClickHandler={() => setView('add')} additionalClasses="bg-accent text-white">
          Add Product
        </Button>
      </div>
      <ProductTable onEdit={handleEdit} onView={handleView} onDelete={handleDelete} />
      
      <UpdateProductModal
        isOpen={editModalOpen}
        onClose={() => { setEditModalOpen(false); setSelectedProduct(null); }}
        initialData={selectedProduct}
      />

      <ViewProductModal
        isOpen={viewModalOpen}
        onClose={() => { setViewModalOpen(false); setSelectedProduct(null); }}
        product={selectedProduct}
      />
      
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setSelectedProduct(null); }}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        message={`Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`}
        loading={loading}
      />
    </section>
  );
};

export default ProductsMainView;