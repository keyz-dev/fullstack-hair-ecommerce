import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from '../../ui';

const DateRangePicker = ({ onRangeChange, currentRange = '30d' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const predefinedRanges = [
    { label: 'Last 7 days', value: '7d' },
    { label: 'Last 30 days', value: '30d' },
    { label: 'Last 90 days', value: '90d' },
    { label: 'Last 6 months', value: '6m' },
    { label: 'Last year', value: '1y' }
  ];

  const handleRangeSelect = (range) => {
    onRangeChange(range);
    setIsOpen(false);
  };

  const handleCustomRange = () => {
    if (startDate && endDate) {
      const range = `${startDate.toISOString().split('T')[0]}_${endDate.toISOString().split('T')[0]}`;
      onRangeChange(range);
      setIsOpen(false);
    }
  };

  const getCurrentRangeLabel = () => {
    const range = predefinedRanges.find(r => r.value === currentRange);
    return range ? range.label : 'Custom range';
  };

  return (
    <div className="relative">
      <Button
        onClickHandler={() => setIsOpen(!isOpen)}
        additionalClasses="border border-line_clr text-secondary min-h-fit py-[8px]"
      >
        <Calendar className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {getCurrentRangeLabel()}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Select Date Range</h3>
            
            {/* Predefined ranges */}
            <div className="space-y-2 mb-4">
              {predefinedRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => handleRangeSelect(range.value)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    currentRange === range.value
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            {/* Custom range */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Custom Range</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                  <ReactDatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm"
                    placeholderText="Start date"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">End Date</label>
                  <ReactDatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm"
                    placeholderText="End date"
                  />
                </div>
              </div>
              <button
                onClick={handleCustomRange}
                disabled={!startDate || !endDate}
                className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Apply Custom Range
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker; 