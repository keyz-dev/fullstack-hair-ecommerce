import React, { useState, useEffect } from 'react';
import { ModalWrapper, Button, Input, Select, Textarea, TagInput, ImageUpload, VideoUpload } from '../../ui';
import { usePost } from '../../../hooks';
import { toast } from 'react-toastify';

const EditPostModal = ({ isOpen, onClose, initialData }) => {
  const { updatePost } = usePost();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    type: 'post',
    status: 'draft',
    featured: false,
    tags: [],
    categories: [],
    services: [],
    products: [],
    callToAction: {
      text: '',
      link: '',
      type: 'booking'
    },
    metaTitle: '',
    metaDescription: '',
    scheduledFor: '',
    socialShare: {
      facebook: false,
      instagram: false,
      whatsapp: false
    },
    images: [],
    videos: []
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        content: initialData.content || '',
        excerpt: initialData.excerpt || '',
        type: initialData.type || 'post',
        status: initialData.status || 'draft',
        featured: initialData.featured || false,
        tags: initialData.tags || [],
        categories: initialData.categories || [],
        services: initialData.services || [],
        products: initialData.products || [],
        callToAction: initialData.callToAction || {
          text: '',
          link: '',
          type: 'booking'
        },
        metaTitle: initialData.metaTitle || '',
        metaDescription: initialData.metaDescription || '',
        scheduledFor: initialData.scheduledFor || '',
        socialShare: initialData.socialShare || {
          facebook: false,
          instagram: false,
          whatsapp: false
        },
        images: [],
        videos: []
      });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await updatePost(initialData._id, formData);
      if (result) {
        toast.success('Post updated successfully');
        onClose();
      }
    } catch {
      toast.error('Failed to update post');
    }
  };

  if (!isOpen) return null;

  return (
    <ModalWrapper>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <Select
            label="Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="post">Post</option>
            <option value="story">Story</option>
            <option value="reel">Reel</option>
            <option value="transformation">Transformation</option>
            <option value="tutorial">Tutorial</option>
            <option value="promotion">Promotion</option>
          </Select>
        </div>

        <Textarea
          label="Content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={6}
          required
        />

        <Textarea
          label="Excerpt"
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          rows={3}
          placeholder="Brief summary of the post..."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </Select>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="featured" className="text-sm font-medium text-gray-700">
              Featured Post
            </label>
          </div>

          <Input
            type="datetime-local"
            label="Schedule For"
            value={formData.scheduledFor}
            onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
          />
        </div>

        <TagInput
          label="Tags"
          value={formData.tags}
          onChange={(tags) => setFormData({ ...formData, tags })}
          placeholder="Add tags..."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageUpload
            label="Images"
            value={formData.images}
            onChange={(images) => setFormData({ ...formData, images })}
            multiple
          />
          <VideoUpload
            label="Videos"
            value={formData.videos}
            onChange={(videos) => setFormData({ ...formData, videos })}
            multiple
          />
        </div>

        {/* Call to Action */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Call to Action</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="CTA Text"
              value={formData.callToAction.text}
              onChange={(e) => setFormData({
                ...formData,
                callToAction: { ...formData.callToAction, text: e.target.value }
              })}
              placeholder="Book Now"
            />
            <Input
              label="CTA Link"
              value={formData.callToAction.link}
              onChange={(e) => setFormData({
                ...formData,
                callToAction: { ...formData.callToAction, link: e.target.value }
              })}
              placeholder="https://..."
            />
            <Select
              label="CTA Type"
              value={formData.callToAction.type}
              onChange={(e) => setFormData({
                ...formData,
                callToAction: { ...formData.callToAction, type: e.target.value }
              })}
            >
              <option value="booking">Booking</option>
              <option value="product">Product</option>
              <option value="contact">Contact</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="custom">Custom</option>
            </Select>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClickHandler={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Update Post
          </Button>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default EditPostModal; 