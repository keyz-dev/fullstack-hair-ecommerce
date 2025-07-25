import React, { useState } from "react";
import { FormHeader, Input, Button, TextArea, Select } from "../../../ui";
import { useCategory } from "../../../../hooks"

const DetailsForm = ({ isOpen, onFormSubmit, data }) => {
  const [formData, setFormData] = useState(data);
  const [errors, setErrors] = useState({});
  const { categories } = useCategory()

  const categoryOptions = categories.map((category) => ({
    value: category._id,
    label: category.name,
  }));

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
    if (!formData.description)
      newErrors.description = "Description is required.";
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
      <FormHeader title="Add a product" description="Enter product details" />
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
          label="Description"
          name="description"
          value={formData.description}
          onChangeHandler={handleChange}
          error={errors.description}
          required
          additionalClasses="border-line_clr"
          placeholder="Enter product description"
        />

        <Input
          label="Price"
          name="price"
          type="number"
          value={formData.price}
          onChangeHandler={handleChange}
          error={errors.price}
          required
          additionalClasses="border-line_clr"
          placeholder="Enter product price"
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
