import React from "react";
import { Table, StatusPill, DropdownMenu } from "../../ui";
import { Edit, Trash2 } from "lucide-react";

const CategoriesListView = ({ onEdit, onDelete, loading, categories }) => {
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
        Header: "Products",
        accessor: "productCount",
        Cell: ({ row }) => <span>{row.productCount}</span>,
      },
      {
        Header: "Services",
        accessor: "serviceCount",
        Cell: ({ row }) => <span>{row.serviceCount}</span>,
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
              label: "Edit Category",
              icon: <Edit size={16} />,
              onClick: () => onEdit(row),
            },
            {
              label: "Delete Category",
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
    <Table
      columns={columns}
      data={categories}
      isLoading={loading}
      emptyStateMessage="No categories found. Try adjusting your filters or adding a new category."
    />
  );
};

export default CategoriesListView;
