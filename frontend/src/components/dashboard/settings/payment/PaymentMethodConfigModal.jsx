import React, { useState, useEffect } from 'react';
import { ModalWrapper, Button } from '../../../ui';
import { X } from 'lucide-react';
import { paymentMethodApi } from '../../../../api/paymentMethod';
import { toast } from 'react-toastify';
import { 
  ConfigFormRenderer, 
  ConfigurationStatus, 
  SecurityNotice 
} from './config';
import { getConfigKey } from './config/configUtils';

const PaymentMethodConfigModal = ({ isOpen, onClose, paymentMethod, onConfigUpdated }) => {
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    if (paymentMethod && paymentMethod.config) {
      setConfig(paymentMethod.config);
    }
    checkConfigurationStatus();
  }, [paymentMethod]);

  const checkConfigurationStatus = async () => {
    if (!paymentMethod?._id) return;
    
    try {
      const response = await paymentMethodApi.verifyPaymentMethodConfig(paymentMethod._id);
      setIsConfigured(response.isConfigured);
    } catch (error) {
      console.error('Error checking configuration status:', error);
    }
  };

  const handleConfigChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!paymentMethod?._id) return;

    setLoading(true);
    try {
      const configData = {
        config: {
          [getConfigKey(paymentMethod?.type)]: config
        }
      };
      
      // Call the parent's update function instead of making API call directly
      const success = await onConfigUpdated(configData);
      if (success) {
        await checkConfigurationStatus();
      }
    } catch (error) {
      console.error('Configuration update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update configuration');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !paymentMethod) return null;

  return (
    <ModalWrapper>
      <div className="p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10"
        >
          <X size={24} />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-primary mb-2">
            Configure {paymentMethod.name}
          </h2>
          <p className="text-gray-600">
            Set up the configuration for {paymentMethod.name} payment method.
          </p>
        </div>

        {/* Configuration Status */}
        <ConfigurationStatus isConfigured={isConfigured} />

        {/* Configuration Form */}
        <ConfigFormRenderer 
          paymentMethod={paymentMethod}
          config={config}
          onConfigChange={handleConfigChange}
        />

        {/* Security Notice */}
        <SecurityNotice />

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            onClickHandler={onClose}
            additionalClasses="border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClickHandler={handleSave}
            additionalClasses="primarybtn"
            isLoading={loading}
            isDisabled={loading}
          >
            {loading ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default PaymentMethodConfigModal; 