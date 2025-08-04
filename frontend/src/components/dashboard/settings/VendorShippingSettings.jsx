import React, { useState, useEffect } from 'react';
import { useVendorShipping } from '../../../hooks/useVendorShipping';
import { getVendorShippingProfiles } from '../../../services/shippingService';

const VendorShippingSettings = () => {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState('default');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    currency: 'XAF',
    freeShippingThreshold: 50000,
    processingTime: '1-2 business days',
    zones: {}
  });

  useEffect(() => {
    const availableProfiles = getVendorShippingProfiles();
    setProfiles(availableProfiles);
  }, []);

  const handleProfileSelect = (profileId) => {
    setSelectedProfile(profileId);
    setIsEditing(false);
    
    // Load profile data for editing
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      setFormData({
        name: profile.name,
        currency: profile.currency,
        freeShippingThreshold: profile.freeShippingThreshold,
        processingTime: profile.processingTime,
        zones: profile.zones || {}
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // TODO: Implement API call to save vendor shipping profile
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to selected profile
    const profile = profiles.find(p => p.id === selectedProfile);
    if (profile) {
      setFormData({
        name: profile.name,
        currency: profile.currency,
        freeShippingThreshold: profile.freeShippingThreshold,
        processingTime: profile.processingTime,
        zones: profile.zones || {}
      });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">Vendor Shipping Settings</h2>
        <button
          onClick={() => setIsEditing(true)}
          className="bg-primary text-white px-4 py-2 rounded-sm hover:bg-primary/90 transition-colors"
        >
          Add New Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-800 mb-4">Shipping Profiles</h3>
            <div className="space-y-2">
              {profiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => handleProfileSelect(profile.id)}
                  className={`w-full text-left p-3 rounded-sm border transition-colors ${
                    selectedProfile === profile.id
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{profile.name}</div>
                  <div className="text-sm text-gray-500">
                    {profile.currency} • {profile.processingTime}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                {isEditing ? 'Edit Profile' : 'Profile Details'}
              </h3>
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="text-primary hover:text-primary/80 text-sm font-medium"
                >
                  Edit
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="XAF">XAF (Central African CFA franc)</option>
                    <option value="USD">USD (US Dollar)</option>
                    <option value="EUR">EUR (Euro)</option>
                    <option value="GBP">GBP (British Pound)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Free Shipping Threshold
                  </label>
                  <input
                    type="number"
                    value={formData.freeShippingThreshold}
                    onChange={(e) => handleInputChange('freeShippingThreshold', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Processing Time
                  </label>
                  <input
                    type="text"
                    value={formData.processingTime}
                    onChange={(e) => handleInputChange('processingTime', e.target.value)}
                    placeholder="e.g., 1-2 business days"
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    className="bg-primary text-white px-4 py-2 rounded-sm hover:bg-primary/90 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-sm hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Name</label>
                  <p className="text-gray-900">{formData.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <p className="text-gray-900">{formData.currency}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Free Shipping Threshold</label>
                  <p className="text-gray-900">{formData.freeShippingThreshold.toLocaleString()} {formData.currency}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Processing Time</label>
                  <p className="text-gray-900">{formData.processingTime}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Shipping Zones Preview */}
      <div className="bg-white rounded-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Shipping Zones</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries({
            'Douala': { baseRate: 1000, deliveryTime: '1-2 business days' },
            'Yaoundé': { baseRate: 1500, deliveryTime: '1-2 business days' },
            'Bamenda': { baseRate: 2000, deliveryTime: '2-3 business days' },
            'Buea': { baseRate: 1800, deliveryTime: '2-3 business days' },
            'Kribi': { baseRate: 2200, deliveryTime: '2-3 business days' },
            'Other Cities': { baseRate: 3500, deliveryTime: '4-5 business days' }
          }).map(([zone, info]) => (
            <div key={zone} className="border border-gray-200 rounded-sm p-3">
              <h4 className="font-medium text-gray-800">{zone}</h4>
              <p className="text-sm text-gray-600">
                {info.baseRate.toLocaleString()} {formData.currency}
              </p>
              <p className="text-xs text-gray-500">{info.deliveryTime}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VendorShippingSettings; 