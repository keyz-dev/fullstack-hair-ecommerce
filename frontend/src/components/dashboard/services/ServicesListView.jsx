import React, { useEffect } from "react";
import { Table, SearchBar, FilterDropdown, Pagination, DropdownMenu, StatusPill } from "../../ui";
import { Edit, Trash2, Clock, DollarSign, Users, Eye, Power, PowerOff } from "lucide-react";
import { useService } from "../../../hooks";
import { useCategory } from "../../../hooks";
import { useCurrency } from "../../../hooks";
import { formatPriceWithSymbol, getCurrencyByCode } from "../../../utils/currencyUtils";

const ServicesListView = ({ onEdit, onView, onDelete }) => {
  const {
    services, 
    pagination, 
    fetchServices, 
    setPage, 
    setSearch, 
    search, 
    filters, 
    setFilters,
    loading,
    activateService,
    deactivateService
  } = useService();

  const { categories } = useCategory();
  const { currencies } = useCurrency();

  // Filter options
  const categoryOptions = [
    { value: "", label: "All Categories" },
    ...(categories || []).map(cat => ({
      value: cat._id,
      label: cat.name
    }))
  ];

  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "maintenance", label: "Maintenance" },
  ];

  const staffRequirementOptions = [
    { value: "", label: "All Services" },
    { value: "true", label: "Requires Staff" },
    { value: "false", label: "No Staff Required" },
  ];

  useEffect(() => {
    fetchServices();
  }, [pagination.page, filters, search, fetchServices]);

  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
    setPage(1);
  };

  const handleStatusToggle = async (service) => {
    try {
      if (service.status === 'active') {
        await deactivateService(service._id);
      } else {
        await activateService(service._id);
      }
    } catch (error) {
      console.error('Error toggling service status:', error);
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Image",
        accessor: "image",
        Cell: ({ row }) => {
          return row.image ? (
            <img
              src={row.image}
              alt={row.name}
              className="w-12 h-12 object-cover rounded-full border"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-500">
              No Image
            </div>
          );
        },
      },
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ row }) => <span className="font-semibold">{row.name}</span>,
      },
      {
        Header: "Category",
        accessor: "category",
        Cell: ({ row }) => (
          <span className="text-sm text-gray-600">
            {row.category?.name || 'N/A'}
          </span>
        ),
      },
      {
        Header: "Price",
        accessor: "basePrice",
        Cell: ({ row }) => {
          const currencyCode = row.currency || 'XAF';
          const currencyData = getCurrencyByCode(currencyCode, currencies);
          const formattedPrice = formatPriceWithSymbol(row.basePrice, currencyData, currencyCode);
          
          return (
            <div className="flex items-center gap-1">
              <span className="font-medium">
                {formattedPrice}
              </span>
            </div>
          );
        },
      },
      {
        Header: "Duration",
        accessor: "duration",
        Cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Clock size={14} className="text-blue-600" />
            <span className="text-sm">{row.duration} min</span>
          </div>
        ),
      },
      {
        Header: "Staff",
        accessor: "staff",
        Cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Users size={14} className="text-purple-600" />
            <span className="text-sm">
              {row.requiresStaff ? 
                (row.staff?.length || 0) + ' assigned' : 
                'Not required'
              }
            </span>
          </div>
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }) => {
          const getStatusConfig = (status) => {
            if (status === 'active') {
              return { status: "active", text: "Active" };
            } else if (status === 'draft') {
              return { status: "draft", text: "Draft" };
            } else if (status === 'inactive') {
              return { status: "inactive", text: "Inactive" };
            } else if (status === 'maintenance') {
              return { status: "maintenance", text: "Maintenance" };
            }
            return { status: "draft", text: "Draft" };
          };

          const statusConfig = getStatusConfig(row.status);
          
          return (
            <StatusPill
              status={statusConfig.status}
              text={statusConfig.text}
            />
          );
        },
      },
      {
        Header: "Created",
        accessor: "createdAt",
        Cell: ({ row }) => new Date(row.createdAt).toLocaleDateString(),
      },
      {
        id: "actions",
        Cell: ({ row }) => {
          const menuItems = [
            {
              label: "View Service",
              icon: <Eye size={16} />,
              onClick: () => onView(row),
            },
            {
              label: "Edit Service",
              icon: <Edit size={16} />,
              onClick: () => onEdit(row),
            },
            {
              label: row.status === 'active' ? "Deactivate" : "Activate",
              icon: row.status === 'active' ? <PowerOff size={16} /> : <Power size={16} />,
              onClick: () => handleStatusToggle(row),
            },
            {
              label: "Delete Service",
              icon: <Trash2 size={16} />,
              onClick: () => onDelete(row),
              isDestructive: true,
            },
          ];
          return <DropdownMenu items={menuItems} />;
        },
      },
    ],
    [onEdit, onView, onDelete, handleStatusToggle]
  );

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="w-full md:w-1/3">
          <SearchBar placeholder="Search services..." value={search} onChange={(value) => setSearch(value)} />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <FilterDropdown
            options={categoryOptions}
            value={filters.category}
            onChange={(value) => handleFilterChange("category", value)}
            placeholder="Filter by category"
          />
          <FilterDropdown
            options={statusOptions}
            value={filters.status}
            onChange={(value) => handleFilterChange("status", value)}
            placeholder="Filter by status"
          />
          <FilterDropdown
            options={staffRequirementOptions}
            value={filters.requiresStaff}
            onChange={(value) => handleFilterChange("requiresStaff", value)}
            placeholder="Staff requirement"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <Table
          columns={columns}
          data={services}
          loading={loading}
          className="min-h-[400px]"
        />
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default ServicesListView; 