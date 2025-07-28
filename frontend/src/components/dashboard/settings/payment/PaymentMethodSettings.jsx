import React, { useState } from 'react';
import { usePaymentMethods } from '../../../../hooks';
import { PaymentMethodListView } from './';
import AddPaymentMethodModal from './AddPaymentMethodModal';
import { Button } from '../../../ui';

export const PaymentMethodSettings = () => {
  const {
    paymentMethods,
    loading,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    togglePaymentMethodStatus,
  } = usePaymentMethods();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = async (data) => {
    const success = await createPaymentMethod(data);
    if (success) setIsModalOpen(false);
    return success;
  };

  return (
    <section className="p-6">
      <div className="flex justify-end items-center mb-4">
        <Button onClickHandler={() => setIsModalOpen(true)} additionalClasses="bg-accent text-white">
          Add Payment Method
        </Button>
      </div>
      <PaymentMethodListView
        paymentMethods={paymentMethods}
        loading={loading}
        onEdit={() => {}}
        onDelete={deletePaymentMethod}
        onToggleStatus={togglePaymentMethodStatus}
      />
      <AddPaymentMethodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreate}
        loading={loading}
      />
    </section>
  );
}; 

export default PaymentMethodSettings;