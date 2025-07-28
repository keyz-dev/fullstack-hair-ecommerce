import React, { useState } from "react";
import { ModalWrapper, FormHeader, Input, Button, TextArea, FileUploader } from "../../../ui";
import { X } from "lucide-react";

const AddPaymentMethodModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [form, setForm] = useState({
    name: "",
    code: "",
    description: "",
    isActive: true,
    isOnline: false,
    requiresSetup: false,
    supportedCurrencies: [],
    fees: "",
    minAmount: "",
    maxAmount: "",
    sortOrder: "",
  });

  const [icon, setIcon] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onSubmit(form);
    if (success) {
      setForm({
        name: "",
        code: "",
        description: "",
        icon: "",
        isActive: true,
        isOnline: false,
        requiresSetup: false,
        supportedCurrencies: [],
        fees: "",
        minAmount: "",
        maxAmount: "",
        sortOrder: "",
      });
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
        <FormHeader
          title="Add Payment Method"
          description="Add a new payment method"
        />
        <form onSubmit={handleSubmit} className="form_container space-y-4">
          <Input
            label="Name"
            name="name"
            value={form.name}
            onChangeHandler={handleChange}
            required
          />
          {/* <Input
            label="Code"
            name="code"
            value={form.code}
            onChangeHandler={handleChange}
            required
          /> */}
          <TextArea
            label="Description"
            name="description"
            value={form.description}
            onChangeHandler={handleChange}
          />
          
          <div className="flex items-col sm:flex-row justify-between w-full gap-4">
                      {/* Icon Upload */}
            <div className="w-40">
                <FileUploader
                  preview={iconPreview}
                  text="An Icon"
                  onChange={(file) => {
                    setIcon(file);
                    setIconPreview(URL.createObjectURL(file));
                  }}
                />
              </div>
            <div className="flex-1">
              <Input
                label="Fees (%)"
                name="fees"
                type="number"
                value={form.fees}
                onChangeHandler={handleChange}
              />
              <Input
                label="Sort Order"
                name="sortOrder"
                type="number"
                value={form.sortOrder}
                onChangeHandler={handleChange}
              />
            </div>
          </div>

          <div className="flex items-col sm:flex-row justify-between w-full gap-4">
            <Input
              label="Minimum Amount"
              name="minAmount"
              type="number"
              value={form.minAmount}
              onChangeHandler={handleChange}
            />
            <Input
              label="Maximum Amount"
              name="maxAmount"
              type="number"
              value={form.maxAmount}
              onChangeHandler={handleChange}
            />
          </div>
          <div className="flex items-col sm:flex-row justify-between w-full gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
              />
              <label htmlFor="isActive" className="ml-2">
                Active
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isOnline"
                name="isOnline"
                checked={form.isOnline}
                onChange={handleChange}
              />
              <label htmlFor="isOnline" className="ml-2">
                Online Payment
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="requiresSetup"
                name="requiresSetup"
                checked={form.requiresSetup}
                onChange={handleChange}
              />
              <label htmlFor="requiresSetup" className="ml-2">
                Requires Setup
              </label>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="submit"
              onClickHandler={handleSubmit}
              additionalClasses="bg-accent text-white"
              isLoading={loading}
            >
              Create
            </Button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};

export default AddPaymentMethodModal;
