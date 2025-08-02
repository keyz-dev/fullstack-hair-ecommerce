import React from 'react';

const Select = ({ label, value, onChange, options = [], error, required, placeholder, name, additionalClasses = "" }) => {
    return (
        <div>
            {label && <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-xs focus:outline-none focus:ring-accent focus:border-accent ${additionalClasses}`}
                required={required}
            >
                {placeholder && <option value="" disabled>{placeholder}</option>}
                {Array.isArray(options) && options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
};

export default Select;
