import React, { useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { Button, ProgressSteps } from "../../ui";
import { MediaTypeStep, ImageUploadStep, VideoUploadStep, BasicInfoStep, AdvancedSettingsStep } from "./steps";
import { usePost } from "../../../hooks";
import { toast } from "react-toastify";

const CreatePostPage = ({ setView }) => {
  const [step, setStep] = useState(1);
  const { createPost, loading } = usePost();
  const [postData, setPostData] = useState({
    title: '',
    description: '',
    postType: 'work-showcase',
    mediaType: '',
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

  const [postImages, setPostImages] = useState([])

  const steps = [
    {
      label: "Media Type",
      description: "Choose your content type"
    },
    {
      label: "Upload Media",
      description: "Add your images or video"
    },
    {
      label: "Basic Info",
      description: "Title, type & description"
    },
    {
      label: "Advanced",
      description: "Optional settings & CTA"
    }
  ];

  const handleMediaTypeSelect = (mediaType) => {
    setPostData(prev => ({ ...prev, mediaType }));
    setStep(2);
  };

  const handleImageUpload = () => {
    setPostData(prev => ({ 
      ...prev, 
      postImages: postImages.map(img => img.file),
      imageCaptions: postImages.map(img => img.caption || ''),
      imageOrder: postImages.map((img, index) => img.order || index + 1)
    }));

    setStep(3);
  };

  const handleVideoUpload = () => {
    // Check if video is uploaded
    if (!postData.postVideo) {
      toast.error('Please upload a video file before continuing');
      return;
    }
    
    setStep(3);
  };

  const handleBasicInfoSubmit = (basicData) => {
    setPostData(prev => ({ ...prev, ...basicData }));
    setStep(4);
  };

  const handleAdvancedSubmit = async (advancedData) => {
    const finalData = { ...postData, ...advancedData };
    
    // Validate video upload for video posts
    if (finalData.mediaType === 'video' && !finalData.postVideo) {
      toast.error('Please upload a video file for video posts');
      return;
    }
    
    // Ensure array fields are always arrays
    finalData.categories = Array.isArray(finalData.categories) ? finalData.categories : [];
    finalData.tags = Array.isArray(finalData.tags) ? finalData.tags : [];
    finalData.services = Array.isArray(finalData.services) ? finalData.services : [];
    finalData.products = Array.isArray(finalData.products) ? finalData.products : [];
    
    try {
      const response = await createPost(finalData);
      if (response.success) {
        toast.success("Post created successfully!");
        setView('main');
      } else {
        toast.error(response.message || "Failed to create post");
      }
    } catch (error) {
      console.error('Post creation error:', error);
      toast.error(error.message || "Failed to create post");
    }
  };

  const handleStepClick = (stepIndex) => {
    // Only allow going back to completed steps
    if (stepIndex < step) {
      setStep(stepIndex + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      setView('main');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div
        className="flex justify-start items-center mb-6 gap-2 group"
        onClick={handleBack}
      >
        <ArrowLeftIcon className="w-4 h-4 group-hover:translate-x-1 transition-all duration-200 group-hover:text-accent" />
        <span className="text-sm font-medium cursor-pointer group-hover:text-accent group-hover:underline group-hover:opacity-80 transition-all duration-200">
          {step === 1 ? 'Back to Posts' : 'Back'}
        </span>
      </div>

      {/* Progress Steps */}
      <ProgressSteps 
        steps={steps} 
        currentStep={step - 1} 
        onStepClick={handleStepClick}
      />

      {/* Step Content */}
      <div className="flex flex-col gap-4 items-center justify-center min-h-[60vh]">
        {step === 1 && (
          <MediaTypeStep onSelect={handleMediaTypeSelect} />
        )}
        
        {step === 2 && postData.mediaType === 'images' && (
          <ImageUploadStep
            images={postImages}
            onImagesChange={setPostImages}
            onSave={handleImageUpload}
            onBack={handleBack}
            loading={loading}
          />
        )}
        
        {step === 2 && postData.mediaType === 'video' && (
          <VideoUploadStep
            video={postData.postVideo ? {
              file: postData.postVideo,
              url: URL.createObjectURL(postData.postVideo)
            } : null}
            thumbnail={postData.thumbnail ? {
              file: postData.thumbnail,
              url: URL.createObjectURL(postData.thumbnail)
            } : null}
            onVideoChange={(video) => {
              setPostData(prev => {
                const newState = { 
                  ...prev, 
                  postVideo: video?.file || null 
                };
                return newState;
              });
            }}
            onThumbnailChange={(thumbnail) => {
              setPostData(prev => {
                const newState = { 
                  ...prev, 
                  thumbnail: thumbnail?.file || null 
                };
                return newState;
              });
            }}
            onSave={handleVideoUpload}
            onBack={handleBack}
            loading={loading}
          />
        )}
        
        {step === 3 && (
          <BasicInfoStep
            title={postData.title}
            description={postData.description}
            postType={postData.postType}
            onSave={handleBasicInfoSubmit}
            onBack={handleBack}
            loading={loading}
          />
        )}
        
        {step === 4 && (
          <AdvancedSettingsStep
            tags={postData.tags}
            categories={postData.categories || []}
            callToAction={postData.callToAction}
            scheduledFor={postData.scheduledFor}
            featured={postData.featured}
            onSave={handleAdvancedSubmit}
            onBack={handleBack}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default CreatePostPage; 