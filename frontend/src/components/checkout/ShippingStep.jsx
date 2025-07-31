import React from 'react';
import { Input, Button } from '../ui';
import { Truck } from 'lucide-react';
import { calculateShipping } from '../../services/shippingService';

const ShippingStep = ({ 
  shippingAddress, 
  onShippingAddressChange, 
  onNext, 
  onBack,
  subtotal 
}) => {
  const validateStep = () => {
    return shippingAddress.address && 
           shippingAddress.city && 
           shippingAddress.state && 
           shippingAddress.postalCode;
  };

  const shippingInfo = calculateShipping(shippingAddress.city, subtotal);

  return (
    <div className="bg-white rounded-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-primary mb-6">Shipping Address</h2>
      
      <div className="space-y-4">
        <Input
          label="Address"
          name="address"
          value={shippingAddress.address}
          onChangeHandler={onShippingAddressChange}
          required
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="City"
            name="city"
            value={shippingAddress.city}
            onChangeHandler={onShippingAddressChange}
            required
          />
          <Input
            label="State/Province"
            name="state"
            value={shippingAddress.state}
            onChangeHandler={onShippingAddressChange}
            required
          />
          <Input
            label="ZIP Code"
            name="postalCode"
            value={shippingAddress.postalCode}
            onChangeHandler={onShippingAddressChange}
            required
          />
        </div>
        <Input
          label="Country"
          name="country"
          value={shippingAddress.country}
          onChangeHandler={onShippingAddressChange}
          required
        />
      </div>

      {/* Shipping Information */}
      {shippingAddress.city && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
          <h3 className="font-semibold text-gray-800 mb-2">Shipping Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Zone:</span>
              <span className="font-medium">{shippingInfo.zone}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Time:</span>
              <span className="font-medium">{shippingInfo.deliveryTime}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Cost:</span>
              <span className={`font-medium ${shippingInfo.isFree ? 'text-green-600' : ''}`}>
                {shippingInfo.isFree ? 'Free' : `${shippingInfo.cost} XAF`}
              </span>
            </div>
            {!shippingInfo.isFree && (
              <div className="text-xs text-gray-600 mt-2">
                Free shipping on orders over {shippingInfo.freeShippingThreshold} XAF
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <Button
          onClickHandler={onBack}
          additionalClasses="border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Back
        </Button>
        <Button
          onClickHandler={onNext}
          additionalClasses="bg-primary text-white hover:bg-primary/90"
          isDisabled={!validateStep()}
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  );
};

export default ShippingStep; 