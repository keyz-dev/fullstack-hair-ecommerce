import React, { useState } from 'react';
import { X } from 'lucide-react';

const TagInput = ({ 
  label, 
  value = [], 
  onChangeHandler, 
  placeholder = "Add tags...",
  maxTags = 10,
  className = "" 
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const addTag = () => {
    const tag = inputValue.trim();
    if (tag && !value.includes(tag) && value.length < maxTags) {
      onChangeHandler([...value, tag]); 
      setInputValue('');
    }
  };

  const removeTag = (index) => {
    const newTags = value.filter((_, i) => i !== index);
    onChangeHandler(newTags);
  };

  const handleBlur = () => {
    addTag();
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-primary mb-2">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-xs focus-within:ring focus-within:ring-accent focus-within:border-accent">
        {value.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-accent/10 text-primary rounded-xs"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="text-accent/50 hover:text-accent cursor-pointer"
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={value.length >= maxTags ? `Maximum ${maxTags} tags` : placeholder}
          disabled={value.length >= maxTags}
          className="flex-1 min-w-0 outline-none text-sm"
        />
      </div>
      {value.length >= maxTags && (
        <p className="text-xs text-gray-500 mt-1">
          Maximum {maxTags} tags allowed
        </p>
      )}
    </div>
  );
};

export default TagInput; 