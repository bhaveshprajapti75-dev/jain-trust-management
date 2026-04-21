import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import Skeleton, { TableSkeleton } from './Skeleton';
import EmptyState from './EmptyState';

export default function Table({  // Add 'default' here
  columns,
  data,
  loading,
  sortKey,
  sortDir,
  onSort,
  onRowClick,
  emptyMessage = 'No data found',
  emptyDescription,
  emptyAction,
  rowKey = 'id',
  skipCard = false,
  variant = 'primary', // Default to existing style
  pagination = null, // Optional pagination component
}) {
  if (loading) return (
    <div className="p-4 bg-white rounded-xl border border-slate-100">
      <TableSkeleton rows={8} columns={columns?.length || 5} />
    </div>
  );
  if (!data || data.length === 0) {
    return <EmptyState message={emptyMessage} description={emptyDescription} action={emptyAction} />;
  }

  const tableWrapperClass = skipCard 
    ? `overflow-hidden bg-white ${variant === 'emerald' ? 'rounded-none border-none' : 'border border-slate-200 rounded-xl'}` 
    : "border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm";

  const headerBgClass = variant === 'emerald' ? 'bg-emerald-800' : 'bg-[#10b981]';

  return (
    <div className={tableWrapperClass}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`${headerBgClass} text-white text-[13px] font-semibold h-11`}>
              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                return (
                  <th 
                    key={col.key} 
                    className={`${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'} px-5 py-3 tracking-wider ${col.sortable ? 'cursor-pointer select-none hover:text-emerald-900 transition-colors' : ''}`}
                    onClick={() => { if (col.sortable && onSort) onSort(col.key); }}
                  >
                    <span className={`inline-flex items-center gap-1 ${col.align === 'center' ? 'justify-center' : col.align === 'right' ? 'justify-end' : ''}`}>
                      {col.label}
                      {col.sortable && isSorted && (sortDir === 'asc' ? <ChevronUp className="w-3 h-3 text-white" /> : <ChevronDown className="w-3 h-3 text-white" />)}
                    </span>
                  </th>
                );
              })}
             </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {data.map((row, i) => (
              <tr 
                key={row?.[rowKey] || i} 
                onClick={() => { if (onRowClick) onRowClick(row); }}
                className={`transition-colors group border-b border-slate-200 last:border-none ${onRowClick ? 'cursor-pointer hover:bg-slate-50/50' : ''}`}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-5 py-3 ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}`}>
                    {col.render ? col.render(row?.[col.key], row, i) : <span className="text-[12.5px] font-medium text-slate-700">{row?.[col.key]}</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {pagination && (
        <div className="px-2 border-t border-slate-200">
          {pagination}
        </div>
      )}
      </div>
    </div>
  );
}

// Also export Skeleton and TableSkeleton if needed elsewhere
export { Skeleton, TableSkeleton };