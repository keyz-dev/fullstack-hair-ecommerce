import React from 'react';
import { Construction, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { colorThemes } from '../../constants/theme';

const Upcoming = ({ 
  title = "Coming Soon", 
  description = "This feature is currently under development and will be available soon.",
  expectedDate = null,
  features = [],
  colorTheme = "blue",
  className = "",
  showProgress = true,
  ...props 
}) => {
  const theme = colorThemes[colorTheme] || colorThemes.blue;

  const defaultFeatures = [
    "Enhanced user experience",
    "Advanced functionality",
    "Improved performance",
    "Better accessibility"
  ];

  const displayFeatures = features.length > 0 ? features : defaultFeatures;

  return (
    <div 
      className={`min-h-[60vh] flex items-center justify-center ${className}`}
      {...props}
    >
      <div className={`max-w-2xl mx-auto text-center rounded-sm p-4`}>
        {/* Main Icon */}
        <div className={`${theme.iconBg} w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6`}>
          <Construction className={`w-10 h-10 ${theme.iconColor}`} />
        </div>

        {/* Title */}
        <h1 className={`text-3xl lg:text-4xl font-bold text-primary mb-4 ${theme.iconColor}`}>
          {title}
        </h1>

        {/* Description */}
        <p className="text-lg text-placeholder mb-8 leading-relaxed max-w-lg mx-auto">
          {description}
        </p>

        {/* Expected Date */}
        {expectedDate && (
          <div className="flex items-center justify-center gap-2 mb-8">
            <Calendar className={`w-5 h-5 ${theme.iconColor}`} />
            <span className="text-sm font-medium text-primary">
              Expected: {expectedDate}
            </span>
          </div>
        )}

        {/* Progress Indicator */}
        {showProgress && (
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className={`w-4 h-4 ${theme.iconColor}`} />
              <span className="text-sm font-medium text-primary">Development Progress</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 max-w-md mx-auto">
              <div 
                className={`h-2 rounded-full ${theme.iconBg} animate-pulse`}
                style={{ width: '65%' }}
              ></div>
            </div>
            <p className="text-xs text-placeholder mt-2">65% Complete</p>
          </div>
        )}

        {/* Features List */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-primary mb-4">
            What to Expect
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
            {displayFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-placeholder">
                <div className={`w-2 h-2 rounded-full ${theme.iconBg}`}></div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            className={`${theme.iconBg} ${theme.iconColor} px-6 py-3 rounded-sm font-medium hover:opacity-80 transition-opacity flex items-center gap-2`}
            onClick={() => window.history.back()}
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Go Back
          </button>
          <button 
            className={`${theme.background} border ${theme.border} text-primary px-6 py-3 rounded-sm font-medium hover:${theme.iconBg} transition-colors flex items-center gap-2`}
            onClick={() => window.location.href = '/'}
          >
            <ArrowRight className="w-4 h-4" />
            Go Home
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-placeholder">
            Stay tuned for updates! Follow us on social media for the latest news.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Upcoming;