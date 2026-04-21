import React, { useState, useEffect, useMemo } from 'react';
import {
  CalendarDays, Plus, Eye, Pencil, Trash2, MapPin, Users,
  Search, Phone, Mail, Clock, Building2, ChevronRight,
  ArrowLeft, X, Check, Link as LinkIcon, Video, AlertCircle, FileText
} from 'lucide-react';
import CommonPageLayout from '../../../components/ui/CommonPageLayout';
import Button from '../../../components/ui/Button';
import Table from '../../../components/ui/Table';
import { useToast } from '../../../components/ui/Toast';
import Modal from '../../../components/ui/Modal';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import { meetingService } from '../../../services/meetingService';
import FilterButton from '../../../components/ui/FilterButton';
import Input from '../../../components/ui/Input';
import Pagination from '../../../components/ui/Pagination';
import CustomDropdown from '../../../components/ui/CustomDropdown';
import TimePicker from '../../../components/ui/TimePicker';
import DatePicker from '../../../components/ui/DatePicker';
import ActionButtons from '../../../components/ui/ActionButtons';

// ── Tab config ──────────────────────────────────────────────────────────────
const TABS = ['Meeting Basic Information', 'Location & Venue Details', 'Additional Information'];

// ── Dropdown Options ────────────────────────────────────────────────────────
const MEETING_TYPES = ['Board', 'General Assembly', 'Committee', 'Executive', 'Coordination', 'Other'];
const STATUS_OPTIONS = ['Scheduled', 'Ongoing', 'Completed', 'Cancelled', 'Rescheduled'];
const PRIORITY_LEVELS = ['Low', 'Medium', 'High', 'Critical'];
const MEETING_MODES = ['In-Person', 'Online', 'Hybrid'];

const GUJARAT_DISTRICTS = [
  'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch', 'Bhavnagar', 
  'Botad', 'Chhota Udepur', 'Dahod', 'Dang', 'Devbhumi Dwarka', 'Gandhinagar', 
  'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kutch', 'Kheda', 'Mahisagar', 'Mehsana', 
  'Morbi', 'Narmada', 'Navsari', 'Panchmahal', 'Patan', 'Porbandar', 'Rajkot', 
  'Sabarkantha', 'Surat', 'Surendranagar', 'Tapi', 'Vadodara', 'Valsad'
];

// ── Empty form ───────────────────────────────────────────────────────────────
const emptyForm = {
  // Tab 1: Basic Information
  title: '',
  code: '',
  meetingType: 'Board',
  agenda: '',
  date: '',
  startTime: '10:00',
  endTime: '11:00',
  duration: '',
  status: 'Scheduled',
  priority: 'Medium',
  
  // Tab 2: Location
  mode: 'In-Person',
  venueName: '',
  address: '',
  city: '',
  district: '',
  pincode: '',
  mapLink: '',
  meetingLink: '',
  expectedAttendees: '',
  venueCapacity: '',

  // Tab 3: Additional
  organizer: '',
  organizerPhone: '',
  organizerEmail: '',
  expectedAttendeeCount: '',
  confirmedAttendeeCount: ''
};

