import React from 'react';
import { Select, Input } from '../../../../ui';
import { FolderOpen, Settings, Users } from 'lucide-react';

const ConfigurationStep = ({ formData, errors, categories, onInputChange }) => {
  const categoryOptions = categories?.map(cat => ({
    value: cat._id,
    label: cat.name
  })) || [];

  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "maintenance", label: "Maintenance" },
  ];

  return (
    <div className="space-y-6">      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category */}
        <Select
          label="Category"
          options={categoryOptions}
          value={formData.category}
          onChange={(e) => onInputChange("category", e.target.value)}
          placeholder="Select category"
          error={errors.category}
          required          
        />

        {/* Status */}
        <Select
          label="Status"
          options={statusOptions}
          value={formData.status}
          onChange={(e) => onInputChange("status", e.target.value)}
          placeholder="Select status"          
        />

        {/* Requires Staff */}
        <Select
          label="Requires Staff"
          options={[
            { value: true, label: "Yes" },
            { value: false, label: "No" }
          ]}
          value={formData.requiresStaff}
          onChange={(e) => onInputChange("requiresStaff", e.target.value === 'true')}          
        />

      </div>
      {/* Tags */}
      <div>
      <Input
        label="Tags (Optional)"
        value={formData.tags}
        onChangeHandler={(e) => onInputChange("tags", e.target.value)}
        placeholder="Enter tags separated by commas"
        additionalClasses="border-line_clr"
      />
      <p className="text-xs text-gray-500 mt-1">
        Add tags to help customers find your service (e.g., "haircut, styling, quick")
      </p>
    </div>

      {/* Status Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            <span className="text-sm font-medium text-blue-900">Draft</span>
          </div>
          <p className="text-xs text-blue-700 mt-1">Service is not yet published</p>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            <span className="text-sm font-medium text-green-900">Active</span>
          </div>
          <p className="text-xs text-green-700 mt-1">Service is available for booking</p>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-gray-500 rounded-full mr-3"></div>
            <span className="text-sm font-medium text-gray-900">Inactive</span>
          </div>
          <p className="text-xs text-gray-700 mt-1">Service is temporarily unavailable</p>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationStep; 