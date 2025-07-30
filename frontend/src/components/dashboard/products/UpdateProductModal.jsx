import React, { useState, useEffect } from "react";
import { useProducts, useCategory, useImageManager } from "../../../hooks";
import {
  ModalWrapper,
  FormHeader,
  Input,
  Button,
  TextArea,
  Select,
  PriceInput,
  ImageGrid,
  ProgressSteps
} from "../../ui";
import { X, Plus, Tag } from "lucide-react";
import { toast } from "react-toastify";

const UpdateProductModal = ({ isOpen, onClose, initialData }) => {
  const { updateProduct, loading } = useProducts();
  const { categories } = useCategory();
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discount: 0,
    stock: "",
    category: "",
    currency: "",
    isActive: true,
    isFeatured: false,
    isOnSale: false,
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
    metaTitle: '',
    metaDescription: ''
  });
  const [errors, setErrors] = useState({});
  const [newTag, setNewTag] = useState('');
  const [newVariant, setNewVariant] = useState({ name: '', options: [], required: false });
  const [newFeature, setNewFeature] = useState({ title: '', description: '', icon: '' });

  const {
    existingImages,
    newImages,
    addImages,
    removeExistingImage,
    removeNewImage,
    getFormData: getImageFormData,
    hasChanges: hasImageChanges,
  } = useImageManager(initialData?.images);

  const categoryOptions = categories.map((category) => ({
    label: category.name,
    value: category._id,
  }));

  const steps = [
    {
      label: "Basic Info",
      description: "Product details & pricing"
    },
    {
      label: "Images",
      description: "Manage product images"
    },
    {
      label: "Specifications",
      description: "Product specs & features"
    }
  ];

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price || "",
        discount: initialData.discount || 0,
        stock: initialData.stock || "",
        currency: initialData.currency?.code || "XAF",
        category: initialData.category?._id || initialData.category || "",
        isActive: initialData.isActive !== undefined ? initialData.isActive : true,
        isFeatured: initialData.isFeatured || false,
        isOnSale: initialData.isOnSale || false,
        variants: initialData.variants || [],
        specifications: initialData.specifications || {
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
        features: initialData.features || [],
        tags: initialData.tags || [],
        metaTitle: initialData.metaTitle || '',
        metaDescription: initialData.metaDescription || ''
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSpecificationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [field]: value
      }
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addVariant = () => {
    if (newVariant.name.trim() && newVariant.options.length > 0) {
      setFormData(prev => ({
        ...prev,
        variants: [...prev.variants, { ...newVariant }]
      }));
      setNewVariant({ name: '', options: [], required: false });
    }
  };

  const removeVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const addFeature = () => {
    if (newFeature.title.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, { ...newFeature }]
      }));
      setNewFeature({ title: '', description: '', icon: '' });
    }
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.price) newErrors.price = "Price is required.";
    if (!formData.stock) newErrors.stock = "Stock is required.";
    if (!formData.category) newErrors.category = "Category is required.";
    if (!formData.description) newErrors.description = "Description is required.";

    // Check if any field is actually changed compared to initialData
    const isChanged =
      formData.name !== (initialData?.name || "") ||
      formData.description !== (initialData?.description || "") ||
      String(formData.price) !== String(initialData?.price || "") ||
      String(formData.discount) !== String(initialData?.discount || 0) ||
      String(formData.stock) !== String(initialData?.stock || "") ||
      (typeof formData.category === "object"
        ? formData.category?._id !== (initialData?.category?._id || initialData?.category || "")
        : formData.category !== (initialData?.category?._id || initialData?.category || "")) ||
      formData.isActive !== initialData?.isActive ||
      formData.isFeatured !== initialData?.isFeatured ||
      formData.isOnSale !== initialData?.isOnSale ||
      JSON.stringify(formData.variants) !== JSON.stringify(initialData?.variants || []) ||
      JSON.stringify(formData.specifications) !== JSON.stringify(initialData?.specifications || {}) ||
      JSON.stringify(formData.features) !== JSON.stringify(initialData?.features || []) ||
      JSON.stringify(formData.tags) !== JSON.stringify(initialData?.tags || []) ||
      formData.metaTitle !== (initialData?.metaTitle || "") ||
      formData.metaDescription !== (initialData?.metaDescription || "") ||
      hasImageChanges(initialData?.images);

    if (!isChanged) {
      newErrors.form = "No changes detected. Please update at least one field.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    const data = new FormData();
    
    // Add form fields
    Object.entries(formData).forEach(([key, value]) => {
      // Handle category field properly
      if (key === 'category' && typeof value === 'object' && value._id) {
        data.append(key, value._id);
      } else if (key === 'variants' || key === 'specifications' || key === 'features') {
        // Convert arrays and objects to JSON strings
        data.append(key, JSON.stringify(value));
      } else if (key === 'tags') {
        // Convert tags array to comma-separated string
        data.append(key, value.join(','));
      } else {
        data.append(key, value);
      }
    });

    // Add image data from useImageManager
    const imageData = getImageFormData();
    for (let [key, value] of imageData.entries()) {
      data.append(key, value);
    }

    const result = await updateProduct(initialData._id, data);
    if (result) {
      toast.success("Product updated successfully");
      onClose();
    }
  };

  const handleStepClick = (stepIndex) => {
    // Only allow going back to completed steps
    if (stepIndex < step) {
      setStep(stepIndex + 1);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalWrapper>
      <div className="p-2 lg:p-6 w-full max-w-6xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10"
        >
          <X size={24} />
        </button>
        
        <FormHeader title="Update product" description="Edit product details" />
        
        {/* Progress Steps */}
        <ProgressSteps 
          steps={steps} 
          currentStep={step - 1} 
          onStepClick={handleStepClick}
        />

        {/* Step Content */}
        {step === 1 && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-primary mb-6">Basic Information</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChangeHandler={handleChange}
            error={errors.name}
            required
          />

          <PriceInput
            price={formData.price}
            currency={formData.currency}
            onPriceChange={handleChange}
            onCurrencyChange={(value) => setFormData((prev) => ({ ...prev, currency: value }))}
            error={errors.price}
            required
            placeholder="Enter product price"
                />
              </div>

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
              />

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
                  onClickHandler={() => setStep(2)}
                >
                  Next: Images
                </Button>
              </div>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-primary mb-6">Product Images</h2>
          <ImageGrid
            existingImages={existingImages}
            newImages={newImages}
            onRemoveExisting={removeExistingImage}
            onRemoveNew={removeNewImage}
            onAddImages={addImages}
            label="Product Images"
          />
          
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <Button
                type="button"
                additionalClasses="border border-line_clr text-secondary hover:bg-gray-50"
                onClickHandler={() => setStep(1)}
              >
                Back
              </Button>
              <Button
                type="button"
                additionalClasses="bg-accent text-white hover:bg-accent/90"
                onClickHandler={() => setStep(3)}
              >
                Next: Specifications
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-primary mb-6">Product Specifications</h2>
            
            <form onSubmit={handleUpdate} className="space-y-6">
              {/* Specifications */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-primary mb-4">Product Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Input
                    label="Length"
                    value={formData.specifications.length}
                    onChangeHandler={(e) => handleSpecificationChange('length', e.target.value)}
                    placeholder="e.g., Short, Medium, Long"
                  />
                  <Input
                    label="Texture"
                    value={formData.specifications.texture}
                    onChangeHandler={(e) => handleSpecificationChange('texture', e.target.value)}
                    placeholder="e.g., Straight, Wavy, Curly"
                  />
                  <Input
                    label="Material"
                    value={formData.specifications.material}
                    onChangeHandler={(e) => handleSpecificationChange('material', e.target.value)}
                    placeholder="e.g., Human Hair, Synthetic"
                  />
                  <Input
                    label="Weight"
                    value={formData.specifications.weight}
                    onChangeHandler={(e) => handleSpecificationChange('weight', e.target.value)}
                    placeholder="e.g., 100g, 150g"
                  />
                  <Input
                    label="Density"
                    value={formData.specifications.density}
                    onChangeHandler={(e) => handleSpecificationChange('density', e.target.value)}
                    placeholder="e.g., Light, Medium, Heavy"
                  />
                  <Input
                    label="Cap Size"
                    value={formData.specifications.capSize}
                    onChangeHandler={(e) => handleSpecificationChange('capSize', e.target.value)}
                    placeholder="e.g., Small, Medium, Large"
                  />
                  <Input
                    label="Hair Type"
                    value={formData.specifications.hairType}
                    onChangeHandler={(e) => handleSpecificationChange('hairType', e.target.value)}
                    placeholder="e.g., Virgin, Remy, Non-Remy"
                  />
                  <Input
                    label="Origin"
                    value={formData.specifications.origin}
                    onChangeHandler={(e) => handleSpecificationChange('origin', e.target.value)}
                    placeholder="e.g., Brazilian, Peruvian, Indian"
                  />
                </div>
                <TextArea
                  label="Care Instructions"
                  value={formData.specifications.careInstructions}
                  onChangeHandler={(e) => handleSpecificationChange('careInstructions', e.target.value)}
                  placeholder="Care and maintenance instructions"
                />
                <Input
                  label="Warranty"
                  value={formData.specifications.warranty}
                  onChangeHandler={(e) => handleSpecificationChange('warranty', e.target.value)}
                  placeholder="e.g., 1 year warranty"
                />
              </div>

              {/* Features */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-primary mb-4">Product Features</h3>
                <div className="space-y-4">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="border border-gray-200 rounded p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{feature.title}</span>
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      {feature.description && <p className="text-sm text-gray-600">{feature.description}</p>}
                      {feature.icon && <p className="text-xs text-gray-500">Icon: {feature.icon}</p>}
                    </div>
                  ))}
                  
                  <div className="border border-dashed border-gray-300 rounded p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Feature Title"
                        value={newFeature.title}
                        onChangeHandler={(e) => setNewFeature(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Natural Look"
                      />
                      <Input
                        label="Icon Class (optional)"
                        value={newFeature.icon}
                        onChangeHandler={(e) => setNewFeature(prev => ({ ...prev, icon: e.target.value }))}
                        placeholder="e.g., fas fa-star"
                      />
                    </div>
                    <TextArea
                      label="Feature Description"
                      value={newFeature.description}
                      onChangeHandler={(e) => setNewFeature(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe this feature"
                    />
                    <Button
                      type="button"
                      onClick={addFeature}
                      additionalClasses="bg-green-500 text-white mt-2"
                      isDisabled={!newFeature.title}
                    >
                      <Plus size={16} /> Add Feature
                    </Button>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-primary mb-4">Product Tags</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map((tag, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      <Tag size={12} />
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag"
                    value={newTag}
                    onChangeHandler={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    additionalClasses="bg-success min-h-fit text-white"
                    isDisabled={!newTag.trim()}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>

              {/* SEO Fields */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Input
                  label="Meta Title"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChangeHandler={handleChange}
                  placeholder="SEO title for search engines"
                />
                <TextArea
                  label="Meta Description"
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChangeHandler={handleChange}
                  placeholder="SEO description for search engines"
                />
              </div>
              
              <div className="flex justify-between pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  additionalClasses="border border-line_clr text-secondary hover:bg-gray-50"
                  onClickHandler={() => setStep(2)}
                >
                  Back
                </Button>
            <Button
              type="submit"
                  additionalClasses="bg-accent text-white hover:bg-accent/90"
              isLoading={loading}
            >
              Update Product
            </Button>
          </div>
        </form>
          </div>
        )}
      </div>
    </ModalWrapper>
  );
};

export default UpdateProductModal;
