import React, { useState } from 'react';
import { useCurrency } from '../../../../hooks';
import { CurrencyListView, AddCurrencyModal, UpdateCurrencyModal } from '.';
import { Button, DeleteModal } from '../../../ui';

const CurrencySettings = () => {
  const { currencies, loading, createCurrency, updateCurrency, deleteCurrency, setBaseCurrency } = useCurrency();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleEdit = (currency) => {
    setSelectedCurrency(currency);
    setEditModalOpen(true);
  };

  const handleDelete = (currency) => {
    setSelectedCurrency(currency);
    setDeleteModalOpen(true);
  };

  const handleSetBase = async (currency) => {
    const success = await setBaseCurrency(currency._id);
    if (success) {
      setEditModalOpen(false);
      setSelectedCurrency(null);
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    const success = await deleteCurrency(selectedCurrency._id);
    setDeleteLoading(false);
    if (success) {
      setDeleteModalOpen(false);
      setSelectedCurrency(null);
    }
  };

  const handleCreateSubmit = async (data) => {
    const success = await createCurrency(data);
    if (success) {
      setIsModalOpen(false);
    }
    return success;
  };

  const handleUpdateSubmit = async (data) => {
    const success = await updateCurrency(selectedCurrency._id, data);
    if (success) {
      setEditModalOpen(false);
      setSelectedCurrency(null);
    }
    return success;
  };

  return (
    <section className="p-6">
      <div className="flex justify-end items-center mb-4">
        <Button
          onClickHandler={() => setIsModalOpen(true)}
          additionalClasses="bg-accent text-white"
        >
          Add Currency
        </Button>
      </div>

      <CurrencyListView
        currencies={currencies}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSetBase={handleSetBase}
      />

      <AddCurrencyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateSubmit}
        loading={loading}
      />
      
      <UpdateCurrencyModal
        isOpen={editModalOpen}
        onClose={() => { setEditModalOpen(false); setSelectedCurrency(null); }}
        onSubmit={handleUpdateSubmit}
        loading={loading}
        initialData={selectedCurrency}
      />
      
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setSelectedCurrency(null); }}
        onConfirm={handleDeleteConfirm}
        itemName={selectedCurrency?.name}
        title="Delete Currency"
        loading={deleteLoading}
      />
    </section>
  );
}; 

export default CurrencySettings;