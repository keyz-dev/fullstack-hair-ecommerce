import React, { useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { DetailsForm, ImageUploadStep } from "./add";
import { ProductVariantsForm, ProductSpecsForm, ProductFeaturesForm } from "./add/index";
import { useProducts } from "../../../hooks";
import { Button, ProgressSteps } from "../../ui";
import { toast } from "react-toastify";

const AddProductsPage = ({ setView }) => {
  const [step, setStep] = useState(1);
  const { createProduct, loading } = useProducts();
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    discount: 0,
    stock: "",
    category: "",
    currency: "XAF",
    variants: [],
    specifications: {
      length: '',
      texture: '',
      material: '',
      weight: '',
      density: '',
      capSize: '',
      hairType: '',
      origin: '',
      careInstructions: '',
      warranty: ''
    },
    features: [],
    tags: [],
    metaTitle: "",
    metaDescription: "",
    isActive: true,
    isFeatured: false,
    isOnSale: false,
  });
  const [productImages, setProductImages] = useState([]);

  const steps = [
    {
      label: "Basic Info",
      description: "Product details & pricing"
    },
    {
      label: "Images",
      description: "Upload product images"
    },
    {
      label: "Specifications",
      description: "Product specs & features"
    }
  ];

  // Step 1: Basic Info
  const handleDetailsFormSubmit = async (formData) => {
    setProductData((prev) => ({ ...prev, ...formData }));
    setStep(2);
  };

  // Step 2: Images
  const handleImageUploadNext = async () => {
    setStep(3);
  };

  const handleImageUploadBack = () => {
    setStep(1);
  };

  // Step 3: Specifications
  const handleSpecsSubmit = async (e) => {
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

  const handleSpecsBack = () => {
    setStep(2);
  };

  // Handlers for modular subcomponents
  const setVariants = (variants) => setProductData((prev) => ({ ...prev, variants }));
  const setSpecs = (specifications) => setProductData((prev) => ({ ...prev, specifications }));
  const setFeatures = (features) => setProductData((prev) => ({ ...prev, features }));

  const handleStepClick = (stepIndex) => {
    // Only allow going back to completed steps
    if (stepIndex < step) {
      setStep(stepIndex + 1);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div
        className="flex justify-start items-center mb-6 gap-2 group"
        onClick={() => setView("main")}
      >
        <ArrowLeftIcon className="w-4 h-4 group-hover:translate-x-1 transition-all duration-200 group-hover:text-accent" />
        <span className="text-sm font-medium cursor-pointer group-hover:text-accent group-hover:underline group-hover:opacity-80 transition-all duration-200">
          Go back to Main
        </span>
      </div>

      {/* Progress Steps */}
      <ProgressSteps 
        steps={steps} 
        currentStep={step - 1} 
        onStepClick={handleStepClick}
      />

      {/* Step Content */}
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
            onBack={handleImageUploadBack}
            onImagesChange={setProductImages}
          />
        )}
        
        {step === 3 && (
          <div className="w-full max-w-4xl">
            <h2 className="text-2xl font-bold text-primary mb-6 text-center">Product Specifications</h2>
            
            <form onSubmit={handleSpecsSubmit} className="space-y-6">
              <ProductVariantsForm variants={productData.variants} setVariants={setVariants} />
              <ProductSpecsForm specs={productData.specifications} setSpecs={setSpecs} />
              <ProductFeaturesForm features={productData.features} setFeatures={setFeatures} />
              
              <div className="flex justify-between pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  additionalClasses="border border-line_clr text-secondary hover:bg-gray-50"
                  onClickHandler={handleSpecsBack}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  additionalClasses="bg-accent text-white hover:bg-accent/90"
                  isLoading={loading}
                >
                  Create Product
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProductsPage;
