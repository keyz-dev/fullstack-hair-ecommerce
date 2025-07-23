import React from "react";

export const HeroLoader = () => (
    <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-30 w-full h-full">
      <div className="flex flex-col items-center gap-4">
        {/* Spinning circle loader */}
        <div className="relative">
          <div className="w-12 h-12 border-4 border-gray-600 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-accent rounded-full animate-spin"></div>
        </div>
        
        {/* Loading text */}
        <div className="text-white text-sm font-medium">
          <span className="inline-block animate-pulse">Loading Experience</span>
          <span className="ml-1">
            <span className="animate-bounce inline-block" style={{ animationDelay: '0ms' }}>.</span>
            <span className="animate-bounce inline-block" style={{ animationDelay: '150ms' }}>.</span>
            <span className="animate-bounce inline-block" style={{ animationDelay: '300ms' }}>.</span>
          </span>
        </div>
      </div>
    </div>
  );

export default HeroLoader;