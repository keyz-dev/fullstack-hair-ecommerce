import React, { useState } from 'react';
import { Filter, X, Search, Calendar, Tag, User, Eye, Heart, MessageCircle } from 'lucide-react';
import { Button, Input, Select } from '../ui';

const BlogFilters = ({ 
  filters, 
  onFilterChange, 
  onSearch, 
  onClearFilters,
  categories = [],
  searchTerm = '',
  onSearchChange,
  stats = {}
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  const postTypes = [
    { value: '', label: 'All Types', icon: '📄' },
    { value: 'work-showcase', label: 'Work Showcase', icon: '🎨' },
    { value: 'tutorial', label: 'Tutorial', icon: '📚' },
    { value: 'product-review', label: 'Product Review', icon: '⭐' },
    { value: 'styling-tip', label: 'Styling Tip', icon: '💡' },
    { value: 'transformation', label: 'Transformation', icon: '✨' },
    { value: 'technique-demo', label: 'Technique Demo', icon: '🎯' },
    { value: 'promotion', label: 'Promotion', icon: '🎉' }
  ];

  const sortOptions = [
    { value: 'publishedAt', label: 'Latest First', icon: Calendar },
    { value: 'views', label: 'Most Viewed', icon: Eye },
    { value: 'likes', label: 'Most Liked', icon: Heart },
    { value: 'comments', label: 'Most Commented', icon: MessageCircle },
    { value: 'title', label: 'Alphabetical', icon: Tag }
  ];

  const handleFilterChange = (key, value) => {
    onFilterChange(key, value);
    updateActiveFiltersCount();
  };

  const updateActiveFiltersCount = () => {
    let count = 0;
    if (filters.postType) count++;
    if (filters.category) count++;
    if (filters.author) count++;
    if (filters.status) count++;
    if (filters.sortBy && filters.sortBy !== 'publishedAt') count++;
    if (filters.sortOrder && filters.sortOrder !== 'desc') count++;
    setActiveFilters(count);
  };

  const clearAllFilters = () => {
    onClearFilters();
    setActiveFilters(0);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/10 rounded-lg">
            <Filter size={20} className="text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Filters & Search</h3>
            <p className="text-sm text-gray-500">Find exactly what you're looking for</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {activeFilters > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{activeFilters} active filters</span>
              <Button
                onClickHandler={clearAllFilters}
                additionalClasses="text-red-500 hover:text-red-600 p-1"
              >
                <X size={16} />
              </Button>
            </div>
          )}
          
          <Button
            onClickHandler={() => setIsExpanded(!isExpanded)}
            additionalClasses="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-xl transition-all duration-300"
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Search posts, tutorials, transformations..."
            value={searchTerm}
            onChange={onSearchChange}
            additionalClasses="pl-12 pr-4 py-3 bg-gray-50 border-gray-200 focus:bg-white focus:border-accent transition-all duration-300"
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-xl">
          <div className="text-2xl font-bold text-blue-600">{stats.totalPosts || 0}</div>
          <div className="text-xs text-blue-500">Total Posts</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-xl">
          <div className="text-2xl font-bold text-green-600">{stats.featuredPosts || 0}</div>
          <div className="text-xs text-green-500">Featured</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-xl">
          <div className="text-2xl font-bold text-purple-600">{stats.totalViews || 0}</div>
          <div className="text-xs text-purple-500">Total Views</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-xl">
          <div className="text-2xl font-bold text-orange-600">{stats.totalLikes || 0}</div>
          <div className="text-xs text-orange-500">Total Likes</div>
        </div>
      </div>

      {/* Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Post Type</label>
          <Select
            value={filters.postType || ''}
            onChange={(e) => handleFilterChange('postType', e.target.value)}
            additionalClasses="w-full"
          >
            {postTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.icon} {type.label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <Select
            value={filters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            additionalClasses="w-full"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <Select
            value={filters.sortBy || 'publishedAt'}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            additionalClasses="w-full"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="border-t border-gray-200 pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
              <Input
                type="text"
                placeholder="Search by author..."
                value={filters.author || ''}
                onChange={(e) => handleFilterChange('author', e.target.value)}
                additionalClasses="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <Select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                additionalClasses="w-full"
              >
                <option value="">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="featured">Featured</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
              <Select
                value={filters.sortOrder || 'desc'}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                additionalClasses="w-full"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  placeholder="From"
                  value={filters.dateFrom || ''}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  additionalClasses="w-full"
                />
                <Input
                  type="date"
                  placeholder="To"
                  value={filters.dateTo || ''}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  additionalClasses="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Posts Per Page</label>
              <Select
                value={filters.limit || 12}
                onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                additionalClasses="w-full"
              >
                <option value={6}>6 posts</option>
                <option value={12}>12 posts</option>
                <option value={24}>24 posts</option>
                <option value={48}>48 posts</option>
              </Select>
            </div>
          </div>

          {/* Tag Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <Input
              type="text"
              placeholder="Filter by tags (comma separated)..."
              value={filters.tags || ''}
              onChange={(e) => handleFilterChange('tags', e.target.value)}
              additionalClasses="w-full"
            />
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFilters > 0 && (
        <div className="border-t border-gray-200 pt-4 mt-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-gray-700">Active Filters:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.postType && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                Type: {postTypes.find(t => t.value === filters.postType)?.label}
                <button
                  onClick={() => handleFilterChange('postType', '')}
                  className="ml-2 hover:text-blue-900"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {filters.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                Category: {categories.find(c => c._id === filters.category)?.name}
                <button
                  onClick={() => handleFilterChange('category', '')}
                  className="ml-2 hover:text-green-900"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {filters.author && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                Author: {filters.author}
                <button
                  onClick={() => handleFilterChange('author', '')}
                  className="ml-2 hover:text-purple-900"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {filters.status && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                Status: {filters.status}
                <button
                  onClick={() => handleFilterChange('status', '')}
                  className="ml-2 hover:text-orange-900"
                >
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogFilters; 