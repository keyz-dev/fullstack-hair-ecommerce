import React, { useState } from 'react';
import { usePaymentMethods } from '../../../../hooks';
import { PaymentMethodListView } from './';
import AddPaymentMethodModal from './AddPaymentMethodModal';
import PaymentMethodConfigModal from './PaymentMethodConfigModal';
import { Button, DeleteModal } from '../../../ui';

export const PaymentMethodSettings = () => {
  const {
    paymentMethods,
    loading,
    createPaymentMethod,
    // updatePaymentMethod,
    deletePaymentMethod,
    togglePaymentMethodStatus,
    updatePaymentMethodConfig,
  } = usePaymentMethods();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleCreate = async (data) => {
    const success = await createPaymentMethod(data);
    if (success) setIsModalOpen(false);
    return success;
  };

  const handleEdit = (paymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
    setIsConfigModalOpen(true);
  };

  const handleConfigUpdate = async (configData) => {
    if (selectedPaymentMethod) {
      const success = await updatePaymentMethodConfig(selectedPaymentMethod._id, configData);
      if (success) {
        setIsConfigModalOpen(false);
        setSelectedPaymentMethod(null);
      }
      return success;
    }
  };

  const handleConfigModalClose = () => {
    setIsConfigModalOpen(false);
    setSelectedPaymentMethod(null);
  };

  const handleDelete = (paymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    const success = await deletePaymentMethod(selectedPaymentMethod._id);
    setDeleteLoading(false);
    if (success) {
      setDeleteModalOpen(false);
      setSelectedPaymentMethod(null);
    }
    return success;
  };

  return (
    <section className="">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Methods</h2>
          <p className="text-gray-600 mt-1">Manage payment methods and their configurations</p>
        </div>
        <Button onClickHandler={() => setIsModalOpen(true)} additionalClasses="primarybtn">
          Add Payment Method
        </Button>
      </div>
      
      <PaymentMethodListView
        paymentMethods={paymentMethods}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={togglePaymentMethodStatus}
      />
      
      <AddPaymentMethodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPaymentMethodCreated={handleCreate}
      />
      
      <PaymentMethodConfigModal
        isOpen={isConfigModalOpen}
        onClose={handleConfigModalClose}
        paymentMethod={selectedPaymentMethod}
        onConfigUpdated={handleConfigUpdate}
        loading={loading}
      />
      
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setSelectedPaymentMethod(null); }}
        onConfirm={handleDeleteConfirm}
        itemName={selectedPaymentMethod?.name}
        title="Delete Payment Method"
        loading={deleteLoading}
      />
    </section>
  );
}; 

export default PaymentMethodSettings;