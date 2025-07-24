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

const styles = [
  {
    "id": "afro",
    "name": "Afro",
    "description": "A naturally voluminous and rounded hairstyle typically worn by individuals with Type 4 hair textures. It embraces the hair's natural curl pattern."
  },
  {
    "id": "braids",
    "name": "Braids",
    "description": "A protective hairstyle where hair is sectioned and woven into various patterns such as box braids, cornrows, or micro braids."
  },
  {
    "id": "curls",
    "name": "Curls",
    "description": "Hair styled to have defined curls, ranging from loose waves to tight ringlets. Can be natural or achieved with styling tools."
  },
  {
    "id": "locs",
    "name": "Locs",
    "description": "Also called dreadlocks, this style involves sections of hair that are matted and locked into rope-like strands. Often worn long and can be styled in various ways."
  },
  {
    "id": "straight",
    "name": "Straight",
    "description": "Hair that falls naturally or is styled to be smooth and without curls or waves. Can be natural or achieved through straightening techniques."
  },
  {
    "id": "twists",
    "name": "Twists",
    "description": "Two strands of hair twisted together to form a rope-like appearance. Often used as a protective style and can be worn short or long."
  },
  {
    "id": "buns",
    "name": "Buns",
    "description": "Hair gathered and wrapped into a rounded shape, usually secured at the back or top of the head. Can be sleek, messy, or braided."
  },
  {
    "id": "ponytail",
    "name": "Ponytail",
    "description": "Hair pulled together and secured at a single point, often at the back or top of the head. Can be styled high, low, braided, or curly."
  },
  {
    "id": "weave",
    "name": "Weave",
    "description": "Hair extensions sewn or glued into natural hair to add length, volume, or a new style. Can mimic any hair texture or color."
  },
  {
    "id": "wig",
    "name": "Wig",
    "description": "A head covering made from human or synthetic hair. Allows for quick changes in hairstyle, length, or color without altering natural hair."
  },
  {
    "id": "pixie",
    "name": "Pixie Cut",
    "description": "A short hairstyle that is typically cut close to the scalp around the back and sides, with slightly longer top layers for styling."
  },
  {
    "id": "bob",
    "name": "Bob",
    "description": "A short-to-medium length hairstyle where hair is cut straight around the head, usually at jaw level. Can be sleek, curly, or layered."
  }
]


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
          subtitle="Define the categories for your hair brand"
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
