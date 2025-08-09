import React, { useState } from "react";
import {
  FormHeader,
  Input,
  Button,
  TextArea,
  Select,
  PriceInput,
} from "../../../ui";
import { useCategory } from "../../../../hooks";

const DetailsForm = ({ isOpen, onFormSubmit, data }) => {
  const [formData, setFormData] = useState({
    ...data,
    currency: data?.currency || "XAF",
    discount: data?.discount || 0,
    isActive: data?.isActive !== undefined ? data.isActive : true,
    isFeatured: data?.isFeatured || false,
    isOnSale: data?.isOnSale || false,
  });
  const [errors, setErrors] = useState({});
  const { categories } = useCategory();

  const categoryOptions = categories.map((category) => ({
    value: category._id,
    label: category.name,
  }));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.price) newErrors.price = "Price is required.";
    if (!formData.stock) newErrors.stock = "Stock is required.";
    if (!formData.category) newErrors.category = "Category is required.";
    if (!formData.description)
      newErrors.description = "Description is required.";

    // Validate discount
    if (
      formData.discount &&
      (parseFloat(formData.discount) < 0 || parseFloat(formData.discount) > 100)
    ) {
      newErrors.discount = "Discount must be between 0 and 100.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    onFormSubmit(formData);
  };

  const isDisabled =
    Object.keys(errors).length > 0 ||
    !formData.name ||
    !formData.price ||
    !formData.stock ||
    !formData.category ||
    !formData.description;

  if (!isOpen) return null;

  return (
    <div className="p-2 lg:px-6 w-full max-w-2xl">
      <FormHeader title="Basic Information" />
      <form
        onSubmit={handleSave}
        className="max-w-lg sm:p-4 mx-auto flex flex-col gap-4"
        autoComplete="off"
      >
        <Input
          label="Name"
          name="name"
          value={formData.name}
          onChangeHandler={handleChange}
          error={errors.name}
          required={true}
          additionalClasses="border-line_clr"
          placeholder="Enter product name"
        />

        <TextArea
          label="Full Description"
          name="description"
          value={formData.description}
          onChangeHandler={handleChange}
          error={errors.description}
          required
          additionalClasses="border-line_clr"
          placeholder="Enter detailed product description"
        />

        <PriceInput
          price={formData.price}
          currency={formData.currency}
          onPriceChange={handleChange}
          onCurrencyChange={(value) =>
            setFormData((prev) => ({ ...prev, currency: value }))
          }
          error={errors.price}
          required
          placeholder="Enter product price"
        />

        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            label="Discount (%)"
            name="discount"
            type="number"
            min="0"
            max="100"
            step="1"
            value={formData.discount}
            onChangeHandler={handleChange}
            error={errors.discount}
            additionalClasses="border-line_clr"
            placeholder="Discount percentage (0-100)"
          />

          <Input
            label="Stock"
            name="stock"
            type="number"
            value={formData.stock}
            onChangeHandler={handleChange}
            error={errors.stock}
            required
            additionalClasses="border-line_clr"
            placeholder="Enter product stock"
          />
        </div>

        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">
            Choose a Category *
          </label>
          <Select
            name="category"
            value={formData.category}
            onChange={handleChange}
            options={categoryOptions}
            error={errors.category}
            placeholder="Select a category"
          />
        </div>

        {/* Product Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              Active
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isFeatured"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="isFeatured" className="text-sm text-gray-700">
              Featured
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isOnSale"
              name="isOnSale"
              checked={formData.isOnSale}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="isOnSale" className="text-sm text-gray-700">
              On Sale
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            additionalClasses="primaryBtn bg-accent text-white"
            onClickHandler={handleSave}
            isDisabled={isDisabled}
          >
            Add Images
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DetailsForm;
