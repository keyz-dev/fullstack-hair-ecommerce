import React from "react";
import cn from "classnames";

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-4 align-middle [&:has([role=checkbox])]:pr-0 relative",
      className
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const Table = ({ columns, data, emptyStateMessage, onRowClick, clickableRows = false, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="p-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {col.Header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(5)].map((_, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                  >
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        {emptyStateMessage || "No data available."}
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <table className="w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.Header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr 
              key={rowIndex} 
              className={cn(
                "hover:bg-gray-50",
                clickableRows && onRowClick && "cursor-pointer"
              )}
              onClick={clickableRows && onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((col, index) => (
                <TableCell
                  key={index}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                >
                  {col.Cell ? col.Cell({ row }) : row[col.accessor]}
                </TableCell>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
