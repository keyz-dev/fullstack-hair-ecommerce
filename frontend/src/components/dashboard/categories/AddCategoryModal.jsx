import React, { useState } from "react";
import { useCategory } from "../../../hooks";
import {
  ModalWrapper,
  FormHeader,
  Input,
  FileUploader,
  Button,
  TextArea,
} from "../../ui";
import { X } from "lucide-react";
import { toast } from "react-toastify";

const AddCategoryModal = ({ isOpen, onClose }) => {
  const { createCategory, error, success } = useCategory();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.description)
      newErrors.description = "Description is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setLoading(true);
    const result = await createCategory({ ...formData, categoryImage: image });
    if (result.success) {
      onClose();
      toast.success("Category created successfully");
      // reset form
      setFormData({
        name: "",
        description: "",
      });
      setImage(null);
      setImagePreview(null);
    } else {
      toast.error(result.error || "Something went wrong");
    }
    setLoading(false);
  };

  const isFormIncomplete = !formData.name || !formData.description;

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
          title="Add a category"
          description="Define the categories for your hair brand"
        />
        <form
          onSubmit={handleSave}
          className="min-w-sm lg:min-w-lg mx-auto flex flex-col"
          autoComplete="off"
          encType="multipart/form-data"
        >
          <div className="space-y-4 mb-8">
            {/* Image Upload */}
            <div className="w-40">
              <FileUploader
                preview={imagePreview}
                onChange={(file) => {
                  setImage(file);
                  setImagePreview(URL.createObjectURL(file));
                }}
              />
            </div>
            <Input
              label="Category Name"
              type="text"
              name="name"
              value={formData.name}
              placeholder="Enter category name"
              error={errors.name}
              onChangeHandler={handleChange}
              additionalClasses="border-line_clr" 
              required
            />
            <TextArea
              label="Description"
              name="description"
              value={formData.description}
              placeholder="Enter category description"
              error={errors.description}
              onChangeHandler={handleChange}
              additionalClasses="border-line_clr"
              required={true}
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-8">
            <Button
              onClickHandler={handleSave}
              additionalClasses="primaryBtn bg-accent text-white"
              isLoading={loading}
              isDisabled={isFormIncomplete || Object.keys(errors).length > 0}
            >
              Save Category
            </Button>
          </div>
        </form>

        {/* Error/Success Messages */}
        {error && (
          <p className="text-error text-sm mt-4 text-center">{error}</p>
        )}
        {success && (
          <p className="text-success text-sm mt-4 text-center">{success}</p>
        )}
      </div>
    </ModalWrapper>
  );
};

export default AddCategoryModal;
