import React, { useState, useEffect, useMemo } from 'react';
import {
  CalendarDays, Plus, Eye, Pencil, Trash2, Users,
  Search, Clock, ArrowLeft, Check, FileText, Briefcase
} from 'lucide-react';
import CommonPageLayout from '../../../components/ui/CommonPageLayout';
import Button from '../../../components/ui/Button';
import Table from '../../../components/ui/Table';
import { useToast } from '../../../components/ui/Toast';
import Modal from '../../../components/ui/Modal';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import { dailyWorkService } from '../../../services/dailyWorkService';
import { memberService } from '../../../services/memberService';
import FilterButton from '../../../components/ui/FilterButton';
import Input from '../../../components/ui/Input';
import DatePicker from '../../../components/ui/DatePicker';
import Pagination from '../../../components/ui/Pagination';
import CustomDropdown from '../../../components/ui/CustomDropdown';
import ActionButtons from '../../../components/ui/ActionButtons';

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Completed'];

const emptyForm = {
  memberId: '',
  memberName: '',
  date: new Date().toLocaleDateString('en-GB'), // DD/MM/YYYY
  project: '',
  hours: '',
  status: 'Pending',
  description: ''
};

export default function DailyWork() {
  const [dailyWork, setDailyWork] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: 'All' });
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const showToast = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [workRes, membersRes] = await Promise.all([
        dailyWorkService.getDailyWorkItems(),
        memberService.getMembers()
      ]);
      setDailyWork(Array.isArray(workRes) ? workRes : []);
      setMembers(Array.isArray(membersRes) ? membersRes : []);
    } catch (error) {
      console.error('Error fetching daily work data:', error);
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredData = useMemo(() => dailyWork.filter(item => {
    const q = search.toLowerCase();
    return (
      (!search || 
        item.memberName?.toLowerCase().includes(q) ||
        item.project?.toLowerCase().includes(q)
      ) && 
      (filters.status === 'All' || item.status === filters.status)
    );
  }), [dailyWork, search, filters]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * recordsPerPage;
    return filteredData.slice(start, start + recordsPerPage);
  }, [filteredData, currentPage, recordsPerPage]);

  const stats = useMemo(() => [
    { title: 'Total Tasks', value: dailyWork.length, icon: Briefcase, color: 'sky' },
    { title: 'Completed', value: dailyWork.filter(m => m.status === 'Completed').length, icon: Check, color: 'emerald' },
    { title: 'Total Hours', value: dailyWork.reduce((acc, curr) => acc + (parseFloat(curr.hours) || 0), 0).toFixed(1), icon: Clock, color: 'amber' },
  ], [dailyWork]);

  const openModal = (mode, item = null) => {
    setModalMode(mode);
    setCurrentItem(item);
    setFormData(item ? { ...emptyForm, ...item } : emptyForm);
    setIsModalOpen(true);
  };

  const set = (key, val) => {
    if (key === 'memberId') {
      const member = members.find(m => m.id === val);
      setFormData(prev => ({ 
        ...prev, 
        memberId: val, 
        memberName: member ? member.name : '' 
      }));
    } else {
      setFormData(prev => ({ ...prev, [key]: val }));
    }
  };

  const handleSave = async () => {
    if (!formData.memberId || !formData.date || !formData.project || !formData.hours || !formData.status) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    try {
      if (modalMode === 'add') {
        await dailyWorkService.createDailyWork(formData);
        showToast('Work record added successfully');
      } else {
        await dailyWorkService.updateDailyWork(currentItem.id, formData);
        showToast('Work record updated successfully');
      }
      fetchData();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving work record:', error);
      showToast('Action failed', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await dailyWorkService.deleteDailyWork(itemToDelete.id);
      showToast('Record deleted successfully', 'delete');
      fetchData();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting daily work:', error);
      showToast('Delete failed', 'error');
    }
  };

  const isView = modalMode === 'view';

  const getStatusBadge = (status) => {
    const colors = {
      'Completed': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'In Progress': 'bg-sky-100 text-sky-700 border-sky-200',
      'Pending': 'bg-amber-100 text-amber-700 border-amber-200'
    };
    
    return (
      <div className="flex justify-center">
        <span className={`w-28 py-1 text-[11px] font-bold rounded-md border text-center inline-block ${colors[status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
          {status}
        </span>
      </div>
    );
  };

  const columns = [
    { key: 'id', label: 'SR. NO', align: 'left', render: (_, __, i) => (currentPage - 1) * recordsPerPage + i + 1 },
    { key: 'memberName', label: 'Member Name', align: 'center', sortable: true, render: v => (
      <span className="font-bold text-teal-600">{v}</span>
    )},
    { key: 'date', label: 'Date', align: 'center', sortable: true, render: v => (
      <span className="text-slate-600 font-medium text-sm">{v}</span>
    )},
    { key: 'project', label: 'Task/Project', align: 'center', sortable: true, render: v => (
        <span className="text-slate-700 font-semibold text-sm">{v}</span>
    )},
    { key: 'description', label: 'Description', align: 'center', render: v => (
        <span className="text-slate-500 text-xs line-clamp-1 max-w-[200px] mx-auto">{v || '-'}</span>
    )},
    { key: 'hours', label: 'Hours', align: 'center', render: v => <span className="text-slate-600 font-bold text-sm">{v || '0'}</span> },
    { key: 'status', label: 'Status', align: 'center', render: v => getStatusBadge(v) },
    { key: 'actions', label: 'Actions', align: 'center', render: (_, r) => (
      <ActionButtons
        onView={row => openModal('view', row)}
        onEdit={row => openModal('edit', row)}
        onDelete={row => { setItemToDelete(row); setIsDeleteModalOpen(true); }}
        row={r}
      />
    )}
  ];

  const modalHeader = (
    <div className="flex items-center gap-3">
      <button 
        onClick={() => setIsModalOpen(false)} 
        className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-slate-100 text-slate-500 transition-all active:scale-95 border border-transparent hover:border-slate-200"
      >
        <ArrowLeft size={18} strokeWidth={2.5} />
      </button>
      <div>
        <h2 className="text-[17px] font-bold text-slate-800 tracking-tight">
          {modalMode === 'add' ? 'Add Daily' : modalMode === 'edit' ? 'Edit' : 'View'} Work
        </h2>
      </div>
    </div>
  );

  const modalFooter = (
    <div className="flex items-center gap-3">
      {!isView ? (
        <>
          <Button
            variant="secondary"
            onClick={() => setIsModalOpen(false)}
            className="w-32 h-10 text-[13px] font-bold rounded-xl border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all shadow-sm"
          >
            Cancel
          </Button>
          <Button
            variant="emerald"
            onClick={handleSave}
            className="w-32 h-10 text-[13px] font-bold shadow-lg shadow-emerald-900/10 rounded-xl"
          >
            {modalMode === "add" ? "Submit" : "Update"}
          </Button>
        </>
      ) : (
        <Button
          variant="secondary"
          onClick={() => setIsModalOpen(false)}
          className="w-32 h-10 text-[13px] font-bold rounded-xl border-slate-200 text-slate-500 shadow-sm"
        >
          Close
        </Button>
      )}
    </div>
  );

  return (
    <CommonPageLayout title="Daily Work Management" stats={stats}>
      <div className="w-full relative bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div className="w-full sm:max-w-sm relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Member or Project..."
              className="w-full h-10 pl-11 pr-4 rounded-lg border border-gray-300 bg-white text-[13px] outline-none focus:ring-2 focus:ring-emerald-50 focus:border-emerald-500 transition-all font-medium text-slate-700 shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <FilterButton
              filters={filters}
              options={[
                {
                  key: "status",
                  placeholder: "Status",
                  items: STATUS_OPTIONS.map(s => ({ label: s, value: s }))
                }
              ]}
              onChange={(k, v) => {
                setFilters((p) => ({ ...p, [k]: v }));
                setCurrentPage(1);
              }}
              onClear={() => {
                setFilters({ status: "All" });
                setCurrentPage(1);
              }}
              dataCount={filteredData.length}
              className="h-10 rounded-lg border-gray-300"
            />
            <Button
              variant="emerald"
              icon={Plus}
              onClick={() => openModal("add")}
              className="h-10 text-[13px] font-bold shadow-lg shadow-emerald-900/10"
            >
              ADD WORK
            </Button>
          </div>
        </div>

        <div className="overflow-hidden border border-gray-300 rounded-lg bg-white mb-4">
          <div className="m-3 mt-3">
            <Table 
              variant="emerald" 
              columns={columns} 
              data={paginatedData} 
              loading={loading} 
              skipCard={true} 
            />
          </div>
        </div>
        
        <Pagination 
          currentPage={currentPage} 
          totalRecords={filteredData.length} 
          recordsPerPage={recordsPerPage} 
          onPageChange={setCurrentPage} 
          onRecordsPerPageChange={v => { setRecordsPerPage(v); setCurrentPage(1); }} 
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="lg"
        title={modalHeader}
        footer={modalFooter}
      >
        <div className="px-1 sm:px-2 py-2 overflow-x-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[13px] font-medium text-slate-600">Member/Employee *</label>
              <CustomDropdown
                value={formData.memberId}
                onChange={v => set('memberId', v)}
                items={members.map(m => ({ label: `${m.name} (${m.id})`, value: m.id }))}
                placeholder="Select Member"
                disabled={isView}
              />
            </div>

            <DatePicker 
              label="Date *" 
              value={formData.date} 
              onChange={e => set('date', e.target.value)} 
              disabled={isView}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-slate-600">Status *</label>
              <CustomDropdown
                value={formData.status}
                onChange={v => set('status', v)}
                items={STATUS_OPTIONS.map(s => ({ label: s, value: s }))}
                placeholder="Select Status"
                disabled={isView}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-slate-600">Task/Project *</label>
              <Input
                value={formData.project}
                onChange={e => set('project', e.target.value)}
                placeholder="Enter Project name"
                disabled={isView}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-slate-600">Hours Spent *</label>
              <Input
                type="number"
                step="0.1"
                value={formData.hours}
                onChange={e => set('hours', e.target.value)}
                placeholder="e.g. 4.5"
                disabled={isView}
              />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[13px] font-medium text-slate-600">Work Description/Summary</label>
              <textarea
                value={formData.description}
                onChange={e => set('description', e.target.value)}
                rows={4}
                className="w-full p-3 rounded-xl border border-slate-200 bg-white text-[13px] outline-none focus:ring-2 focus:ring-emerald-50 focus:border-emerald-500 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                placeholder="Briefly describe the work done..."
                disabled={isView}
              />
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={handleDelete} 
        title="Delete Record" 
        message={`Delete daily work record?`} 
        confirmLabel="Delete" 
        variant="danger" 
      />
    </CommonPageLayout>
  );
}
