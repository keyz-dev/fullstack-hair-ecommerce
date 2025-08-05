import React, { useState } from 'react';
import { Button, Input, Textarea } from '../../../ui';
import { X, Plus, Calendar, Tag, Target, Share2, ArrowLeftIcon } from 'lucide-react';
import { useCategory } from '../../../../hooks/';
import { toast } from 'react-toastify';

const AdvancedSettingsStep = ({ 
  tags = [], 
  categories = [], 
  callToAction = { text: '', link: '', type: 'booking' },
  scheduledFor = '',
  featured = false,
  onSave, 
  onBack, 
  loading,
  isEditing = false
}) => {
  const { categories: availableCategories, loading: loadingCategories } = useCategory();
  const [formData, setFormData] = useState({
    tags: Array.isArray(tags) ? tags : [],
    categories: Array.isArray(categories) ? categories : [],
    callToAction,
    scheduledFor,
    featured
  });
  const [newTag, setNewTag] = useState('');

  const ctaTypes = [
    { id: 'booking', label: 'Book Appointment', icon: '📅' },
    { id: 'product', label: 'View Product', icon: '🛍️' },
    { id: 'contact', label: 'Contact Us', icon: '📞' },
    { id: 'whatsapp', label: 'WhatsApp', icon: '💬' },
    { id: 'custom', label: 'Custom Link', icon: '🔗' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim().toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim().toLowerCase()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddCategory = (categoryId) => {
    if (categoryId && !formData.categories.includes(categoryId)) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, categoryId]
      }));
    }
  };

  const handleRemoveCategory = (categoryIdToRemove) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(catId => catId !== categoryIdToRemove)
    }));
  };

  const handleSubmit = () => {
    // Check if post is scheduled for future
    const isScheduled = formData.scheduledFor && new Date(formData.scheduledFor) > new Date();
    
    // Ensure categories is always an array before submitting
    const submitData = {
      ...formData,
      categories: Array.isArray(formData.categories) ? formData.categories : [],
      tags: Array.isArray(formData.tags) ? formData.tags : [],
      status: isScheduled ? 'draft' : 'published' // Set to draft if scheduled for future, otherwise published
    };
    
    onSave(submitData);
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="text-center mb-3">
        <h2 className="text-2xl font-bold text-primary mb-4">
          Advanced Settings
        </h2>
        <p className="text-gray-600">
          Optional settings to enhance your post's reach and engagement
        </p>
      </div>

      <div className="space-y-3">
        {/* Tags Section */}
        <div className="bg-gray-50 rounded-xs p-6">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-primary">Tags</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Add relevant tags to help people discover your post
          </p>
          
          <div className="flex gap-2 mb-4">
            <Input
              name="newTag"
              id="newTag"
              required={false}
              type="text"
              value={newTag}
              onChangeHandler={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag..."
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              additionalClasses='border-line_clr'
            />
            <Button
              onClickHandler={handleAddTag}
              additionalClasses="primarybtn min-h-fit min-w-fit"
              isDisabled={!newTag.trim()}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-accent text-white text-sm rounded-full"
                >
                  #{tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:bg-accent/80 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

                 {/* Categories Section */}
         <div className="bg-gray-50 rounded-xs p-6">
           <div className="flex items-center gap-2 mb-4">
             <Target className="w-5 h-5 text-gray-600" />
             <h3 className="text-lg font-semibold text-primary">Categories</h3>
           </div>
           <p className="text-sm text-gray-600 mb-4">
             Select categories to organize your post
           </p>

           <div className="mb-4">
             <select
               className="w-full px-3 py-2 border border-gray-300 rounded-xs focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
               onChange={(e) => {
                 if (e.target.value) {
                   handleAddCategory(e.target.value);
                   e.target.value = '';
                 }
               }}
               disabled={loadingCategories}
             >
               <option value="">
                 {loadingCategories ? 'Loading categories...' : 'Select a category...'}
               </option>
               {availableCategories
                 .filter(cat => !formData.categories.includes(cat._id))
                 .map((category) => (
                   <option key={category._id} value={category._id}>
                     {category.name}
                   </option>
                 ))}
             </select>
           </div>

           {formData.categories.length > 0 && (
             <div className="flex flex-wrap gap-2">
               {formData.categories.map((categoryId) => {
                 const category = availableCategories.find(cat => cat._id === categoryId);
                 return (
                   <span
                     key={categoryId}
                     className="inline-flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent text-sm rounded-full border border-accent/20"
                   >
                     {category ? category.name : 'Loading...'}
                     <button
                       onClick={() => handleRemoveCategory(categoryId)}
                       className="ml-1 hover:bg-accent/20 rounded-full p-0.5"
                     >
                       <X className="w-3 h-3" />
                     </button>
                   </span>
                 );
               })}
             </div>
           )}
         </div>

        {/* Call to Action Section */}
        <div className="bg-gray-50 rounded-xs p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-primary">Call to Action</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Add a call-to-action button to drive engagement
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CTA Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {ctaTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleInputChange('callToAction', { ...formData.callToAction, type: type.id })}
                    className={`p-3 rounded-xs border-2 transition-all ${
                      formData.callToAction.type === type.id
                        ? 'border-accent bg-accent/10'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg mb-1">{type.icon}</div>
                      <div className="text-xs font-medium">{type.label}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Button Text {formData.callToAction.type === 'product' && <span className="text-red-500">*</span>}
              </label>
              <Input
                name="callToActionText"
                id="callToActionText"
                required={formData.callToAction.type === 'product'}
                type="text"
                value={formData.callToAction.text}
                onChangeHandler={(e) => handleInputChange('callToAction', { ...formData.callToAction, text: e.target.value })}
                placeholder="e.g., Book Now, Learn More, Contact Us..."
                additionalClasses={`border-line_clr ${formData.callToAction.type === 'product' && !formData.callToAction.text?.trim() ? 'border-red-300 focus:border-red-500' : ''}`}
              />
              {formData.callToAction.type === 'product' && !formData.callToAction.text?.trim() && (
                <p className="text-red-500 text-xs mt-1">Button text is required for product call to action</p>
              )}
            </div>

            {(formData.callToAction.type === 'custom' || formData.callToAction.type === 'product') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.callToAction.type === 'custom' ? 'Custom URL' : 'Product URL'} <span className="text-red-500">*</span>
                </label>
                <Input
                  name="callToActionLink"
                  id="callToActionLink"
                  required={true}
                  type="url"
                  value={formData.callToAction.link}
                  onChangeHandler={(e) => handleInputChange('callToAction', { ...formData.callToAction, link: e.target.value })}
                  placeholder={formData.callToAction.type === 'custom' ? "https://example.com" : "https://yourstore.com/product"}
                  additionalClasses={`border-line_clr ${!formData.callToAction.link?.trim() ? 'border-red-300 focus:border-red-500' : ''}`}
                />
                {!formData.callToAction.link?.trim() && (
                  <p className="text-red-500 text-xs mt-1">
                    {formData.callToAction.type === 'custom' 
                      ? 'Custom URL is required for custom call to action' 
                      : 'Product URL is required for product call to action'
                    }
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Scheduling & Featured */}
        <div className="bg-gray-50 rounded-xs p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-primary">Publishing Options</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schedule for Later (Optional)
              </label>
              <Input
                name="scheduledFor"
                id="scheduledFor"
                required={false}
                type="datetime-local"
                value={formData.scheduledFor}
                onChangeHandler={(e) => handleInputChange('scheduledFor', e.target.value)}
                additionalClasses='border-line_clr'
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty to publish immediately
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => handleInputChange('featured', e.target.checked)}
                className="w-6 h-6"
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                Feature this post on your profile
              </label>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-accent/5 rounded-xs p-6">
          <div className="flex items-center gap-2 mb-4">
            <Share2 className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-primary">Quick Actions</h3>
          </div>
          <p className="text-sm text-secondary/80 mb-4">
            Choose how you want to proceed with your post
          </p>

          <div className="w-full justify-between flex gap-3">
            <Button
              onClickHandler={() => {
                // Validate call to action
                if (formData.callToAction) {
                  if (formData.callToAction.type === 'custom' && !formData.callToAction.link?.trim()) {
                    toast.error('Custom call to action requires a link');
                    return;
                  }
                  
                  if (formData.callToAction.type === 'product' && (!formData.callToAction.link?.trim() || !formData.callToAction.text?.trim())) {
                    toast.error('Product call to action requires both text and link');
                    return;
                  }
                }
                
                // Clean up callToAction data before submitting
                const cleanedFormData = { ...formData };
                
                // Ensure categories and tags are always arrays
                cleanedFormData.categories = Array.isArray(cleanedFormData.categories) ? cleanedFormData.categories : [];
                cleanedFormData.tags = Array.isArray(cleanedFormData.tags) ? cleanedFormData.tags : [];
                
                // If CTA type is not 'custom', remove the link field or set it to null
                if (cleanedFormData.callToAction && cleanedFormData.callToAction.type !== 'custom') {
                  cleanedFormData.callToAction = {
                    ...cleanedFormData.callToAction,
                    link: null // Set to null instead of empty string
                  };
                }
                
                // If CTA type is 'custom' but link is empty, set it to null
                if (cleanedFormData.callToAction && 
                    cleanedFormData.callToAction.type === 'custom' && 
                    !cleanedFormData.callToAction.link?.trim()) {
                  cleanedFormData.callToAction.link = null;
                }
                
                onSave({ ...cleanedFormData, status: 'draft' }); // Always save as draft
              }}
              additionalClasses="text-secondary border border-line_clr"
              isDisabled={loading}
            >
              Save as Draft
            </Button>

            <Button
              onClickHandler={handleSubmit}
              additionalClasses="primarybtn"
              isLoading={loading}
              isDisabled={loading}
            >
              {isEditing ? 'Update Post' : 'Create Post'}
            </Button>
            
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            onClickHandler={onBack}
            additionalClasses="border border-gray-300 text-gray-700 hover:bg-gray-50"
            leadingIcon={<ArrowLeftIcon className="w-4 h-4" />}
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettingsStep; 