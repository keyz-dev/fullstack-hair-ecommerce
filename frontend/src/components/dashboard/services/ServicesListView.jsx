import React, { useEffect } from "react";
import { Table, SearchBar, FilterDropdown, Pagination, DropdownMenu, StatusPill } from "../../ui";
import { Edit, Trash2, Clock, DollarSign } from "lucide-react";
import { useService } from "../../../hooks";

const ServicesListView = ({ onEdit, onDelete }) => {
  const {
    services, page, totalPages, fetchServices, setPage, setSearch, search, filters, setFilters
  } = useService();

  // Example filter options (replace with real categories/statuses)
  const categoryOptions = [{ value: "", label: "All Categories" }];
  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "true", label: "Active" },
    { value: "false", label: "Inactive" },
  ];

  useEffect(() => {
    fetchServices();
  }, [page, filters, search, fetchServices]);

  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
    setPage(1);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Image",
        accessor: "image",
        Cell: ({ row }) =>
          row.image ? (
            <img
              src={row.image}
              alt={row.name}
              className="w-12 h-12 object-cover rounded-full border"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-500">
              No Image
            </div>
          ),
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
        accessor: "price",
        Cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <DollarSign size={14} className="text-green-600" />
            <span className="font-medium">
              {row.price} {row.currency}
            </span>
          </div>
        ),
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
        Header: "Status",
        accessor: "isActive",
        Cell: ({ row }) => (
          <StatusPill
            status={row.isActive ? "active" : "inactive"}
            text={row.isActive ? "Active" : "Inactive"}
          />
        ),
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
              label: "Edit Service",
              icon: <Edit size={16} />,
              onClick: () => onEdit(row),
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
    [onEdit, onDelete]
  );

  return (
    <div className="bg-white rounded-sm shadow-sm border">
      <div className="p-4 border-b">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <SearchBar
              placeholder="Search services..."
              value={search}
              onChange={(value) => setSearch(value)}
              className="min-w-[200px]"
            />
            <FilterDropdown
              options={categoryOptions}
              value={filters.category}
              onChange={(value) => handleFilterChange("category", value)}
              placeholder="Filter by category"
            />
            <FilterDropdown
              options={statusOptions}
              value={filters.isActive}
              onChange={(value) => handleFilterChange("isActive", value)}
              placeholder="Filter by status"
            />
          </div>
        </div>
      </div>

      <Table
        columns={columns}
        data={services}
        loading={false}
        className="min-h-[400px]"
      />

      <div className="p-4 border-t">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default ServicesListView; 