import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal'; // તમારી પાસે ઓલરેડી છે

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, variant = 'danger' }) {
  const isDanger = variant === 'danger';

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm"
      footer={
        <div className="flex items-center gap-2 w-full">
          <button onClick={onClose} className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-600 text-[13px] font-bold rounded-xl hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            className={`flex-1 py-2.5 text-white text-[13px] font-bold rounded-xl transition-colors ${isDanger ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-700 hover:bg-emerald-800'}`}
          >
            {isDanger ? 'Delete' : 'Confirm'}
          </button>
        </div>
      }
    >
      <div className="flex flex-col items-center text-center py-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${isDanger ? 'bg-rose-50' : 'bg-emerald-50'}`}>
          <AlertTriangle className={`w-7 h-7 ${isDanger ? 'text-rose-500' : 'text-emerald-700'}`} />
        </div>
        <h3 className="text-[16px] font-bold text-slate-800 mb-2">{title || 'Are you sure?'}</h3>
        <p className="text-[13px] text-slate-400 font-medium leading-relaxed max-w-xs">{message || 'This action cannot be undone.'}</p>
      </div>
    </Modal>
  );
}