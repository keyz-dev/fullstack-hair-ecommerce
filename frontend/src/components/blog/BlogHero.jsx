import React, { useState, useEffect } from 'react';
import { Search, Sparkles, TrendingUp, Users, Clock } from 'lucide-react';
import { Button, Input } from '../ui';

const BlogHero = ({ onSearch, stats = {} }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  const statsItems = [
    { icon: TrendingUp, value: stats.totalPosts || 0, label: 'Posts' },
    { icon: Users, value: stats.totalViews || 0, label: 'Views' },
    { icon: Clock, value: stats.featuredPosts || 0, label: 'Featured' },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary via-accent to-purple-600 min-h-[500px] flex items-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-32 right-1/3 w-24 h-24 bg-white/10 rounded-full animate-pulse delay-500"></div>
      </div>

      {/* Floating Sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute text-white/30 animate-bounce`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            <Sparkles size={16} />
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Discover
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                Amazing Stories
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Explore our curated collection of tutorials, transformations, and insights from the world of hair styling
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <form onSubmit={handleSearch} className="relative group">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={20} />
                <Input
                  type="text"
                  placeholder="Search posts, tutorials, transformations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  additionalClasses="pl-12 pr-4 py-4 text-lg bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-2xl focus:ring-4 focus:ring-white/20 transition-all duration-300"
                />
                <Button
                  type="submit"
                  text="Search"
                  additionalClasses="absolute right-2 top-1/2 transform -translate-y-1/2 bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
                />
              </div>
            </form>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {statsItems.map((item, index) => (
              <div
                key={index}
                className={`text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 transition-all duration-500 hover:scale-105 hover:bg-white/20 ${
                  isAnimating ? 'animate-bounce' : ''
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-white/20 rounded-full">
                    <item.icon size={24} className="text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {item.value.toLocaleString()}
                </div>
                <div className="text-white/80 text-sm font-medium">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Wave Effect */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-16 text-white"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            fill="currentColor"
          />
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            fill="currentColor"
          />
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
};

export default BlogHero; 