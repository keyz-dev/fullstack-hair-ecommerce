import React, { useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { DetailsForm, ImageUploadStep } from "./add";
import { useProducts } from "../../../hooks";
import { toast } from "react-toastify";

const AddProductsPage = ({ setView }) => {
  const [step, setStep] = useState(1);
  const { createProduct, loading } = useProducts();
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });
  const [productImages, setProductImages] = useState([]);

  const handleDetailsFormSubmit = async (formData) => {
    setProductData((prev) => ({ ...prev, ...formData }));
    setStep(2);
  };

  const handleImageUploadSubmit = async () => {
    // Extract the file from each uploaded image
    const imageFiles = productImages.map(({ file }) => file);

    const result = await createProduct({ ...productData, productImages: imageFiles });
    if (result) {
      toast.success("Product created successfully");
      setView("main");
    }
  };

  return (
    <div>
      <div
        className="flex justify-start items-center mb-4 gap-2 group"
        onClick={() => setView("main")}
      >
        {/* Add a back arrow icon */}
        <ArrowLeftIcon className="w-4 h-4 group-hover:translate-x-1 transition-all duration-200 group-hover:text-accent" />
        <span className="text-sm font-medium cursor-pointer group-hover:text-accent group-hover:underline group-hover:opacity-80 transition-all duration-200">
          Go back to Main
        </span>
      </div>

      <div className="flex flex-col gap-4 items-center justify-center">
        {step === 1 && (
          <DetailsForm
            isOpen={step === 1}
            onFormSubmit={handleDetailsFormSubmit}
            data={productData}
          />
        )}
        {step === 2 && (
          <ImageUploadStep
            isOpen={step === 2}
            images={productImages}
            onSave={handleImageUploadSubmit}
            loading={loading}
            onBack={() => setStep(1)}
            onImagesChange={setProductImages}
          />
        )}
      </div>
    </div>
  );
};

export default AddProductsPage;
