import React, { useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { DetailsForm, ImageUploadStep } from "./add";
import { ProductVariantsForm, ProductSpecsForm, ProductFeaturesForm } from "./add/index";
import { useProducts } from "../../../hooks";
import { Button } from "../../ui";
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
    currency: "XAF",
    variants: [],
    specifications: {},
    features: [],
  });
  const [productImages, setProductImages] = useState([]);

  // Step 1: General Info
  const handleDetailsFormSubmit = async (formData) => {
    setProductData((prev) => ({ ...prev, ...formData }));
    setStep(2);
  };

  // Step 2: Images
  const handleImageUploadNext = async () => {
    setStep(3);
  };

  // Step 3: Hair Product Details
  const handleHairDetailsSubmit = async (e) => {
    e.preventDefault();
    // Extract the file from each uploaded image
    const imageFiles = productImages.map(({ file }) => file);
    const result = await createProduct({
      ...productData,
      productImages: imageFiles,
    });
    if (result) {
      toast.success("Product created successfully");
      setView("main");
    }
  };

  // Handlers for modular subcomponents
  const setVariants = (variants) => setProductData((prev) => ({ ...prev, variants }));
  const setSpecs = (specifications) => setProductData((prev) => ({ ...prev, specifications }));
  const setFeatures = (features) => setProductData((prev) => ({ ...prev, features }));

  return (
    <div>
      <div
        className="flex justify-start items-center mb-4 gap-2 group"
        onClick={() => setView("main")}
      >
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
            onSave={handleImageUploadNext}
            loading={loading}
            onBack={() => setStep(1)}
            onImagesChange={setProductImages}
          />
        )}
        {step === 3 && (
          <form onSubmit={handleHairDetailsSubmit} className="w-full max-w-2xl p-4 flex flex-col gap-4">
            <ProductVariantsForm variants={productData.variants} setVariants={setVariants} />
            <ProductSpecsForm specs={productData.specifications} setSpecs={setSpecs} />
            <ProductFeaturesForm features={productData.features} setFeatures={setFeatures} />
            <div className="flex justify-between mt-4">
              <Button
                type="button"
                additionalClasses="border border-line_clr text-secondary"
                onClickHandler={() => setStep(2)}
              >
                Back
              </Button>
              <Button
                type="submit"
                additionalClasses="bg-accent text-white"
                isLoading={loading}
              >
                Create Product
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddProductsPage;
