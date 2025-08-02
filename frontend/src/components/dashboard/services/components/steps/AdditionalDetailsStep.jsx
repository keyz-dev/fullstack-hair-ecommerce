import React, { useState } from 'react';
import { Input, TextArea } from '../../../../ui';
import { Info } from 'lucide-react';

const AdditionalDetailsStep = ({ formData, onInputChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-6">
        {/* Special Instructions */}
        <div>          
          <TextArea
            label="Special Instructions (Optional)"
            value={formData.specialInstructions}
            onChangeHandler={(e) => onInputChange("specialInstructions", e.target.value)}
            placeholder="Any special instructions for this service"
            additionalClasses="border-line_clr"
            rows={4}
          />
          
          <p className="text-xs text-gray-500 mt-1">
            Provide any specific instructions or requirements for this service
          </p>
        </div>

        {/* Cancellation Policy */}
        <div>         
          <TextArea
            label="Cancellation Policy (Optional)"
            value={formData.cancellationPolicy}
            onChangeHandler={(e) => onInputChange("cancellationPolicy", e.target.value)}
            placeholder="Cancellation policy for this service"
            additionalClasses="border-line_clr"
            rows={4}
          />
          
          <p className="text-xs text-gray-500 mt-1">
            Specify the cancellation terms and conditions
          </p>
        </div>
      </div>

      {/* Collapsible Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg mt-6">
        <button
          type="button"
          className="w-full flex items-center justify-between p-4 focus:outline-none"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
        >
          <span className="flex items-center">
            <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
            <span className="text-sm font-medium text-blue-900">
              Tips for Better Service
            </span>
          </span>
          <svg
            className={`h-4 w-4 text-blue-500 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 20 20"
          >
            <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {open && (
          <div className="px-4 pb-4">
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Be specific about special instructions to avoid misunderstandings</li>
              <li>• Clear cancellation policies help build customer trust</li>
              <li>• Use relevant tags to improve service discoverability</li>
            </ul>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default AdditionalDetailsStep; 