import React from "react";
import { ModalWrapper, Button } from "../../ui";
import { X } from "lucide-react";

const DeleteCategoryModal = ({ isOpen, onClose, onConfirm, categoryName, loading }) => {
  if (!isOpen) return null;

  return (
    <ModalWrapper>
      <div className="p-2 lg:p-6 w-full max-w-md relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold mb-2">Delete Category</h2>
        <p className="mb-6">Are you sure you want to delete <span className="font-semibold">{categoryName}</span>? This action cannot be undone.</p>
        <div className="flex justify-center gap-4">
          <Button onClickHandler={onClose} additionalClasses="bg-gray-200 text-gray-800">Cancel</Button>
          <Button onClickHandler={onConfirm} additionalClasses="bg-red-600 text-white" isLoading={loading}>Delete</Button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default DeleteCategoryModal; 