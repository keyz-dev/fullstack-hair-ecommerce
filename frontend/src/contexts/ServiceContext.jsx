import React, { createContext, useContext, useState, useCallback } from 'react';
import { serviceApi } from '../api/service';
import { toast } from 'react-toastify';

const ServiceContext = createContext();

export const ServiceProvider = ({ children }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    featured: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    total: 0,
  });
  const [filters, setFilters] = useState({
    category: '',
    isActive: '',
    staff: '',
  });
  const [search, setSearch] = useState('');

  const fetchServices = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = {
        page: pagination.page,
        limit: pagination.limit,
        search,
        ...filters,
        ...params,
      };
      
      const response = await serviceApi.getAllServices(queryParams);
      
      if (response.success) {
        setServices(response.services || response.data || []);
        if (response.pagination) {
          setPagination(prev => ({
            ...prev,
            page: response.pagination.page,
            totalPages: response.pagination.totalPages,
            total: response.pagination.total,
          }));
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch services');
      toast.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, filters]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await serviceApi.getServiceStats();
      if (response.success) {
        setStats(response.stats || response.data || {
          total: 0,
          active: 0,
          inactive: 0,
          featured: 0,
        });
      }
    } catch (err) {
      console.error('Failed to fetch service stats:', err);
    }
  }, []);

  const createService = useCallback(async (serviceData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await serviceApi.addService(serviceData);
      if (response.success) {
        toast.success('Service created successfully');
        await fetchServices();
        await fetchStats();
        return true;
      }
      return false;
    } catch (err) {
      setError(err.message || 'Failed to create service');
      toast.error('Failed to create service');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchServices, fetchStats]);

  const updateService = useCallback(async (id, serviceData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await serviceApi.updateService(id, serviceData);
      if (response.success) {
        toast.success('Service updated successfully');
        await fetchServices();
        await fetchStats();
        return true;
      }
      return false;
    } catch (err) {
      setError(err.message || 'Failed to update service');
      toast.error('Failed to update service');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchServices, fetchStats]);

  const deleteService = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await serviceApi.deleteService(id);
      if (response.success) {
        toast.success('Service deleted successfully');
        await fetchServices();
        await fetchStats();
        return true;
      }
      return false;
    } catch (err) {
      setError(err.message || 'Failed to delete service');
      toast.error('Failed to delete service');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchServices, fetchStats]);

  const setPage = useCallback((page) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const setLimit = useCallback((limit) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }));
  }, []);

  const updateFilters = useCallback((newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const updateSearch = useCallback((searchTerm) => {
    setSearch(searchTerm);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const value = {
    services,
    loading,
    error,
    stats,
    pagination,
    filters,
    search,
    fetchServices,
    fetchStats,
    createService,
    updateService,
    deleteService,
    setPage,
    setLimit,
    setFilters: updateFilters,
    setSearch: updateSearch,
  };

  return (
    <ServiceContext.Provider value={value}>
      {children}
    </ServiceContext.Provider>
  );
};

export const useService = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useService must be used within a ServiceProvider');
  }
  return context;
}; 