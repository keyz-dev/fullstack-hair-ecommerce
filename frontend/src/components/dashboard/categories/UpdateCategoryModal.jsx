import React, { useState, useEffect } from "react";
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

const UpdateCategoryModal = ({ isOpen, onClose, initialData }) => {
  const { updateCategory, error, success } = useCategory();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
      });
      setImagePreview(initialData.image || null);
    }
  }, [initialData, isOpen]);

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

  const handleUpdate = async () => {
    if (!validateForm()) return;
    setLoading(true);
    const result = await updateCategory(initialData._id, { ...formData, categoryImage: image });
    if (result) {
      onClose();
      toast.success("Category updated successfully");
    } else {
      toast.error(error || "Something went wrong");
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
          title="Update category"
          description="Edit the details for this category"
        />
        <form
          onSubmit={e => { e.preventDefault(); handleUpdate(); }}
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

          {/* Update Button */}
          <div className="flex justify-end mt-8">
            <Button
              onClickHandler={handleUpdate}
              additionalClasses="primaryBtn bg-accent text-white"
              isLoading={loading}
              isDisabled={isFormIncomplete || Object.keys(errors).length > 0}
            >
              Update Category
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

export default UpdateCategoryModal; 