import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { serviceApi } from '../api/service';
import { toast } from 'react-toastify';

// Utility function to extract error message from API errors
const extractErrorMessage = (error) => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }
  if (error?.message) {
    return error.message;
  }
  return "An unexpected error occurred";
};

const ServiceContext = createContext();

export const ServiceProvider = ({ children }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    draft: 0,
    inactive: 0,
    withStaff: 0,
    withoutStaff: 0,
    byCategory: []
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    total: 0,
  });
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    requiresStaff: '',
    minPrice: '',
    maxPrice: '',
    minDuration: '',
    maxDuration: '',
    staff: ''
  });
  const [search, setSearch] = useState('');

  // Fetch all services (only once on mount)
  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await serviceApi.getAllServices({
        limit: 1000, // Get all services for client-side filtering
      });
      
      if (response.success) {
        setServices(response.services || []);
      } else {
        setServices([]);
      }
    } catch (err) {
      const errorMessage = extractErrorMessage(err) || "Failed to fetch services";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Client-side filtering and pagination
  const getFilteredServices = useCallback(() => {
    let filtered = services.filter(service => {
      // Category filter
      if (filters.category && filters.category !== '') {
        const serviceCategoryId = typeof service.category === 'object' ? service.category._id : service.category;
        if (serviceCategoryId !== filters.category) {
          return false;
        }
      }
      
      // Status filter
      if (filters.status && filters.status !== '') {
        if (service.status !== filters.status) {
          return false;
        }
      }
      
      // Requires staff filter
      if (filters.requiresStaff && filters.requiresStaff !== '') {
        const requiresStaff = filters.requiresStaff === 'true';
        if (service.requiresStaff !== requiresStaff) {
          return false;
        }
      }
      
      // Price range filters
      if (filters.minPrice && filters.minPrice !== '') {
        if (service.basePrice < parseFloat(filters.minPrice)) {
          return false;
        }
      }
      
      if (filters.maxPrice && filters.maxPrice !== '') {
        if (service.basePrice > parseFloat(filters.maxPrice)) {
          return false;
        }
      }
      
      // Duration range filters
      if (filters.minDuration && filters.minDuration !== '') {
        if (service.duration < parseFloat(filters.minDuration)) {
          return false;
        }
      }
      
      if (filters.maxDuration && filters.maxDuration !== '') {
        if (service.duration > parseFloat(filters.maxDuration)) {
          return false;
        }
      }
      
      // Staff filter
      if (filters.staff && filters.staff !== '') {
        const serviceStaff = service.staff || [];
        if (!serviceStaff.some(staff => 
          (typeof staff === 'object' ? staff._id : staff) === filters.staff
        )) {
          return false;
        }
      }
      
      // Search filter
      if (search) {
        const searchTerm = search.toLowerCase();
        const name = service.name?.toLowerCase() || '';
        const description = service.description?.toLowerCase() || '';
        
        if (!name.includes(searchTerm) && !description.includes(searchTerm)) {
          return false;
        }
      }
      
      return true;
    });

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return filtered;
  }, [services, filters.category, filters.status, filters.requiresStaff, filters.minPrice, filters.maxPrice, filters.minDuration, filters.maxDuration, filters.staff, search]);

  // Get paginated services from filtered results
  const getPaginatedServices = useCallback(() => {
    const filtered = getFilteredServices();
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    return filtered.slice(startIndex, endIndex);
  }, [getFilteredServices, pagination.page, pagination.limit]);

  // Calculate pagination info from filtered results
  const getPaginationInfo = useCallback(() => {
    const filtered = getFilteredServices();
    const total = filtered.length;
    const totalPages = Math.ceil(total / pagination.limit);
    return { total, totalPages };
  }, [getFilteredServices, pagination.limit]);

  const fetchActiveServices = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await serviceApi.getActiveServices(params);
      
      if (response.success) {
        setServices(response.services || []);
      }
    } catch (err) {
      const errorMessage = extractErrorMessage(err) || "Failed to fetch active services";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await serviceApi.getServiceStats();
      if (response.success) {
        setStats(response.stats || {
          total: 0,
          active: 0,
          draft: 0,
          inactive: 0,
          withStaff: 0,
          withoutStaff: 0,
          byCategory: []
        });
      }
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      console.error('Failed to fetch service stats:', errorMessage);
    }
  }, []);

  const createService = useCallback(async (serviceData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await serviceApi.addService(serviceData);
      if (response.success) {
        await fetchServices();
        await fetchStats();
        toast.success('Service created successfully');
        return true;
      }
      return false;
    } catch (err) {
      console.log('Service creation error details:', {
        error: err,
        response: err.response,
        data: err.response?.data,
        message: err.message
      });
      const errorMessage = extractErrorMessage(err) || "Failed to create service";
      setError(errorMessage);
      toast.error(errorMessage);
      // Re-throw the error so the calling component can handle it
      throw new Error(errorMessage);
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
      const errorMessage = extractErrorMessage(err) || "Failed to update service";
      setError(errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
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
      const errorMessage = extractErrorMessage(err) || "Failed to delete service";
      setError(errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchServices, fetchStats]);

  const assignStaff = useCallback(async (serviceId, staffIds) => {
    setLoading(true);
    setError(null);
    try {
      const response = await serviceApi.assignStaff(serviceId, staffIds);
      if (response.success) {
        toast.success('Staff assigned successfully');
        await fetchServices();
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage = extractErrorMessage(err) || "Failed to assign staff";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchServices]);

  const activateService = useCallback(async (serviceId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await serviceApi.activateService(serviceId);
      if (response.success) {
        toast.success('Service activated successfully');
        await fetchServices();
        await fetchStats();
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage = extractErrorMessage(err) || "Failed to activate service";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchServices, fetchStats]);

  const deactivateService = useCallback(async (serviceId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await serviceApi.deactivateService(serviceId);
      if (response.success) {
        toast.success('Service deactivated successfully');
        await fetchServices();
        await fetchStats();
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage = extractErrorMessage(err) || "Failed to deactivate service";
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchServices, fetchStats]);

  // Client-side filter actions (no API calls)
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

  const clearAllFilters = useCallback(() => {
    const clearedFilters = {
      category: '',
      status: '',
      requiresStaff: '',
      minPrice: '',
      maxPrice: '',
      minDuration: '',
      maxDuration: '',
      staff: ''
    };
    setFilters(clearedFilters);
    setSearch('');
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  // Fetch services on mount only
  useEffect(() => {
    fetchServices();
  }, []); // Empty dependency array - only run on mount

  // Update pagination info when filters change
  useEffect(() => {
    const { total, totalPages } = getPaginationInfo();
    setPagination(prev => ({
      ...prev,
      total,
      totalPages
    }));
  }, [getPaginationInfo]);

  const value = {
    services: getPaginatedServices(), // Return paginated services
    allServices: services, // All services for reference
    loading,
    error,
    stats,
    pagination: {
      ...pagination,
      ...getPaginationInfo()
    },
    filters,
    search,
    fetchServices,
    fetchActiveServices,
    fetchStats,
    createService,
    updateService,
    deleteService,
    assignStaff,
    activateService,
    deactivateService,
    setPage,
    setLimit,
    setFilters: updateFilters,
    setSearch: updateSearch,
    clearAllFilters,
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