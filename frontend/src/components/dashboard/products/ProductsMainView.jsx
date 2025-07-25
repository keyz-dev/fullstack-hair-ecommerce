import React, { useState } from "react";
import { ProductStatSection, ProductTable, UpdateProductModal, DeleteProductModal } from ".";
import { Button } from "../../ui";

const ProductsMainView = ({ setView }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
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
      <DeleteProductModal
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setSelectedProduct(null); }}
        productName={selectedProduct?.name}
        productId={selectedProduct?._id}
      />
    </section>
  );
};

export default ProductsMainView;