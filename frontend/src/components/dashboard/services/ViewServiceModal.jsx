import React from 'react';
import { ModalWrapper } from '../../ui';
import { X, Clock, DollarSign, Users, Tag, FileText, Calendar } from 'lucide-react';

const ViewServiceModal = ({ isOpen, onClose, service }) => {
  if (!isOpen || !service) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ModalWrapper>
      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Service Details</h2>
            <p className="text-sm text-gray-600 mt-1">View service information</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
          <div className="p-6">
            {/* Service Image */}
            {service.image && (
              <div className="mb-6">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full max-w-md h-64 object-cover rounded-lg border"
                />
              </div>
            )}

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Service Name</label>
                    <p className="text-gray-900">{service.name}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Description</label>
                    <p className="text-gray-900">{service.description}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Category</label>
                    <p className="text-gray-900">{service.category?.name || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(service.status)}`}>
                      {service.status}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Duration</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-green-600" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Base Price</label>
                      <p className="text-gray-900">{service.basePrice} {service.currency || 'XAF'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-blue-600" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Duration</label>
                      <p className="text-gray-900">{service.duration} minutes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-purple-600" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Staff Required</label>
                      <p className="text-gray-900">{service.requiresStaff ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                  
                  {service.staff && service.staff.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Assigned Staff</label>
                      <div className="mt-1">
                        {service.staff.map((staffMember, index) => (
                          <span key={staffMember._id} className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mr-2 mb-1">
                            {staffMember.name || staffMember.email}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-6">
              {/* Special Instructions */}
              {service.specialInstructions && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText size={20} />
                    Special Instructions
                  </h3>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{service.specialInstructions}</p>
                </div>
              )}

              {/* Cancellation Policy */}
              {service.cancellationPolicy && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Cancellation Policy</h3>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{service.cancellationPolicy}</p>
                </div>
              )}

              {/* Tags */}
              {service.tags && service.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Tag size={20} />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {service.tags.map((tag, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar size={20} />
                  Timestamps
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Created</label>
                    <p className="text-gray-900">{formatDate(service.createdAt)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Updated</label>
                    <p className="text-gray-900">{formatDate(service.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ViewServiceModal; 