import React from "react";
import { Input, TextArea, Select, PriceInput, Button } from "../../../ui";

const BasicInfoStep = ({ 
  formData, 
  errors, 
  handleChange, 
  categoryOptions, 
  onNext 
}) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-primary mb-6 text-center">Basic Information</h2>
      <form className="space-y-4">
        <Input
          label="Name"
          name="name"
          value={formData.name}
          onChangeHandler={handleChange}
          error={errors.name}
          required
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <PriceInput
            price={formData.price}
            currency={formData.currency}
            onPriceChange={handleChange}
            onCurrencyChange={(value) => handleChange({ target: { name: 'currency', value } })}
            error={errors.price}
            required
            placeholder="Enter product price"
          />
          <Input
            label="Discount (%)"
            name="discount"
            type="number"
            min="0"
            max="100"
            step="1"
            value={formData.discount}
            onChangeHandler={handleChange}
            placeholder="Discount percentage (0-100)"
            required={false}
          />
        </div>

        <TextArea
          label="Description"
          name="description"
          value={formData.description}
          onChangeHandler={handleChange}
          error={errors.description}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Stock"
            name="stock"
            type="number"
            value={formData.stock}
            onChangeHandler={handleChange}
            error={errors.stock}
            required
          />

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

        {/* Product Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
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

        <div className="flex justify-end pt-4">
          <Button
            type="button"
            additionalClasses="bg-accent text-white hover:bg-accent/90"
            onClickHandler={onNext}
          >
            Next: Images
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BasicInfoStep; 