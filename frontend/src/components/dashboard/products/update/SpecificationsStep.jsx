import React from "react";
import { Input, TextArea, Button } from "../../../ui";
import { X, Plus, Tag } from "lucide-react";

const SpecificationsStep = ({
  formData,
  handleChange,
  handleSpecificationChange,
  newTag,
  setNewTag,
  addTag,
  removeTag,
  newFeature,
  setNewFeature,
  addFeature,
  removeFeature,
  onBack,
  onSubmit,
  loading
}) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-primary mb-6 text-center">Product Specifications</h2>
      
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Specifications */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-primary mb-4">Product Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="Length"
              value={formData.specifications.length}
              onChangeHandler={(e) => handleSpecificationChange('length', e.target.value)}
              placeholder="e.g., Short, Medium, Long"
              required={false}
            />
            <Input
              label="Texture"
              value={formData.specifications.texture}
              onChangeHandler={(e) => handleSpecificationChange('texture', e.target.value)}
              placeholder="e.g., Straight, Wavy, Curly"
              required={false}
            />
            <Input
              label="Material"
              value={formData.specifications.material}
              onChangeHandler={(e) => handleSpecificationChange('material', e.target.value)}
              placeholder="e.g., Human Hair, Synthetic"
              required={false}
            />
            <Input
              label="Weight"
              value={formData.specifications.weight}
              onChangeHandler={(e) => handleSpecificationChange('weight', e.target.value)}
              placeholder="e.g., 100g, 150g"
              required={false}
            />
            <Input
              label="Density"
              value={formData.specifications.density}
              onChangeHandler={(e) => handleSpecificationChange('density', e.target.value)}
              placeholder="e.g., Light, Medium, Heavy"
              required={false}
            />
            <Input
              label="Cap Size"
              value={formData.specifications.capSize}
              onChangeHandler={(e) => handleSpecificationChange('capSize', e.target.value)}
              placeholder="e.g., Small, Medium, Large"
              required={false}
            />
            <Input
              label="Hair Type"
              value={formData.specifications.hairType}
              onChangeHandler={(e) => handleSpecificationChange('hairType', e.target.value)}
              placeholder="e.g., Virgin, Remy, Non-Remy"
              required={false}
            />
            <Input
              label="Origin"
              value={formData.specifications.origin}
              onChangeHandler={(e) => handleSpecificationChange('origin', e.target.value)}
              placeholder="e.g., Brazilian, Peruvian, Indian"
              required={false}
            />
          </div>
          <TextArea
            label="Care Instructions"
            value={formData.specifications.careInstructions}
            onChangeHandler={(e) => handleSpecificationChange('careInstructions', e.target.value)}
            placeholder="Care and maintenance instructions"
            required={false}
          />
          <Input
            label="Warranty"
            value={formData.specifications.warranty}
            onChangeHandler={(e) => handleSpecificationChange('warranty', e.target.value)}
            placeholder="e.g., 1 year warranty"
            required={false}
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
                  required={false}
                />
                <Input
                  label="Icon Class (optional)"
                  value={newFeature.icon}
                  onChangeHandler={(e) => setNewFeature(prev => ({ ...prev, icon: e.target.value }))}
                  placeholder="e.g., fas fa-star"
                  required={false}
                />
              </div>
              <TextArea
                label="Feature Description"
                value={newFeature.description}
                onChangeHandler={(e) => setNewFeature(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe this feature"
                required={false}
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
            required={false}
          />
          <TextArea
            label="Meta Description"
            name="metaDescription"
            value={formData.metaDescription}
            onChangeHandler={handleChange}
            placeholder="SEO description for search engines"
            required={false}
          />
        </div>
        
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <Button
            type="button"
            additionalClasses="border border-line_clr text-secondary hover:bg-gray-50"
            onClickHandler={onBack}
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
  );
};

export default SpecificationsStep; 