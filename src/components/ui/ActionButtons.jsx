import React from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';

const ActionButtons = ({ 
  onView, 
  onEdit, 
  onDelete, 
  row, 
  viewTitle = "View", 
  editTitle = "Edit", 
  deleteTitle = "Delete" 
}) => {
  return (
    <div className="flex items-center justify-center gap-2">
      {onView && (
        <button
          onClick={() => onView(row)}
          className="w-9 h-9 flex items-center justify-center rounded-full text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200"
          title={viewTitle}
        >
          <Eye size={16} strokeWidth={2} />
        </button>
      )}

      {onEdit && (
        <button
          onClick={() => onEdit(row)}
          className="w-9 h-9 flex items-center justify-center rounded-full text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200"
          title={editTitle}
        >
          <Edit2 size={16} strokeWidth={2} />
        </button>
      )}

      {onDelete && (
        <button
          onClick={() => onDelete(row)}
          className="w-9 h-9 flex items-center justify-center rounded-full text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200"
          title={deleteTitle}
        >
          <Trash2 size={16} strokeWidth={2} />
        </button>
      )}
    </div>
  );
};

export default ActionButtons;
