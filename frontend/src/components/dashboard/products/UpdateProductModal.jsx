import React, { useState, useEffect } from "react";
import { useProducts, useCategory } from "../../../hooks";
import { ModalWrapper, FormHeader, Input, FileUploader, Button, TextArea, Select } from "../../ui";
import { X } from "lucide-react";
import { toast } from "react-toastify";

const UpdateProductModal = ({ isOpen, onClose, initialData }) => {
  const { updateProduct, loading } = useProducts();
  const { categories } = useCategory();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    images: [],
  });
  const [errors, setErrors] = useState({});

  const categoryOptions = categories.map((category) => ({
    label: category.name,
    value: category._id,
  }));

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price || "",
        stock: initialData.stock || "",
        category: initialData.category || "",
        images: [],
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (files) => {
    setFormData((prev) => ({ ...prev, images: files }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.price) newErrors.price = "Price is required.";
    if (!formData.stock) newErrors.stock = "Stock is required.";
    if (!formData.category) newErrors.category = "Category is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "images" && value.length) {
        Array.from(value).forEach((file) => data.append("productImages", file));
      } else {
        data.append(key, value);
      }
    });
    const result = await updateProduct(initialData._id, data);
    if (result) {
      toast.success("Product updated successfully");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalWrapper>
      <div className="p-2 lg:p-6 w-full max-w-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <X size={24} />
        </button>
        <FormHeader title="Update product" description="Edit product details" />
        <form onSubmit={handleUpdate} className="min-w-sm lg:min-w-lg mx-auto flex flex-col gap-4" autoComplete="off" encType="multipart/form-data">
          <Input label="Name" name="name" value={formData.name} onChangeHandler={handleChange} error={errors.name} required />
          <TextArea label="Description" name="description" value={formData.description} onChangeHandler={handleChange} />
          <Input label="Price" name="price" type="number" value={formData.price} onChangeHandler={handleChange} error={errors.price} required />
          <Input label="Stock" name="stock" type="number" value={formData.stock} onChangeHandler={handleChange} error={errors.stock} required />
          <Select label="Category" name="category" value={formData.category} onChange={handleChange} error={errors.category} required options={categoryOptions} />
          <FileUploader multiple onChange={handleFileChange} />
          <div className="flex justify-end">
            <Button type="submit" additionalClasses="primaryBtn bg-accent text-white" isLoading={loading}>
              Update Product
            </Button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};

export default UpdateProductModal;