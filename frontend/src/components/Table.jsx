const Table = ({ columns, data = [], actions }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                {col.header}
              </th>
            ))}
            {actions && <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className="px-3 lg:px-6 py-8 text-center text-gray-500">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="px-3 lg:px-6 py-4 text-sm text-gray-900">
                    <div className="break-words">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </div>
                  </td>
                ))}
                {actions && (
                  <td className="px-3 lg:px-6 py-4 text-sm">
                    <div className="flex gap-1 lg:gap-2">
                      {actions(row)}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
