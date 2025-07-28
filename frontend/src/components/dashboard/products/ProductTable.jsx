import React, { useEffect } from "react";
import { useProducts } from "../../../hooks/useProducts";
import { Table, SearchBar, FilterDropdown, Pagination, DropdownMenu, StatusPill } from "../../ui";
import { Edit, Trash2 } from "lucide-react";

const ProductTable = ({ onEdit, onDelete }) => {
  const {
    products, page, totalPages, fetchProducts, setPage, setSearch, search, filters, setFilters
  } = useProducts();

  // Example filter options (replace with real categories/statuses)
  const categoryOptions = [{ value: "", label: "All Categories" }];
  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "in", label: "In Stock" },
    { value: "out", label: "Out of Stock" },
  ];

  useEffect(() => {
    fetchProducts();
  }, [page, filters, search, fetchProducts]);

  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
    setPage(1);
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
        <span className="">{row.category.name || 'Cat name'}</span>
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
    { Header: "Stock", accessor: "stock" },
    {
      Header: "Status",
      accessor: "stock_status",
      Cell: ({ row }) => {
        const status = row.stock > 10 ? "in_stock" : row.stock === 0 ? "out_of_stock" : "limited_stock";
        return <StatusPill status={status} />;
      },
    },  
    {
      id: "actions",
      Cell: ({ row }) => {
        const menuItems = [
          {
            label: "Update",
            icon: <Edit size={16} />,
            onClick: () => onEdit(row),
          },
          {
            label: "Delete",
            icon: <Trash2 size={16} />,
            onClick: () => onDelete(row),
            isDestructive: true,
          },
        ];
        return <DropdownMenu items={menuItems} />;
      },
    },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <div className="w-full md:w-1/3">
          <SearchBar placeholder="Search products..." searchTerm={search} setSearchTerm={setSearch} />
        </div>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <FilterDropdown label="Category" options={categoryOptions} selected={filters.category || ""} setSelected={val => handleFilterChange("category", val)} />
          <FilterDropdown label="Status" options={statusOptions} selected={filters.stock || ""} setSelected={val => handleFilterChange("stock", val)} />
        </div>
      </div>
      <Table columns={columns} data={products} emptyStateMessage="No products found." />
      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
};

export default ProductTable;