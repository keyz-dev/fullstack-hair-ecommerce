import React, { useState, useCallback, useEffect } from 'react';
import { Search, Filter, X, Loader2 } from 'lucide-react';

const AdvancedFilters = ({ 
  filters, 
  onFilterChange, 
  onSearch, 
  onClearAll,
  filterConfigs = [],
  searchPlaceholder = "Search...",
  className = "",
  loading = false,
  debounceMs = 300,
  onSearchingChange
}) => {
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.search) {
        setIsSearching(true);
        onSearch(searchValue);
        // Reset searching state after a short delay to show the search was processed
        setTimeout(() => setIsSearching(false), 200);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchValue, filters.search, onSearch, debounceMs]);

  // Notify parent component when searching state changes
  useEffect(() => {
    if (onSearchingChange) {
      onSearchingChange(isSearching);
    }
  }, [isSearching, onSearchingChange]);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const clearFilters = useCallback(() => {
    setSearchValue('');
    if (onClearAll) {
      onClearAll();
    } else {
      // Fallback: Clear all filters to their default values
      filterConfigs.forEach(config => {
        onFilterChange(config.key, config.defaultValue || '');
      });
      onSearch('');
    }
  }, [onClearAll, filterConfigs, onFilterChange, onSearch]);

  const hasActiveFilters = () => {
    const hasFilterActive = filterConfigs.some(config => 
      filters[config.key] !== (config.defaultValue || '') && filters[config.key] !== ''
    );
    return hasFilterActive || searchValue;
  };

  const getFilterLabel = (config) => {
    const value = filters[config.key];
    if (value === (config.defaultValue || '') || value === '') return null;
    
    const option = config.options?.find(opt => opt.value === value);
    return option?.label || value;
  };

  const handleFilterChange = useCallback((key, value) => {
    onFilterChange(key, value);
  }, [onFilterChange]);

  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Search */}
        <div className="w-full sm:flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-xs outline-0 focus:ring focus:ring-accent focus:border-accent"
              disabled={loading}
            />
            {(isSearching || loading) && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-1 md:justify-start lg:justify-end md:flex-wrap gap-4"> 
          {filterConfigs.map((config) => (
            <div key={config.key} className="flex flex-col sm:flex-row sm:items-center space-x-2 space-y-1">
              <label className="text-sm font-medium text-gray-700">{config.label}:</label>
              <select
                value={filters[config.key] || config.defaultValue || ''}
                onChange={(e) => handleFilterChange(config.key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xs outline-0 text-sm focus:ring focus:ring-accent focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {config.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Clear Filters */}
        {hasActiveFilters() && (
          <div className="flex justify-end">
            <button
              onClick={clearFilters}
              disabled={loading}
              className="flex items-center space-x-1 px-3 py-2 text-sm text-secondary hover:text-primary hover:bg-gray-100 rounded-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-4 h-4" />
              <span>Clear</span>
            </button>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters() && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Active Filters:</span>
            <div className="flex items-center space-x-2 flex-wrap gap-2">
              {filterConfigs.map((config) => {
                const label = getFilterLabel(config);
                if (!label) return null;
                
                return (
                  <span 
                    key={config.key}
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.colorClass || 'bg-blue-100 text-blue-800'}`}
                  >
                    {config.label}: {label}
                    <button
                      onClick={() => handleFilterChange(config.key, config.defaultValue || '')}
                      className="ml-1 hover:opacity-70"
                      disabled={loading}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
              {searchValue && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-primary">
                  Search: "{searchValue}"
                  <button
                    onClick={() => setSearchValue('')}
                    className="ml-1 hover:text-secondary"
                    disabled={loading}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters; 