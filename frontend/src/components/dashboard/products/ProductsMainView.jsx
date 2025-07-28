import React, { useState } from "react";
import { ProductStatSection, ProductTable, UpdateProductModal } from ".";
import { Button, DeleteModal } from "../../ui";
import { toast } from "react-toastify";
import { useProducts } from "../../../hooks/useProducts";

const ProductsMainView = ({ setView }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { deleteProduct, loading } = useProducts();

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
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
      <ProductTable onEdit={handleEdit} onDelete={handleDelete} />
      
      <UpdateProductModal
        isOpen={editModalOpen}
        onClose={() => { setEditModalOpen(false); setSelectedProduct(null); }}
        initialData={selectedProduct}
      />
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setSelectedProduct(null); }}
        onConfirm={handleDeleteConfirm}
        loading={loading}
        itemName={selectedProduct?.name}
        title="Delete Product"
      />
    </section>
  );
};

export default ProductsMainView;