export default function Meetings() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: 'All', type: 'All' });
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const showToast = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [activeTab, setActiveTab] = useState(0);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await meetingService.getMeetings();
      setMeetings(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error fetching meetings:', error);
      showToast('Failed to load meeting data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredData = useMemo(() => meetings.filter(item => {
    const q = search.toLowerCase();
    return (
      (!search || 
        item.title?.toLowerCase().includes(q) || 
        item.code?.toLowerCase().includes(q) || 
        item.venueName?.toLowerCase().includes(q) ||
        item.organizer?.toLowerCase().includes(q)
      ) && 
      (filters.status === 'All' || item.status === filters.status) &&
      (filters.type === 'All' || item.meetingType === filters.type)
    );
  }), [meetings, search, filters]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * recordsPerPage;
    return filteredData.slice(start, start + recordsPerPage);
  }, [filteredData, currentPage, recordsPerPage]);

  const stats = useMemo(() => [
    { title: 'Total Meetings', value: meetings.length, icon: CalendarDays, color: 'sky' },
    { title: 'Upcoming', value: meetings.filter(m => m.status === 'Scheduled').length, icon: Clock, color: 'teal' },
    { title: 'Completed', value: meetings.filter(m => m.status === 'Completed').length, icon: Check, color: 'emerald' },
  ], [meetings]);

  const openModal = (mode, item = null) => {
    setModalMode(mode);
    setCurrentItem(item);
    setFormData(item ? { ...emptyForm, ...item } : emptyForm);
    setActiveTab(0);
    setIsModalOpen(true);
  };

  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    try {
      if (modalMode === 'add') {
        await meetingService.createMeeting(formData);
        showToast('Meeting added successfully');
      } else {
        await meetingService.updateMeeting(currentItem.id, formData);
        showToast('Meeting updated successfully');
      }
      fetchData();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving meeting:', error);
      showToast('Action failed', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await meetingService.deleteMeeting(itemToDelete.id);
      showToast('Meeting deleted successfully', 'delete');
      fetchData();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting meeting:', error);
      showToast('Delete failed', 'error');
    }
  };

  const isView = modalMode === 'view';

  const getStatusBadge = (status) => {
    const colors = {
      'Scheduled': 'bg-sky-100 text-sky-700 border-sky-200',
      'Ongoing': 'bg-amber-100 text-amber-700 border-amber-200',
      'Completed': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'Cancelled': 'bg-rose-100 text-rose-700 border-rose-200',
      'Rescheduled': 'bg-indigo-100 text-indigo-700 border-indigo-200'
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
    { key: 'id', label: 'Sr. No.', align: 'left', render: (_, __, i) => i + 1 },
    { key: 'title', label: 'Meeting Title', align: 'center', sortable: true, render: v => (
      <span className="text-[12.5px] text-[#1A1A1A]">{v}</span>
    )},
    { key: 'meetingType', label: 'Meeting Type', align: 'center', render: v => <span className="text-[12.5px] text-[#1A1A1A]">{v}</span> },
    { key: 'date', label: 'Date', align: 'center', sortable: true, render: v => (
      <span className="text-[12.5px] text-[#1A1A1A]">{v}</span>
    )},
    { key: 'mode', label: 'Mode', align: 'center', render: v => <span className="text-[12.5px] text-[#1A1A1A]">{v}</span> },
    { key: 'status', label: 'Status', align: 'center', render: v => getStatusBadge(v) },
    { key: 'actions', label: 'Action', align: 'center', render: (_, r) => (
      <ActionButtons
        onView={row => openModal('view', row)}
        onEdit={row => openModal('edit', row)}
        onDelete={row => { setItemToDelete(row); setIsDeleteModalOpen(true); }}
        row={r}
      />
    )}
  ];

  const modalHeader = (
    <div className="flex flex-col gap-5 -mb-2">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setIsModalOpen(false)} 
          className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-slate-100 text-slate-500 transition-all active:scale-95 border border-transparent hover:border-slate-200"
        >
          <ArrowLeft size={18} strokeWidth={2.5} />
        </button>
        <div>
          <h2 className="text-[17px] font-bold text-slate-800 tracking-tight">
            {modalMode === 'add' ? 'Schedule New' : modalMode === 'edit' ? 'Edit' : 'View'} Meeting
          </h2>
        </div>
      </div>

      <div className="flex gap-1.5 p-1 bg-slate-50/80 rounded-2xl border border-slate-100 w-fit">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(i)}
            className={`px-5 py-2 text-[12px] font-bold rounded-xl transition-all duration-300 ${
              activeTab === i
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-100 ring-1 ring-emerald-500/20"
                : "text-slate-400 hover:text-slate-600 hover:bg-white"
            }`}
          >
            {tab}
          </button>
        ))}
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
          {activeTab < TABS.length - 1 ? (
            <Button
              variant="emerald"
              onClick={() => setActiveTab((t) => t + 1)}
              className="w-32 h-10 text-[13px] font-bold shadow-lg shadow-emerald-900/10 rounded-xl"
            >
              Next
            </Button>
          ) : (
            <Button
              variant="emerald"
              onClick={handleSave}
              className="w-32 h-10 text-[13px] font-bold shadow-lg shadow-emerald-900/10 rounded-xl"
            >
              {modalMode === "add" ? "Submit" : "Update"}
            </Button>
          )}
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
    <CommonPageLayout title="Meeting Management" stats={stats}>
      <div className="w-full relative bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div className="w-full sm:max-w-sm relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Title, Code, Organizer..."
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
                },
                {
                  key: "type",
                  placeholder: "Meeting Type",
                  items: MEETING_TYPES.map(t => ({ label: t, value: t }))
                }
              ]}
              onChange={(k, v) => {
                setFilters((p) => ({ ...p, [k]: v }));
                setCurrentPage(1);
              }}
              onClear={() => {
                setFilters({ status: "All", type: "All" });
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
              SCHEDULE MEETING
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
        size="xxl"
        title={modalHeader}
        footer={modalFooter}
      >
        <div className="px-1 sm:px-2 py-2 overflow-x-hidden">
          {activeTab === 0 && (
            <div className="animate-in fade-in duration-300">
              <Tab1 formData={formData} set={set} isView={isView} />
            </div>
          )}
          {activeTab === 1 && (
            <div className="animate-in fade-in duration-300">
              <Tab2 formData={formData} set={set} isView={isView} />
            </div>
          )}
          {activeTab === 2 && (
            <div className="animate-in fade-in duration-300">
              <Tab3 formData={formData} set={set} isView={isView} />
            </div>
          )}
        </div>
      </Modal>

      <ConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDelete} title="Delete Meeting" message={`Delete "${itemToDelete?.title}"?`} confirmLabel="Delete" variant="danger" />
    </CommonPageLayout>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Components for Tabs
// ─────────────────────────────────────────────────────────────────────────────

function Tab1({ formData, set, isView }) {
  return (
    <div className="flex flex-col lg:flex-row gap-10">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <Input label="Meeting Title" placeholder="Enter Title" value={formData.title} onChange={e => set('title', e.target.value)} required disabled={isView} icon={FileText} />
        <Input label="Meeting Code" placeholder="e.g. MTG-001" value={formData.code} onChange={e => set('code', e.target.value)} required disabled={isView} />
        
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-slate-600">Meeting Type *</label>
          <CustomDropdown
            value={formData.meetingType}
            onChange={v => set('meetingType', v)}
            items={MEETING_TYPES}
            placeholder="Select Type"
            disabled={isView}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-slate-600">Priority Level *</label>
          <CustomDropdown
            value={formData.priority}
            onChange={v => set('priority', v)}
            items={PRIORITY_LEVELS}
            placeholder="Select Priority"
            disabled={isView}
          />
        </div>

        <div className="md:col-span-2">
          <Input 
            label="Purpose/Agenda" 
            placeholder="Briefly describe the meeting agenda..." 
            value={formData.agenda} 
            onChange={e => set('agenda', e.target.value)} 
            disabled={isView} 
            multiline 
            rows={3} 
          />
        </div>

        <DatePicker label="Date" value={formData.date} onChange={e => set('date', e.target.value)} required disabled={isView} />
        <Input label="Duration" placeholder="e.g. 2 Hours" value={formData.duration} onChange={e => set('duration', e.target.value)} disabled={isView} />

        <div className="md:col-span-2 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-sm mt-2">
          <h4 className="flex items-center gap-2 text-slate-800 font-bold text-[14px] mb-6">
            <Clock size={16} className="text-teal-600" />
            Meeting Timings
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-1 gap-10">
            <div>
              <label className="block text-[13px] font-bold text-slate-600 mb-3">Time Range</label>
              <div className="flex items-center gap-3 max-w-[400px]">
                <TimePicker value={formData.startTime} onChange={e => set('startTime', e.target.value)} disabled={isView} className="flex-1" />
                <span className="text-slate-400 text-[11px] font-black uppercase tracking-widest px-1">to</span>
                <TimePicker value={formData.endTime} onChange={e => set('endTime', e.target.value)} disabled={isView} className="flex-1" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2 md:w-1/2 md:pr-4">
          <label className="text-[13px] font-medium text-slate-600">Meeting Status *</label>
          <CustomDropdown
            value={formData.status}
            onChange={v => set('status', v)}
            items={STATUS_OPTIONS}
            placeholder="Select Status"
            disabled={isView}
          />
        </div>
      </div>
    </div>
  );
}

function Tab2({ formData, set, isView }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-slate-600">Meeting Mode *</label>
        <CustomDropdown
          value={formData.mode}
          onChange={v => set('mode', v)}
          items={MEETING_MODES}
          placeholder="Select Mode"
          disabled={isView}
        />
      </div>

      <Input label="Meeting Link" placeholder="e.g. Zoom/Google Meet Link" value={formData.meetingLink} onChange={e => set('meetingLink', e.target.value)} disabled={isView} icon={Video} />

      {(formData.mode === 'In-Person' || formData.mode === 'Hybrid') && (
        <>
          <div className="md:col-span-2 mt-4 pt-4 border-t border-slate-100">
            <h4 className="flex items-center gap-2 text-slate-800 font-bold text-[14px] mb-4">
              <Building2 size={16} className="text-teal-600" />
              Venue Information
            </h4>
          </div>
          
          <Input label="Venue/Location Name" placeholder="Venue Name" value={formData.venueName} onChange={e => set('venueName', e.target.value)} disabled={isView} />
          <Input label="Venue Capacity" type="number" placeholder="Count" value={formData.venueCapacity} onChange={e => set('venueCapacity', e.target.value)} disabled={isView} />

          <div className="md:col-span-2">
            <Input label="Venue Address" placeholder="Detailed Address" value={formData.address} onChange={e => set('address', e.target.value)} disabled={isView} />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-slate-600">City *</label>
            <CustomDropdown
              value={formData.district}
              onChange={v => set('district', v)}
              items={GUJARAT_DISTRICTS}
              placeholder="Select City"
              disabled={isView}
            />
          </div>
          
          <Input label="Village/Area" placeholder="Area" value={formData.city} onChange={e => set('city', e.target.value)} disabled={isView} />
          <Input label="Pincode" placeholder="6 Digits" value={formData.pincode} onChange={e => set('pincode', e.target.value)} disabled={isView} maxLength={6} />
          <Input label="Google Maps Link" placeholder="Map Link" value={formData.mapLink} onChange={e => set('mapLink', e.target.value)} disabled={isView} icon={MapPin} />
        </>
      )}

      <div className="md:col-span-2">
         <Input label="Expected Attendees" type="number" placeholder="Count" value={formData.expectedAttendees} onChange={e => set('expectedAttendees', e.target.value)} disabled={isView} />
      </div>
    </div>
  );
}

function Tab3({ formData, set, isView }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      <Input label="Organizer Name" placeholder="Name" value={formData.organizer} onChange={e => set('organizer', e.target.value)} required disabled={isView} icon={Users} />
      <Input label="Organizer Phone" placeholder="Phone" type="tel" value={formData.organizerPhone} onChange={e => set('organizerPhone', e.target.value)} required disabled={isView} icon={Phone} />
      <Input label="Organizer Email" placeholder="Email" type="email" value={formData.organizerEmail} onChange={e => set('organizerEmail', e.target.value)} disabled={isView} icon={Mail} />
      
      <div className="md:col-span-2 mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <Input label="Expected Attendee Count" type="number" placeholder="Count" value={formData.expectedAttendeeCount} onChange={e => set('expectedAttendeeCount', e.target.value)} disabled={isView} icon={Users} />
        <Input label="Confirmed Attendee Count" type="number" placeholder="Count" value={formData.confirmedAttendeeCount} onChange={e => set('confirmedAttendeeCount', e.target.value)} disabled={isView} icon={Check} />
      </div>
    </div>
  );
}
