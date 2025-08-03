import React, { useEffect } from "react";
import { useProducts } from "../../../hooks/useProducts";
import { Table, Pagination, DropdownMenu, StatusPill, AdvancedFilters } from "../../ui";
import { Edit, Trash2, Eye } from "lucide-react";
import { useCategory } from "../../../hooks";

const ProductTable = ({ onEdit, onView, onDelete }) => {
  const [isSearching, setIsSearching] = React.useState(false);
  
  const {
    loading,
    filters,
    pagination,
    filteredProducts,
    actions,
    fetchProducts
  } = useProducts();

  const { categories, loading: categoriesLoading } = useCategory();

  // Filter configurations
  const filterConfigs = [
    {
      key: 'category',
      label: 'Category',
      defaultValue: 'all',
      colorClass: 'bg-blue-100 text-blue-800',
      options: [
        { value: 'all', label: 'All Categories' },
        ...(categories || []).map(cat => ({
          value: cat._id || cat.id,
          label: cat.name
        }))
      ]
    },
    {
      key: 'status',
      label: 'Stock',
      defaultValue: 'all',
      colorClass: 'bg-green-100 text-green-800',
      options: [
        { value: 'all', label: 'All Stock' },
        { value: 'in_stock', label: 'In Stock' },
        { value: 'limited_stock', label: 'Limited Stock' },
        { value: 'out_of_stock', label: 'Out of Stock' },
      ]
    },
    {
      key: 'priceRange',
      label: 'Price',
      defaultValue: 'all',
      colorClass: 'bg-purple-100 text-purple-800',
      options: [
        { value: 'all', label: 'All Prices' },
        { value: 'low', label: 'Low Price' },
        { value: 'medium', label: 'Medium Price' },
        { value: 'high', label: 'High Price' },
      ]
    }
  ];

  // Load products on component mount only
  useEffect(() => {
    fetchProducts();
  }, []); // Empty dependency array - only run on mount

  // No need to refetch when filters change since filtering is client-side

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    actions.setFilter(filterType, value);
  };

  // Handle search
  const handleSearch = (searchTerm) => {
    actions.setSearch(searchTerm);
  };

  // Handle searching state change
  const handleSearchingChange = (searching) => {
    setIsSearching(searching);
  };

  const columns = [
    {
      Header: "Image",
      accessor: "images",
      Cell: ({ row }) =>
        row.images && row.images.length > 0 ? (
          <img src={row.images[0]} alt={row.name} className="w-12 h-12 object-cover rounded border" />
        ) : (
          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">No Image</div>
        ),
    },
    { Header: "Name", accessor: "name" },
    {
      Header: "Category",
      accessor: "category",
      Cell: ({ row }) =>
        <span className="">{row.category?.name || 'N/A'}</span>
    },
    { 
      Header: "Price", 
      accessor: "price", 
      Cell: ({ row }) => {
        const currency = row.currency;
        if (currency && currency.symbol) {
          return currency.position === 'after' 
            ? `${row.price} ${currency.symbol}`
            : `${currency.symbol} ${row.price}`;
        }
        return `${row.price}`;
      }
    },
    { 
      Header: "Stock", 
      accessor: "stock",
      Cell: ({ row }) => row.stock || 0
    },
    {
      Header: "Status",
      accessor: "stock_status",
      Cell: ({ row }) => {
        const stock = row.stock || 0;
        const status = stock > 10 ? "in_stock" : stock === 0 ? "out_of_stock" : "limited_stock";
        return <StatusPill status={status} />;
      }
    },
    {
      id: "actions",
      Header: "Actions",
      Cell: ({ row }) => {
        const menuItems = [
          {
            label: "View Details",
            icon: <Eye size={16} />,
            onClick: () => onView(row),
          },
          {
            label: "Edit Product",
            icon: <Edit size={16} />,
            onClick: () => onEdit(row),
          },
          {
            label: "Delete Product",
            icon: <Trash2 size={16} />,
            onClick: () => onDelete(row),
            isDestructive: true,
          },
        ];
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu items={menuItems} />
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Advanced Search and Filters */}
      <AdvancedFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onClearAll={actions.clearAllFilters}
        onSearchingChange={handleSearchingChange}
        filterConfigs={filterConfigs}
        searchPlaceholder="Search products by name, description, or SKU..."
        loading={loading}
      />

      {/* Products Table */}
      <Table
        columns={columns}
        data={filteredProducts}
        isLoading={loading || isSearching}
        emptyStateMessage="No products found. Try adjusting your filters or check back later."
        onRowClick={onView}
        clickableRows={true}
      />

      {/* Pagination */}
      {pagination.total > pagination.limit && (
        <div className="flex justify-center mt-6">
          <Pagination
            currentPage={pagination.page}
            totalPages={Math.ceil(pagination.total / pagination.limit)}
            onPageChange={fetchProducts}
          />
        </div>
      )}
    </div>
  );
};

export default ProductTable;