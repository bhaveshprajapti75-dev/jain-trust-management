import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Edit2, Trash2, Eye, X, Check, AlertTriangle, ArrowLeft } from 'lucide-react';
import StatusToggle from '../../components/common/StatusToggle';
import { generateOrgInitialData, INITIAL_SANGHS } from './orgData';

const OrgTable = forwardRef(({ activeTab, searchTerm, itemsPerPage, currentPage, setTotalEntries, onDataChange }, ref) => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('org_storage_v1');
    return saved ? JSON.parse(saved) : generateOrgInitialData();
  });

  const [modal, setModal] = useState({ isOpen: false, type: '', data: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Sync LocalStorage
  useEffect(() => {
    localStorage.setItem('org_storage_v1', JSON.stringify(data));
    if (onDataChange) {
      onDataChange({
        Trust: data.Trust.length,
        Sangh: data.Sangh.length,
        Linked: data.Sangh.filter(s => s.trustId).length
      });
    }
  }, [data]);

  // Open modal from parent
  useImperativeHandle(ref, () => ({
    openAddModal: () => {
      setModal({ isOpen: true, type: 'add', data: { status: true } });
    }
  }));

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false }), 3000);
  };

  // Logic for filtering
  const filteredData = (activeTab === 'Trust' ? data.Trust : 
                       activeTab === 'Sangh' ? data.Sangh : 
                       activeTab === 'Linked' ? data.Sangh.filter(s => s.trustId) :
                       [...data.Trust, ...data.Sangh]).filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => { setTotalEntries(filteredData.length); }, [filteredData.length]);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="w-full">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-10 right-10 z-[1000] bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-2xl animate-bounce flex items-center gap-3">
          <Check size={20} /> <span className="font-bold uppercase text-xs">{toast.message}</span>
        </div>
      )}

      {/* Main Table */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-emerald-500 text-white text-[11px] font-bold uppercase tracking-widest">
              <th className="w-16 px-6 py-4 text-center">Sr.</th>
              <th className="px-6 py-4 text-left">Organization Name</th>
              <th className="px-6 py-4 text-center">Location</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {paginatedData.map((row, idx) => (
              <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-center text-slate-400">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                <td className="px-6 py-4 font-bold text-slate-700">{row.name}</td>
                <td className="px-6 py-4 text-center text-slate-500 font-medium">{row.city}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <StatusToggle status={row.status} onToggle={() => {}} />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-4">
                    <button className="text-slate-400 hover:text-emerald-500 transition-colors"><Eye size={16} /></button>
                    <button className="text-slate-400 hover:text-blue-500 transition-colors"><Edit2 size={16} /></button>
                    <button onClick={() => setDeleteConfirm({show: true, id: row.id})} className="text-slate-400 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Simple */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-xs w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-lg font-black text-slate-800">Are you sure?</h3>
            <p className="text-xs text-slate-400 mt-2 uppercase font-bold tracking-widest">This action is permanent</p>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setDeleteConfirm({show: false})} className="flex-1 py-3 bg-slate-100 rounded-xl text-xs font-bold text-slate-500">CANCEL</button>
              <button onClick={() => showToast("Deleted Successfully", "error")} className="flex-1 py-3 bg-rose-500 text-white rounded-xl text-xs font-bold shadow-lg">DELETE</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default OrgTable;