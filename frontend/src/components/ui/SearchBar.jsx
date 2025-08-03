import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ placeholder, searchTerm, setSearchTerm, value, onChange }) => {
  const handleChange = (e) => {
    const newValue = e.target.value;
    if (setSearchTerm) {
      setSearchTerm(newValue);
    }
    if (onChange) {
      onChange(newValue);
    }
  };

  const currentValue = value || searchTerm || '';
  return (
    <div className="relative w-full rounded-xs bg-white">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={18} className="text-gray-400" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={currentValue}
        onChange={handleChange}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xs focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
      />
    </div>
  );
};

export default SearchBar;
