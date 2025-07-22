import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ placeholder, searchTerm, setSearchTerm }) => {
  return (
    <div className="relative w-full rounded-xs bg-white">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={18} className="text-gray-400" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xs focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
      />
    </div>
  );
};

export default SearchBar;
