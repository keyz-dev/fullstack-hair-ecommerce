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

const Table = ({ columns, data, emptyStateMessage }) => {
  if (!data || data.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        {emptyStateMessage || "No data available."}
      </div>
    );
  }

  return (
    <div className="">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.accessor}
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
            <tr key={rowIndex} className="hover:bg-gray-50">
              {columns.map((col) => (
                <TableCell
                  key={col.accessor}
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
