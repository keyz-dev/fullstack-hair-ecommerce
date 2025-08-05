import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { Button, LoadingSpinner } from '../../ui';
import { usePost } from '../../../hooks/usePost';
import { BasicInfoStep, MediaUploadStep, AdvancedSettingsStep } from './steps';

const EditPostPage = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { updatePost, fetchPostById } = usePost();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [postData, setPostData] = useState({
    title: '',
    description: '',
    postType: 'work-showcase',
    mediaType: '',
    status: 'published',
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
    postMetadata: {
      difficulty: 'beginner',
      timeRequired: '',
      clientConsent: false
    },
    metaTitle: '',
    metaDescription: '',
    scheduledFor: '',
    socialShare: {
      facebook: false,
      instagram: false,
      whatsapp: false
    },
    postImages: [],
    postVideo: null,
    thumbnail: null,
    imageCaptions: [],
    videoCaption: ''
  });

  // Fetch post data on component mount
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const post = await fetchPostById(postId);
        if (post) {
          // Transform the post data to match our form structure
          setPostData({
            title: post.title || '',
            description: post.description || '',
            postType: post.postType || 'work-showcase',
            mediaType: post.mediaType || '',
            status: post.status || 'published',
            featured: post.featured || false,
            tags: post.tags || [],
            categories: post.categories || [],
            services: post.services || [],
            products: post.products || [],
            callToAction: post.callToAction || {
              text: '',
              link: '',
              type: 'booking'
            },
            postMetadata: post.postMetadata || {
              difficulty: 'beginner',
              timeRequired: '',
              clientConsent: false
            },
            metaTitle: post.metaTitle || '',
            metaDescription: post.metaDescription || '',
            scheduledFor: post.scheduledFor || '',
            socialShare: post.socialShare || {
              facebook: false,
              instagram: false,
              whatsapp: false
            },
            postImages: post.images || [],
            postVideo: post.video || null,
            thumbnail: post.thumbnail || null,
            imageCaptions: post.imageCaptions || [],
            videoCaption: post.videoCaption || ''
          });
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        toast.error('Failed to load post data');
        navigate('/admin/posts');
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId, fetchPostById, navigate]);

  const handleBasicInfoSave = (data) => {
    setPostData(prev => ({ ...prev, ...data }));
    setStep(2);
  };

  const handleMediaUploadSave = () => {
    setStep(3);
  };

  const handleAdvancedSettingsSave = async (advancedData) => {
    const finalData = { ...postData, ...advancedData };
    
    // Ensure array fields are always arrays
    finalData.categories = Array.isArray(finalData.categories) ? finalData.categories : [];
    finalData.tags = Array.isArray(finalData.tags) ? finalData.tags : [];
    finalData.services = Array.isArray(finalData.services) ? finalData.services : [];
    finalData.products = Array.isArray(finalData.products) ? finalData.products : [];
    
    try {
      setSaving(true);
      const response = await updatePost(postId, finalData);
      if (response.success) {
        toast.success("Post updated successfully!");
        navigate('/admin/posts');
      } else {
        toast.error(response.message || "Failed to update post");
      }
    } catch (error) {
      console.error('Post update error:', error);
      toast.error(error.message || "Failed to update post");
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/admin/posts');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const steps = [
    { number: 1, title: 'Basic Info', description: 'Post title and description' },
    { number: 2, title: 'Media Upload', description: 'Images and videos' },
    { number: 3, title: 'Advanced Settings', description: 'Tags, categories, and more' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                onClickHandler={handleBack}
                additionalClasses="mr-4 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={20} />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
                <p className="text-sm text-gray-500">Update your post content and settings</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                onClickHandler={() => navigate(`/admin/posts/${postId}/view`)}
                additionalClasses="text-gray-600 border-gray-300 hover:bg-gray-50"
                leadingIcon={<Eye size={16} />}
              >
                Preview
              </Button>
              <Button
                onClickHandler={() => setStep(3)}
                additionalClasses="bg-accent hover:bg-accent/90 text-white"
                leadingIcon={<Save size={16} />}
                isDisabled={saving}
                isLoading={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {steps.map((stepItem, index) => (
              <div key={stepItem.number} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  step >= stepItem.number
                    ? 'bg-accent text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepItem.number}
                </div>
                <div className="ml-3">
                  <div className={`text-sm font-medium ${
                    step >= stepItem.number ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {stepItem.title}
                  </div>
                  <div className="text-xs text-gray-400">
                    {stepItem.description}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    step > stepItem.number ? 'bg-accent' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center">
          {step === 1 && (
            <BasicInfoStep
              title={postData.title}
              description={postData.description}
              postType={postData.postType}
              onSave={handleBasicInfoSave}
              onBack={handleBack}
              loading={saving}
            />
          )}
          
          {step === 2 && (
            <MediaUploadStep
              mediaType={postData.mediaType}
              postImages={postData.postImages}
              postVideo={postData.postVideo}
              thumbnail={postData.thumbnail}
              imageCaptions={postData.imageCaptions}
              videoCaption={postData.videoCaption}
              onImagesChange={(images) => setPostData(prev => ({ ...prev, postImages: images }))}
              onVideoChange={(video) => setPostData(prev => ({ ...prev, postVideo: video }))}
              onThumbnailChange={(thumbnail) => setPostData(prev => ({ ...prev, thumbnail }))}
              onImageCaptionsChange={(captions) => setPostData(prev => ({ ...prev, imageCaptions: captions }))}
              onVideoCaptionChange={(caption) => setPostData(prev => ({ ...prev, videoCaption: caption }))}
              onSave={handleMediaUploadSave}
              onBack={handleBack}
              loading={saving}
            />
          )}
          
          {step === 3 && (
            <AdvancedSettingsStep
              tags={postData.tags}
              categories={postData.categories}
              callToAction={postData.callToAction}
              scheduledFor={postData.scheduledFor}
              featured={postData.featured}
              onSave={handleAdvancedSettingsSave}
              onBack={handleBack}
              loading={saving}
              isEditing={true}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditPostPage; 