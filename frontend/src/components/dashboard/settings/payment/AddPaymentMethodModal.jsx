import React, { useState, useEffect } from 'react';
import { ModalWrapper, Button, Input } from '../../../ui';
import { X, Plus, CreditCard, Smartphone, Building, Wallet, Bitcoin, DollarSign } from 'lucide-react';
import { paymentMethodApi } from '../../../../api/paymentMethod';
import { toast } from 'react-toastify';

const AddPaymentMethodModal = ({ isOpen, onClose, onPaymentMethodCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    type: '',
    isActive: false, // Start as inactive until configured
    isOnline: false,
    requiresSetup: false,
    supportedCurrencies: ['XAF'],
    fees: 0,
    minAmount: 0,
    maxAmount: null,
    sortOrder: 0,
    customerFields: []
  });
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      fetchPaymentTypes();
    }
  }, [isOpen]);

  const fetchPaymentTypes = async () => {
    try {
      const response = await paymentMethodApi.getPaymentMethodTypes();
      setPaymentTypes(response.types);
    } catch (error) {
      console.error('Error fetching payment types:', error);
      toast.error('Failed to load payment method types');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Auto-generate code from name
    if (name === 'name') {
      const code = value.toUpperCase().replace(/[^A-Z0-9]/g, '_');
      setFormData(prev => ({ ...prev, code }));
    }

    // Update customer fields when type changes
    if (name === 'type') {
      const selectedType = paymentTypes.find(type => type.value === value);
      if (selectedType) {
        setFormData(prev => ({
          ...prev,
          type: value,
          requiresSetup: selectedType.requiresSetup,
          isOnline: selectedType.isOnline,
          // Set active status based on whether setup is required
          isActive: !selectedType.requiresSetup, // Only active if no setup required
          customerFields: selectedType.defaultCustomerFields ? 
            selectedType.defaultCustomerFields.map(field => ({
              name: field.name,
              label: field.label,
              type: field.type,
              required: field.required,
              placeholder: field.placeholder,
              options: field.options
            })) : []
        }));
      }
    }
  };

  const handleCurrencyChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      supportedCurrencies: checked
        ? [...prev.supportedCurrencies, value]
        : prev.supportedCurrencies.filter(curr => curr !== value)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Code is required';
    }

    if (!formData.type) {
      newErrors.type = 'Payment type is required';
    }

    if (formData.fees < 0) {
      newErrors.fees = 'Fees cannot be negative';
    }

    if (formData.minAmount < 0) {
      newErrors.minAmount = 'Minimum amount cannot be negative';
    }

    if (formData.maxAmount !== null && formData.maxAmount <= 0) {
      newErrors.maxAmount = 'Maximum amount must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Clean the data before sending to backend - only include allowed fields
      const cleanData = {
        name: formData.name,
        code: formData.code,
        description: formData.description,
        type: formData.type,
        isActive: formData.isActive,
        isOnline: formData.isOnline,
        requiresSetup: formData.requiresSetup,
        supportedCurrencies: formData.supportedCurrencies,
        fees: formData.fees,
        minAmount: formData.minAmount,
        maxAmount: formData.maxAmount,
        sortOrder: formData.sortOrder,
        config: {}, // Initialize empty config object
        customerFields: formData.customerFields.map(field => {
          const cleanField = {
            name: field.name || '',
            label: field.label || '',
            type: field.type || 'text',
            required: field.required || false
          };
          
          // Only add optional fields if they have values
          if (field.placeholder && field.placeholder.trim()) {
            cleanField.placeholder = field.placeholder;
          }
          
          if (field.options && field.options.length > 0) {
            cleanField.options = field.options;
          }
          
          return cleanField;
        })
      };

      const success = await onPaymentMethodCreated(cleanData);
      if (success) {
        onClose();
        resetForm();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create payment method');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      type: '',
      isActive: false, // Reset to inactive
      isOnline: false,
      requiresSetup: false,
      supportedCurrencies: ['XAF'],
      fees: 0,
      minAmount: 0,
      maxAmount: null,
      sortOrder: 0,
      customerFields: []
    });
    setErrors({});
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'MOBILE_MONEY':
        return <Smartphone className="w-5 h-5" />;
      case 'BANK_TRANSFER':
        return <Building className="w-5 h-5" />;
      case 'CARD_PAYMENT':
        return <CreditCard className="w-5 h-5" />;
      case 'PAYPAL':
        return <Wallet className="w-5 h-5" />;
      case 'CRYPTO':
        return <Bitcoin className="w-5 h-5" />;
      case 'CASH_ON_DELIVERY':
        return <DollarSign className="w-5 h-5" />;
      default:
        return <Plus className="w-5 h-5" />;
    }
  };

  const currencies = [
    { code: 'XAF', name: 'Central African CFA Franc' },
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'NGN', name: 'Nigerian Naira' },
    { code: 'GHS', name: 'Ghanaian Cedi' },
    { code: 'KES', name: 'Kenyan Shilling' },
    { code: 'ZAR', name: 'South African Rand' }
  ];

  if (!isOpen) return null;

  return (
    <ModalWrapper>
      <div className="p-6 w-full max-w-4xl relative max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10"
        >
          <X size={24} />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-primary mb-2">
            Add New Payment Method
          </h2>
          <p className="text-gray-600">
            Create a new payment method with its configuration settings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChangeHandler={handleChange}
              error={errors.name}
              required
            />
            <Input
              label="Code"
              name="code"
              value={formData.code}
              onChangeHandler={handleChange}
              error={errors.code}
              placeholder="e.g., MTN_MOMO, ORANGE_MONEY"
              required
            />
          </div>

          <Input
            label="Description"
            name="description"
            value={formData.description}
            onChangeHandler={handleChange}
            placeholder="Brief description of the payment method"
          />

          {/* Payment Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Payment Type *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {paymentTypes.map((type) => (
                <div
                  key={type.value}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    formData.type === type.value
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleChange({ target: { name: 'type', value: type.value } })}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-md ${
                      formData.type === type.value ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {getTypeIcon(type.value)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{type.label}</h4>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {errors.type && (
              <p className="text-red-500 text-sm mt-1">{errors.type}</p>
            )}
          </div>

          {/* Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                disabled={formData.requiresSetup}
                className={`h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded ${
                  formData.requiresSetup ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              />
              <label htmlFor="isActive" className={`ml-2 block text-sm ${
                formData.requiresSetup ? 'text-gray-500' : 'text-gray-700'
              }`}>
                {formData.requiresSetup ? 'Active (Configure first)' : 'Active'}
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isOnline"
                name="isOnline"
                checked={formData.isOnline}
                onChange={handleChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="isOnline" className="ml-2 block text-sm text-gray-700">
                Online Payment
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="requiresSetup"
                name="requiresSetup"
                checked={formData.requiresSetup}
                onChange={handleChange}
                disabled
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded opacity-50 cursor-not-allowed"
              />
              <label htmlFor="requiresSetup" className="ml-2 block text-sm text-gray-500">
                Requires Setup
              </label>
            </div>
          </div>

          {/* Fees and Limits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Processing Fee (%)"
              name="fees"
              type="number"
              value={formData.fees}
              onChangeHandler={handleChange}
              error={errors.fees}
              min="0"
              step="0.01"
              required={false}
            />
            <Input
              label="Minimum Amount"
              name="minAmount"
              type="number"
              value={formData.minAmount}
              onChangeHandler={handleChange}
              error={errors.minAmount}
              min="0"
              required={false}
            />
            <Input
              label="Maximum Amount"
              name="maxAmount"
              type="number"
              value={formData.maxAmount || ''}
              onChangeHandler={handleChange}
              error={errors.maxAmount}
              min="0"
              placeholder="Leave empty for no limit"
              required={false}
            />
          </div>

          {/* Supported Currencies */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Supported Currencies
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {currencies.map((currency) => (
                <div key={currency.code} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`currency-${currency.code}`}
                    value={currency.code}
                    checked={formData.supportedCurrencies.includes(currency.code)}
                    onChange={handleCurrencyChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor={`currency-${currency.code}`} className="ml-2 block text-sm text-gray-700">
                    {currency.code} - {currency.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Fields Preview */}
          {formData.customerFields.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Customer Input Fields
              </label>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600 mb-2">
                  Customers will need to provide the following information when using this payment method:
                </p>
                <ul className="space-y-1">
                  {formData.customerFields.map((field, index) => (
                    <li key={index} className="text-sm text-gray-700">
                      • {field.label} ({field.type}) {field.required && <span className="text-red-500">*</span>}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> After creating this payment method, you'll need to configure it with your specific account details (API keys, account numbers, etc.) in the payment method settings.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Configuration Notice */}
          {formData.requiresSetup && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Configuration Required
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      This payment method requires additional configuration after creation and will be <strong>inactive</strong> until configured. You'll need to:
                    </p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Add your account credentials (API keys, account numbers, etc.)</li>
                      <li>Configure webhook URLs if required</li>
                      <li>Test the payment method to ensure it works correctly</li>
                      <li><strong>Activate the payment method</strong> once configuration is complete</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              onClickHandler={onClose}
              additionalClasses="border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              additionalClasses="primarybtn"
              isLoading={loading}
              isDisabled={loading}
            >
              {loading ? 'Creating...' : 'Create Payment Method'}
            </Button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};

export default AddPaymentMethodModal;
