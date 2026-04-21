import React, { useState, useEffect, useMemo } from 'react';
import {
  CalendarDays, Plus, Eye, Pencil, Trash2, Users,
  Search, Clock, ArrowLeft, Check, FileText
} from 'lucide-react';
import CommonPageLayout from '../../../components/ui/CommonPageLayout';
import Button from '../../../components/ui/Button';
import Table from '../../../components/ui/Table';
import { useToast } from '../../../components/ui/Toast';
import Modal from '../../../components/ui/Modal';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import { attendanceService } from '../../../services/attendanceService';
import { memberService } from '../../../services/memberService';
import FilterButton from '../../../components/ui/FilterButton';
import Input from '../../../components/ui/Input';
import DatePicker from '../../../components/ui/DatePicker';
import Pagination from '../../../components/ui/Pagination';
import CustomDropdown from '../../../components/ui/CustomDropdown';
import TimePicker from '../../../components/ui/TimePicker';
import ActionButtons from '../../../components/ui/ActionButtons';

const STATUS_OPTIONS = ['Present', 'Absent', 'Leave', 'Late', 'Half-day'];

const emptyForm = {
  memberId: '',
  memberName: '',
  date: new Date().toLocaleDateString('en-GB'), // DD/MM/YYYY
  checkInTime: '09:00',
  checkOutTime: '18:00',
  status: 'Present'
};

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);
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
      const [attendanceRes, membersRes] = await Promise.all([
        attendanceService.getAttendanceItems(),
        memberService.getMembers()
      ]);
      setAttendance(Array.isArray(attendanceRes) ? attendanceRes : []);
      setMembers(Array.isArray(membersRes) ? membersRes : []);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredData = useMemo(() => attendance.filter(item => {
    const q = search.toLowerCase();
    return (
      (!search || 
        item.memberName?.toLowerCase().includes(q)
      ) && 
      (filters.status === 'All' || item.status === filters.status)
    );
  }), [attendance, search, filters]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * recordsPerPage;
    return filteredData.slice(start, start + recordsPerPage);
  }, [filteredData, currentPage, recordsPerPage]);

  const stats = useMemo(() => [
    { title: 'Total Records', value: attendance.length, icon: CalendarDays, color: 'sky' },
    { title: 'Present Today', value: attendance.filter(m => m.status === 'Present' || m.status === 'Late').length, icon: Check, color: 'emerald' },
    { title: 'Absent Today', value: attendance.filter(m => m.status === 'Absent').length, icon: Clock, color: 'rose' },
  ], [attendance]);

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
    if (!formData.memberId || !formData.date || !formData.status) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    try {
      if (modalMode === 'add') {
        await attendanceService.createAttendance(formData);
        showToast('Attendance recorded successfully');
      } else {
        await attendanceService.updateAttendance(currentItem.id, formData);
        showToast('Attendance updated successfully');
      }
      fetchData();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving attendance:', error);
      showToast('Action failed', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await attendanceService.deleteAttendance(itemToDelete.id);
      showToast('Record deleted successfully', 'delete');
      fetchData();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting attendance:', error);
      showToast('Delete failed', 'error');
    }
  };

  const isView = modalMode === 'view';

  const getStatusBadge = (status) => {
    const colors = {
      'Present': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'Absent': 'bg-rose-100 text-rose-700 border-rose-200',
      'Leave': 'bg-amber-100 text-amber-700 border-amber-200',
      'Late': 'bg-sky-100 text-sky-700 border-sky-200',
      'Half-day': 'bg-indigo-100 text-indigo-700 border-indigo-200'
    };
    
    return (
      <div className="flex justify-center">
        <span className={`w-24 py-1 text-[11px] font-bold rounded-md border text-center inline-block ${colors[status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
          {status}
        </span>
      </div>
    );
  };

  const columns = [
    { key: 'id', label: 'Sr. No', align: 'left', render: (_, __, i) => (currentPage - 1) * recordsPerPage + i + 1 },
    { key: 'memberName', label: 'Member Name', align: 'center', sortable: true, render: v => (
      <span className="text-[12.5px] text-[#1A1A1A]">{v}</span>
    )},
    { key: 'date', label: 'Date', align: 'center', sortable: true, render: v => (
      <span className="text-[12.5px] text-[#1A1A1A]">{v}</span>
    )},
    { key: 'checkInTime', label: 'Check-In Time', align: 'center', render: v => <span className="text-[12.5px] text-[#1A1A1A]">{v || '-'}</span> },
    { key: 'checkOutTime', label: 'Check-Out Time', align: 'center', render: v => <span className="text-[12.5px] text-[#1A1A1A]">{v || '-'}</span> },
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
          {modalMode === 'add' ? 'Mark New' : modalMode === 'edit' ? 'Edit' : 'View'} Attendance
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
    <CommonPageLayout title="Attendance Management" stats={stats}>
      <div className="w-full relative bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div className="w-full sm:max-w-sm relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Member Name..."
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
                disabled={isView || modalMode === 'edit'}
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
                items={STATUS_OPTIONS}
                placeholder="Select Status"
                disabled={isView}
              />
            </div>

            <div className="md:col-span-2 bg-slate-50/50 p-5 rounded-2xl border border-slate-100 shadow-sm">
              <h4 className="flex items-center gap-2 text-slate-800 font-bold text-[14px] mb-4">
                <Clock size={16} className="text-teal-600" />
                Timings
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[13px] font-bold text-slate-600 mb-2">Check-In Time</label>
                  <TimePicker 
                    value={formData.checkInTime} 
                    onChange={e => set('checkInTime', e.target.value)} 
                    disabled={isView} 
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-slate-600 mb-2">Check-Out Time</label>
                  <TimePicker 
                    value={formData.checkOutTime} 
                    onChange={e => set('checkOutTime', e.target.value)} 
                    disabled={isView} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={handleDelete} 
        title="Delete Record" 
        message={`Delete attendance record for "${itemToDelete?.memberName}"?`} 
        confirmLabel="Delete" 
        variant="danger" 
      />
    </CommonPageLayout>
  );
}
