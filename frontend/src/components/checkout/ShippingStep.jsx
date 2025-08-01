import React, { useState } from 'react';
import { Input, Button } from '../ui';
import { MapPin, Loader2 } from 'lucide-react';
import { calculateShipping } from '../../services/shippingService';
import { getCurrentPosition, reverseGeocode, formatCameroonAddress, getLocationErrorMessage } from '../../utils/locationUtils';

const ShippingStep = ({ 
  shippingAddress, 
  onShippingAddressChange, 
  onNext, 
  onBack,
  subtotal 
}) => {
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const validateStep = () => {
    return shippingAddress.address && 
           shippingAddress.city && 
           shippingAddress.state && 
           shippingAddress.postalCode;
  };

  const shippingInfo = calculateShipping(shippingAddress.city, subtotal);

  const getCurrentLocation = async () => {
    setIsGettingLocation(true);

    try {
      // Get current position
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      
      // Reverse geocode to get address
      const geocodeData = await reverseGeocode(latitude, longitude);
      
      // Format address for Cameroon
      const locationData = formatCameroonAddress(geocodeData);

      // Update shipping address fields
      Object.entries(locationData).forEach(([key, value]) => {
        if (value) {
          onShippingAddressChange({
            target: { name: key, value }
          });
        }
      });
    } catch (error) {
      console.error('Error getting location:', error);
      alert(getLocationErrorMessage(error));
    } finally {
      setIsGettingLocation(false);
    }
  };

  return (
    <div className="bg-white rounded-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-primary mb-6">Shipping Address</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Address <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
              className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGettingLocation ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <MapPin size={16} />
              )}
              {isGettingLocation ? 'Getting location...' : 'Use current location'}
            </button>
          </div>
          <Input
            label="Address"
            name="address"
            type="text"
            value={shippingAddress.address}
            onChangeHandler={onShippingAddressChange}
            required={true}
            placeholder="Enter your street address"
          />
          
        </div>
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