import React, { useState, useEffect } from 'react';
import { Search, Filter, X, ChevronDown, Grid3X3, List } from 'lucide-react';
import { Button, Input, Select } from '../ui';

const BlogFilters = ({ 
  filters, 
  onFilterChange, 
  onSearch, 
  onClearFilters,
  categories = [],
  searchTerm = '',
  onSearchChange,
  viewMode = 'grid',
  onViewChange
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const postTypes = [
    { value: '', label: 'All Types' },
    { value: 'work-showcase', label: 'Work Showcase' },
    { value: 'tutorial', label: 'Tutorial' },
    { value: 'product-review', label: 'Product Review' },
    { value: 'styling-tip', label: 'Styling Tip' },
    { value: 'transformation', label: 'Transformation' },
    { value: 'technique-demo', label: 'Technique Demo' },
    { value: 'promotion', label: 'Promotion' }
  ];

  const sortOptions = [
    { value: 'publishedAt', label: 'Latest First' },
    { value: 'views', label: 'Most Viewed' },
    { value: 'likes', label: 'Most Liked' },
    { value: 'title', label: 'Alphabetical' }
  ];

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearchTerm !== searchTerm) {
        onSearchChange(localSearchTerm);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchTerm, onSearchChange, searchTerm]);

  const handleFilterChange = (key, value) => {
    onFilterChange(key, value);
  };

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleFilterApply = () => {
    onFilterChange('category', selectedCategories.join(','));
    setIsFilterOpen(false);
  };

  const handleFilterReset = () => {
    setSelectedCategories([]);
    setLocalSearchTerm('');
    onClearFilters();
    setIsFilterOpen(false);
  };

  const hasActiveFilters = filters.postType || filters.category || filters.sortBy !== 'publishedAt' || searchTerm;

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search posts..."
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-line_clr outline-0 rounded-xs focus:ring focus:ring-accent focus:border-transparent"
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            
            {/* Filter Button */}
            <Button
              onClickHandler={() => setIsFilterOpen(!isFilterOpen)}
              additionalClasses="flex items-center min-h-fit gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {[filters.postType, filters.category, filters.sortBy !== 'publishedAt' ? 1 : 0, searchTerm ? 1 : 0].filter(Boolean).length}
                </span>
              )}
            </Button>

            {/* Post Type Filter */}
            <Select
              value={filters.postType || ''}
              onChange={(e) => handleFilterChange('postType', e.target.value)}
              options={postTypes}
              additionalClasses="min-w-[140px]"
            />

            {/* Sort Dropdown */}
            <Select
              value={filters.sortBy || 'publishedAt'}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              options={sortOptions}
              additionalClasses="min-w-[140px]"
            />

            {/* View Toggle */}
            <div className="flex gap-4 border-gray-300 rounded-xs overflow-hidden">
              <button
                onClick={() => onViewChange('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-accent text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewChange('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-accent text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {isFilterOpen && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Categories */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {categories.map((category) => (
                    <label key={category._id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category._id)}
                        onChange={() => handleCategoryToggle(category._id)}
                        className="rounded border-gray-300 text-accent focus:ring-accent"
                      />
                      <span className="ml-2 text-sm text-gray-700">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex flex-col justify-end space-y-2">
                <Button
                  onClickHandler={handleFilterApply}
                  additionalClasses="w-full primarybtn"
                >
                  Apply Filters
                </Button>
                <Button
                  onClickHandler={handleFilterReset}
                  additionalClasses="w-full border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Reset All
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogFilters; 