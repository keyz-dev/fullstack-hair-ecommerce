import React from 'react';
import { ImageIcon, VideoIcon } from 'lucide-react';

const MediaTypeStep = ({ onSelect }) => {
  const mediaTypes = [
    {
      id: 'images',
      title: 'Image Gallery',
      description: 'Upload multiple images to showcase your work',
      icon: ImageIcon,
      features: [
        'Upload up to 10 images',
        'Perfect for before/after shots',
        'Showcase multiple angles',
        'Add captions to each image'
      ],
      color: 'from-blue-500 to-purple-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      id: 'video',
      title: 'Video Content',
      description: 'Share video tutorials or transformations',
      icon: VideoIcon,
      features: [
        'Upload video files',
        'Add custom thumbnail',
        'Perfect for tutorials',
        'Show dynamic transformations'
      ],
      color: 'from-green-500 to-teal-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    }
  ];

  return (
    <div className="w-full max-w-4xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary mb-4">
          Choose Your Content Type
        </h2>
        <p className="text-gray-600 text-lg">
          Select how you want to showcase your work
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {mediaTypes.map((type) => (
          <div
            key={type.id}
            onClick={() => onSelect(type.id)}
            className="relative group cursor-pointer transition-all duration-300 hover:scale-105"
          >
            <div className={`${type.bgColor} rounded-xl p-6 border-2 border-transparent group-hover:border-gray-300 transition-all duration-300`}>
              {/* Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${type.color} flex items-center justify-center`}>
                  <type.icon className={`w-6 h-6 ${type.iconColor} text-white`} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-primary">{type.title}</h3>
                  <p className="text-gray-600 text-sm">{type.description}</p>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-2 mb-4">
                {type.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="text-center">
                <button className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-primary font-medium hover:bg-gray-50 transition-colors">
                  Choose {type.title}
                </button>
              </div>
            </div>

            {/* Hover effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        ))}
      </div>

      {/* Additional info */}
      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm">
          💡 <strong>Pro Tip:</strong> Image galleries work great for showcasing transformations, while videos are perfect for tutorials and demonstrations.
        </p>
      </div>
    </div>
  );
};

export default MediaTypeStep; 