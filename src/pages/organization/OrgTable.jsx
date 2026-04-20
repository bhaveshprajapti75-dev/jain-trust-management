import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Edit2, Trash2, Eye, Check, AlertTriangle } from 'lucide-react';
import StatusToggle from '../../components/common/StatusToggle';
import Table from '../../components/common/Table';
import TrustFormModal from './forms/TrustFormModal';
import SanghFormModal from './forms/SanghFormModal';
import SanghDetailsModal from './details/SanghDetailsModal';
import TrustDetailsPage from './details/TrustDetailsPage';
import { getOrgData, saveOrgData } from './orgData';

const OrgTable = forwardRef(({ activeTab, searchTerm, filterValues, itemsPerPage, currentPage, setCurrentPage, setTotalEntries, onDataChange, onTrustViewChange }, ref) => {
  const [data, setData] = useState(() => getOrgData());
  const [trustModal, setTrustModal] = useState({ isOpen: false, type: 'add', data: null });
  const [sanghModal, setSanghModal] = useState({ isOpen: false, type: 'add', data: null });
  const [detailsModal, setDetailsModal] = useState({ isOpen: false, type: '', data: null });
  const [trustView, setTrustView] = useState({ isOpen: false, trustId: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, type: '' });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useImperativeHandle(ref, () => ({
    openTrustModal: () => setTrustModal({ isOpen: true, type: 'add', data: null }),
    openSanghModal: () => setSanghModal({ isOpen: true, type: 'add', data: null })
  }));

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const syncLinksWithEntities = (nextLinks, nextTrusts, nextSanghs) => {
    const syncedTrusts = nextTrusts.map((trust) => ({
      ...trust,
      linkedSanghs: nextLinks
        .filter((link) => link.trustId === trust.id && link.status)
        .map((link) => link.sanghId),
    }));

    const syncedSanghs = nextSanghs.map((sangh) => {
      const activeLink = nextLinks.find((link) => link.sanghId === sangh.id && link.status);
      return {
        ...sangh,
        linkedTrustId: activeLink ? activeLink.trustId : null,
      };
    });

    return { syncedTrusts, syncedSanghs };
  };

  const closeTrustView = () => {
    setTrustView({ isOpen: false, trustId: null });
  };

  useEffect(() => {
    closeTrustView();
  }, [activeTab]);

  useEffect(() => {
    if (onTrustViewChange) {
      onTrustViewChange(trustView.isOpen);
    }
  }, [trustView.isOpen, onTrustViewChange]);

  const handleSaveTrust = (formData) => {
    let newTrusts = [...data.trusts];
    if (trustModal.type === 'add') {
      if (newTrusts.some(t => t.name.toLowerCase() === formData.name.toLowerCase())) {
        showToast('Trust Name Already Exists', 'error');
        return;
      }
      newTrusts.push({ ...formData, id: Date.now(), status: true });
      showToast('Trust Added Successfully');
    } else {
      const idx = newTrusts.findIndex(t => t.id === trustModal.data.id);
      if (idx > -1) newTrusts[idx] = { ...newTrusts[idx], ...formData };
      showToast('Trust Updated Successfully');
    }

    const { syncedTrusts, syncedSanghs } = syncLinksWithEntities(data.links, newTrusts, data.sanghs);
    const newData = { ...data, trusts: syncedTrusts, sanghs: syncedSanghs };
    setData(newData);
    saveOrgData(newData);
    setTrustModal({ isOpen: false, type: 'add', data: null });
    if (onDataChange) onDataChange();
  };

  const handleSaveSangh = (formData) => {
    let newSanghs = [...data.sanghs];
    if (sanghModal.type === 'add') {
      if (newSanghs.some(s => s.name.toLowerCase() === formData.name.toLowerCase())) {
        showToast('Sangh Name Already Exists', 'error');
        return;
      }
      newSanghs.push({ ...formData, id: Date.now(), status: true });
      showToast('Sangh Added Successfully');
    } else {
      const idx = newSanghs.findIndex(s => s.id === sanghModal.data.id);
      if (idx > -1) newSanghs[idx] = { ...newSanghs[idx], ...formData };
      showToast('Sangh Updated Successfully');
    }

    const { syncedTrusts, syncedSanghs } = syncLinksWithEntities(data.links, data.trusts, newSanghs);
    const newData = { ...data, trusts: syncedTrusts, sanghs: syncedSanghs };
    setData(newData);
    saveOrgData(newData);
    setSanghModal({ isOpen: false, type: 'add', data: null });
    if (onDataChange) onDataChange();
  };

  const handleDelete = () => {
    let newData = { ...data };
    if (deleteConfirm.type === 'trust') {
      newData.trusts = newData.trusts.filter(t => t.id !== deleteConfirm.id);
      newData.links = newData.links.filter(l => l.trustId !== deleteConfirm.id);
    } else {
      newData.sanghs = newData.sanghs.filter(s => s.id !== deleteConfirm.id);
      newData.links = newData.links.filter(l => l.sanghId !== deleteConfirm.id);
    }

    const { syncedTrusts, syncedSanghs } = syncLinksWithEntities(newData.links, newData.trusts, newData.sanghs);
    newData = { ...newData, trusts: syncedTrusts, sanghs: syncedSanghs };

    setData(newData);
    saveOrgData(newData);
    setDeleteConfirm({ show: false, id: null, type: '' });
    showToast('Deleted Successfully', 'error');
    if (onDataChange) onDataChange();
  };

  const toggleStatus = (id, type, currentStatus) => {
    const key = type === 'trust' ? 'trusts' : 'sanghs';
    const list = [...data[key]];
    const idx = list.findIndex(i => i.id === id);
    if (idx > -1) {
      list[idx].status = !currentStatus;
      const newData = { ...data, [key]: list };
      setData(newData);
      saveOrgData(newData);
      showToast('Status Changed Successfully');
      if (onDataChange) onDataChange();
    }
  };

  const trustHasLinkedSangh = (trustId, sanghId) => {
    return data.links.some(l => l.trustId === trustId && l.sanghId === sanghId && l.status);
  };

  const sanghHasLinkedTrust = (sanghId, trustId) => {
    return data.links.some(l => l.sanghId === sanghId && l.trustId === trustId && l.status);
  };

  const handleLinkSanghToTrust = (trustId, sanghId) => {
    const exists = data.links.some((link) => link.trustId === trustId && link.sanghId === sanghId && link.status);
    if (exists) {
      showToast('This sangh is already linked to selected trust', 'error');
      return;
    }

    const nextLinks = [
      ...data.links,
      {
        id: Date.now(),
        trustId,
        sanghId,
        linkedAt: new Date().toISOString().split('T')[0],
        status: true,
      },
    ];

    const { syncedTrusts, syncedSanghs } = syncLinksWithEntities(nextLinks, data.trusts, data.sanghs);
    const newData = { ...data, links: nextLinks, trusts: syncedTrusts, sanghs: syncedSanghs };

    setData(newData);
    saveOrgData(newData);
    showToast('Sangh linked successfully');
    if (onDataChange) onDataChange();
  };

  const handleUnlinkSanghFromTrust = (linkId) => {
    const nextLinks = data.links.filter((link) => link.id !== linkId);
    const { syncedTrusts, syncedSanghs } = syncLinksWithEntities(nextLinks, data.trusts, data.sanghs);
    const newData = { ...data, links: nextLinks, trusts: syncedTrusts, sanghs: syncedSanghs };

    setData(newData);
    saveOrgData(newData);
    showToast('Sangh unlinked successfully');
    if (onDataChange) onDataChange();
  };

  // Filter data
  let filteredData = [];
  if (activeTab === 'all') {
    const allItems = [
      ...data.trusts.map(t => ({ ...t, orgType: 'Trust' })),
      ...data.sanghs.map(s => ({ ...s, orgType: 'Sangh' }))
    ];
    filteredData = allItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterValues.status === 'all' ? true : filterValues.status === 'active' ? item.status === true : item.status === false;
      return matchesSearch && matchesStatus;
    });
  } else if (activeTab === 'trusts') {
    filteredData = data.trusts.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || (item.city && item.city.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = filterValues.status === 'all' ? true : filterValues.status === 'active' ? item.status === true : item.status === false;
      const matchesLinked = filterValues.linkedId === 'all' ? true : trustHasLinkedSangh(item.id, Number(filterValues.linkedId));
      return matchesSearch && matchesStatus && matchesLinked;
    });
  } else {
    filteredData = data.sanghs.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || (item.city && item.city.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = filterValues.status === 'all' ? true : filterValues.status === 'active' ? item.status === true : item.status === false;
      const matchesLinked = filterValues.linkedId === 'all' ? true : sanghHasLinkedTrust(item.id, Number(filterValues.linkedId));
      return matchesSearch && matchesStatus && matchesLinked;
    });
  }

  useEffect(() => { setTotalEntries(filteredData.length); }, [filteredData.length]);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getColumns = () => {
    if (activeTab === 'all') {
      return [
        { key: 'srNo', label: 'Sr. No.', align: 'center', render: (_, __, i) => (currentPage - 1) * itemsPerPage + i + 1 },
        { key: 'name', label: 'Organization Name', align: 'center' },
        { key: 'orgType', label: 'Type', align: 'center' },
        { key: 'actions', label: 'Actions', align: 'center', render: (_, item) => (
          <div className="flex items-center justify-center gap-3">
            <button onClick={(e) => {
              e.stopPropagation();
              if (item.orgType === 'Trust') {
                setTrustView({ isOpen: true, trustId: item.id });
                return;
              }
              setDetailsModal({ isOpen: true, type: 'sangh', data: item });
            }} className="text-slate-400 hover:text-emerald-600 transition-all p-1.5 hover:bg-emerald-50 rounded-lg">
              <Eye size={15} />
            </button>
          </div>
        )},
      ];
    } else if (activeTab === 'trusts') {
      return [
        { key: 'srNo', label: 'Sr. No.', align: 'center', render: (_, __, i) => (currentPage - 1) * itemsPerPage + i + 1 },
        { key: 'name', label: 'Trust Name', align: 'left' },
        { key: 'city', label: 'City', align: 'left' },
        { key: 'admin', label: 'Admin Name', align: 'left' },
        { key: 'status', label: 'Status', align: 'center', render: (status, item) => (
          <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
            <StatusToggle status={status} onToggle={() => toggleStatus(item.id, 'trust', status)} />
          </div>
        )},
        { key: 'actions', label: 'Actions', align: 'center', render: (_, item) => (
          <div className="flex items-center justify-center gap-3">
            <button onClick={(e) => { e.stopPropagation(); setTrustView({ isOpen: true, trustId: item.id }); }} className="text-slate-400 hover:text-emerald-600 transition-all p-1.5 hover:bg-emerald-50 rounded-lg">
              <Eye size={15} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); setTrustModal({ isOpen: true, type: 'edit', data: item }); }} className="text-slate-400 hover:text-emerald-600 transition-all p-1.5 hover:bg-emerald-50 rounded-lg">
              <Edit2 size={15} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm({ show: true, id: item.id, type: 'trust' }); }} className="text-slate-400 hover:text-rose-500 transition-all p-1.5 hover:bg-rose-50 rounded-lg">
              <Trash2 size={15} />
            </button>
          </div>
        )},
      ];
    } else {
      return [
        { key: 'srNo', label: 'Sr. No.', align: 'center', render: (_, __, i) => (currentPage - 1) * itemsPerPage + i + 1 },
        { key: 'name', label: 'Sangh Name', align: 'left' },
        { key: 'city', label: 'City', align: 'left' },
        { key: 'members', label: 'Members', align: 'center', render: (val) => val?.toLocaleString() || 0 },
        { key: 'status', label: 'Status', align: 'center', render: (status, item) => (
          <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
            <StatusToggle status={status} onToggle={() => toggleStatus(item.id, 'sangh', status)} />
          </div>
        )},
        { key: 'actions', label: 'Actions', align: 'center', render: (_, item) => (
          <div className="flex items-center justify-center gap-3">
            <button onClick={(e) => { e.stopPropagation(); setDetailsModal({ isOpen: true, type: 'sangh', data: item }); }} className="text-slate-400 hover:text-emerald-600 transition-all p-1.5 hover:bg-emerald-50 rounded-lg">
              <Eye size={15} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); setSanghModal({ isOpen: true, type: 'edit', data: item }); }} className="text-slate-400 hover:text-emerald-600 transition-all p-1.5 hover:bg-emerald-50 rounded-lg">
              <Edit2 size={15} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm({ show: true, id: item.id, type: 'sangh' }); }} className="text-slate-400 hover:text-rose-500 transition-all p-1.5 hover:bg-rose-50 rounded-lg">
              <Trash2 size={15} />
            </button>
          </div>
        )},
      ];
    }
  };

  const columns = getColumns();
  const selectedTrust = trustView.isOpen ? data.trusts.find((trust) => trust.id === trustView.trustId) : null;

  return (
    <div className="w-full font-sans antialiased text-slate-600">
      <style>{`
        @keyframes toast-in-out {
          0% { transform: translateX(120%); opacity: 0; }
          10% { transform: translateX(0); opacity: 1; }
          90% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(-150%); opacity: 0; }
        }
        .animate-toast-custom { animation: toast-in-out 3s ease-in-out forwards; }
      `}</style>

      {/* Toast */}
      {toast.show && (
        <div className="fixed top-8 right-8 z-[999] animate-toast-custom">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border backdrop-blur-md ${toast.type === 'error' ? 'bg-rose-500 border-rose-400' : 'bg-emerald-500 border-emerald-400'} text-white`}>
            <div className="p-1.5 rounded-lg bg-white/20">
              {toast.type === 'error' ? <AlertTriangle size={18} className="text-white" /> : <Check size={18} strokeWidth={3} className="text-white" />}
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[13px] font-medium uppercase tracking-wide leading-none">{toast.message}</span>
              <span className="text-[9px] font-normal opacity-80 uppercase mt-1 tracking-widest">System Notification</span>
            </div>
          </div>
        </div>
      )}

      {selectedTrust ? (
        <TrustDetailsPage
          trust={selectedTrust}
          allData={data}
          onBack={closeTrustView}
          onStatusToggle={toggleStatus}
          onLinkSangh={handleLinkSanghToTrust}
          onUnlinkSangh={handleUnlinkSanghFromTrust}
        />
      ) : (
        <Table 
          columns={columns} 
          data={paginatedData} 
          rowKey="id"
          emptyMessage="No matching records found"
        />
      )}

      {/* Modals */}
      {trustModal.isOpen && (
        <TrustFormModal 
          isOpen={trustModal.isOpen} 
          onClose={() => setTrustModal({ isOpen: false, type: 'add', data: null })} 
          initialData={trustModal.data} 
          onSave={handleSaveTrust} 
        />
      )}

      {sanghModal.isOpen && (
        <SanghFormModal 
          isOpen={sanghModal.isOpen} 
          onClose={() => setSanghModal({ isOpen: false, type: 'add', data: null })} 
          initialData={sanghModal.data} 
          onSave={handleSaveSangh} 
        />
      )}

      {detailsModal.isOpen && detailsModal.type === 'sangh' && (
        <SanghDetailsModal 
          isOpen={detailsModal.isOpen} 
          onClose={() => setDetailsModal({ isOpen: false, type: '', data: null })} 
          sangh={detailsModal.data} 
          allData={data} 
          onStatusToggle={toggleStatus}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-900/30 backdrop-blur-sm">
          <div className="bg-white w-full max-w-[280px] rounded-2xl p-5 text-center shadow-2xl animate-in zoom-in duration-200">
            <div className="w-11 h-11 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertTriangle size={22} />
            </div>
            <h3 className="font-semibold text-slate-800 text-sm">Confirm Delete?</h3>
            <p className="text-[11px] text-slate-400 mt-1">This action cannot be undone</p>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setDeleteConfirm({ show: false, id: null, type: '' })} className="flex-1 py-2 text-xs font-medium text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2 text-xs font-medium text-white bg-rose-500 rounded-xl shadow-md hover:bg-rose-600 transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default OrgTable;