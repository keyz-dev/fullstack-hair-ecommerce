import React, { useState, useEffect } from "react";
import { ServiceStatSection, ServicesListView, AddServiceModal, UpdateServiceModal, ViewServiceModal } from ".";
import { Button, DeleteModal } from "../../ui";
import { toast } from "react-toastify";
import { useService } from "../../../hooks";

const ServicesMainView = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const { deleteService, loading, fetchStats } = useService();

  // Fetch stats on component mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleEdit = (service) => {
    setSelectedService(service);
    setEditModalOpen(true);
  };

  const handleView = (service) => {
    setSelectedService(service);
    setViewModalOpen(true);
  };

  const handleDelete = (service) => {
    setSelectedService(service);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    const result = await deleteService(selectedService._id);
    if (result) {
      toast.success("Service deleted successfully");
      setDeleteModalOpen(false);
      setSelectedService(null);
    }
  };

  return (
    <section>
      <ServiceStatSection />
      <div className="flex justify-end items-center mb-4">
        <Button 
          onClickHandler={() => setIsModalOpen(true)} 
          additionalClasses="bg-accent text-white"
        >
          Add Service
        </Button>
      </div>
      
      <ServicesListView onEdit={handleEdit} onView={handleView} onDelete={handleDelete} />
      
      <AddServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      
      <UpdateServiceModal
        isOpen={editModalOpen}
        onClose={() => { setEditModalOpen(false); setSelectedService(null); }}
        initialData={selectedService}
      />

      <ViewServiceModal
        isOpen={viewModalOpen}
        onClose={() => { setViewModalOpen(false); setSelectedService(null); }}
        service={selectedService}
      />
      
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setSelectedService(null); }}
        onConfirm={handleDeleteConfirm}
        title="Delete Service"
        message={`Are you sure you want to delete "${selectedService?.name}"? This action cannot be undone.`}
        loading={loading}
      />
    </section>
  );
};

export default ServicesMainView; 