import React, { useEffect } from "react";
import { Table, Pagination, DropdownMenu, StatusPill, AdvancedFilters, FadeInContainer } from "../../ui";
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
    clearAllFilters,
    loading,
    activateService,
    deactivateService
  } = useService();

  const { categories } = useCategory();
  const { currencies } = useCurrency();

  // Filter configurations
  const filterConfigs = [
    {
      key: 'category',
      label: 'Category',
      defaultValue: '',
      colorClass: 'bg-blue-100 text-blue-800',
      options: [
        { value: '', label: 'All Categories' },
        ...(categories || []).map(cat => ({
          value: cat._id,
          label: cat.name
        }))
      ]
    },
    {
      key: 'status',
      label: 'Status',
      defaultValue: '',
      colorClass: 'bg-green-100 text-green-800',
      options: [
        { value: '', label: 'All Statuses' },
        { value: 'draft', label: 'Draft' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'maintenance', label: 'Maintenance' },
      ]
    },
    {
      key: 'requiresStaff',
      label: 'Staff',
      defaultValue: '',
      colorClass: 'bg-purple-100 text-purple-800',
      options: [
        { value: '', label: 'All Services' },
        { value: 'true', label: 'Requires Staff' },
        { value: 'false', label: 'No Staff Required' },
      ]
    }
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
      {/* Advanced Search and Filters */}
      <FadeInContainer delay={200} duration={600}>
        <AdvancedFilters
          filters={{ ...filters, search }}
          onFilterChange={handleFilterChange}
          onSearch={setSearch}
          onClearAll={clearAllFilters}
          filterConfigs={filterConfigs}
          searchPlaceholder="Search services by name or description..."
        />
      </FadeInContainer>

      {/* Table */}
      <FadeInContainer delay={400} duration={600}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <Table
            columns={columns}
            data={services}
            loading={loading}
            className="min-h-[400px]"
            emptyStateMessage="No services found"
          />
        </div>
      </FadeInContainer>

      {/* Pagination */}
      <FadeInContainer delay={600} duration={600}>
        <div className="flex justify-center">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </div>
      </FadeInContainer>
    </div>
  );
};

export default ServicesListView; 