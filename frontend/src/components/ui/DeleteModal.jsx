import React from "react";
import { ModalWrapper, Button } from "./index";
import { X } from "lucide-react";

// Generic DeleteModal component for reuse
const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Item",
  description,
  itemName,
  loading,
  confirmText = "Delete",
  cancelText = "Cancel",
}) => {
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
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-secondary">
            {description ? (
              description
            ) : (
              <>
                Are you sure you want to delete{" "}
                <span className="font-semibold text-primary">{itemName}</span>? This action
                cannot be undone.
              </>
            )}
          </p>
          <div className="flex justify-center gap-4">
            <Button
              onClickHandler={onClose}
              additionalClasses="bg-gray-200 text-gray-800"
            >
              {cancelText}
            </Button>
            <Button
              onClickHandler={onConfirm}
              additionalClasses="bg-red-600 text-white"
              isLoading={loading}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default DeleteModal;
