import React, { useState, useEffect } from 'react';
import { Search, Filter, X, ChevronDown, Grid3X3, List } from 'lucide-react';
import { Button, Input, Select } from '../ui';
import { CurrencySelector } from '../header';

const SearchAndFilters = ({ 
  onSearch, 
  onFilterChange, 
  onSortChange, 
  onViewChange,
  categories = [],
  viewMode = 'grid',
  className = "" 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('newest');

  const sortOptions = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Name: A to Z', value: 'name-asc' },
    { label: 'Name: Z to A', value: 'name-desc' },
    { label: 'Most Popular', value: 'popular' }
  ];

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleFilterApply = () => {
    onFilterChange({
      categories: selectedCategories,
      priceRange,
      searchTerm
    });
    setIsFilterOpen(false);
  };

  const handleFilterReset = () => {
    setSelectedCategories([]);
    setPriceRange({ min: '', max: '' });
    setSearchTerm('');
    onFilterChange({
      categories: [],
      priceRange: { min: '', max: '' },
      searchTerm: ''
    });
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    onSortChange(value);
  };

  return (
    <div className={`bg-white border-b border-gray-200 sticky top-0 z-30 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
              {selectedCategories.length > 0 && (
                <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {selectedCategories.length}
                </span>
              )}
            </Button>

            {/* Sort Dropdown */}
            <Select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              options={sortOptions}
              className="min-w-[180px]"
            />

            <CurrencySelector showLabel={false} />

            {/* View Toggle */}
            <div className="flex gap-4 border-gray-300 rounded-xs overflow-hidden">
              <button
                onClick={() => onViewChange('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewChange('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {isFilterOpen && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
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
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="ml-2 text-sm text-gray-700">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Min price"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Max price"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
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

export default SearchAndFilters; 