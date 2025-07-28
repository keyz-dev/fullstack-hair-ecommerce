import React, { useState, useEffect } from "react";
import { useProducts, useCategory, useImageManager } from "../../../hooks";
import {
  ModalWrapper,
  FormHeader,
  Input,
  Button,
  TextArea,
  Select,
  PriceInput,
  ImageGrid
} from "../../ui";
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
    currency: "",
  });
  const [errors, setErrors] = useState({});

  const {
    existingImages,
    newImages,
    addImages,
    removeExistingImage,
    removeNewImage,
    getFormData: getImageFormData,
    hasChanges: hasImageChanges,
  } = useImageManager(initialData?.images);

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
        currency: initialData.currency.code || "XAF",
        category: initialData.category || "",
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.price) newErrors.price = "Price is required.";
    if (!formData.stock) newErrors.stock = "Stock is required.";
    if (!formData.category) newErrors.category = "Category is required.";
    if (!formData.description) newErrors.description = "Description is required.";

    // Check if any field is actually changed compared to initialData
    const isChanged =
      formData.name !== (initialData?.name || "") ||
      formData.description !== (initialData?.description || "") ||
      String(formData.price) !== String(initialData?.price || "") ||
      String(formData.stock) !== String(initialData?.stock || "") ||
      (typeof formData.category === "object"
        ? formData.category?._id !== (initialData?.category?._id || initialData?.category || "")
        : formData.category !== (initialData?.category?._id || initialData?.category || "")) ||
      hasImageChanges(initialData?.images);

    if (!isChanged) {
      newErrors.form = "No changes detected. Please update at least one field.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    const data = new FormData();
    
    // Add form fields
    Object.entries(formData).forEach(([key, value]) => {
      // Handle category field properly
      if (key === 'category' && typeof value === 'object' && value._id) {
        data.append(key, value._id);
      } else {
        data.append(key, value);
      }
    });

    // Add image data from useImageManager
    const imageData = getImageFormData();
    for (let [key, value] of imageData.entries()) {
      data.append(key, value);
    }

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
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={24} />
        </button>
        <FormHeader title="Update product" description="Edit product details" />
        <form
          onSubmit={handleUpdate}
          className="min-w-sm lg:min-w-lg mx-auto flex flex-col gap-4"
          autoComplete="off"
          encType="multipart/form-data"
        >
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChangeHandler={handleChange}
            error={errors.name}
            required
          />

          <TextArea
            label="Description"
            name="description"
            value={formData.description}
            onChangeHandler={handleChange}
          />

          <PriceInput
            price={formData.price}
            currency={formData.currency}
            onPriceChange={handleChange}
            onCurrencyChange={(value) => setFormData((prev) => ({ ...prev, currency: value }))}
            error={errors.price}
            required
            placeholder="Enter product price"
          />

          <div className="flex flex-col sm:flex-row gap-3 justify-between"> 
            <Input
              label="Stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChangeHandler={handleChange}
              error={errors.stock}
              required
            />
            <div className="w-full">
              <Select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                error={errors.category}
                required
                options={categoryOptions}
              />
            </div>
          </div>
          <ImageGrid
            existingImages={existingImages}
            newImages={newImages}
            onRemoveExisting={removeExistingImage}
            onRemoveNew={removeNewImage}
            onAddImages={addImages}
            label="Product Images"
          />
          
          <div className="flex justify-end">
            <Button
              type="submit"
              additionalClasses="primaryBtn bg-accent text-white"
              isLoading={loading}
            >
              Update Product
            </Button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};

export default UpdateProductModal;
