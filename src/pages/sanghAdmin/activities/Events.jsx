import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  CalendarDays, Plus, Eye, Pencil, Trash2, MapPin, Users,
  Search, Phone, Mail, Clock, Building2, ChevronRight, Image as ImageIcon,
  ArrowLeft, X, Check, Camera, ExternalLink, Ticket, Info, Globe, Shield, Truck, 
  Stethoscope, Briefcase
} from 'lucide-react';
import CommonPageLayout from '../../../components/ui/CommonPageLayout';
import Button from '../../../components/ui/Button';
import Table from '../../../components/ui/Table';
import StatusToggle from '../../../components/ui/StatusToggle';
import { useToast } from '../../../components/ui/Toast';
import Modal from '../../../components/ui/Modal';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import { eventService } from '../../../services/eventService';
import FilterButton from '../../../components/ui/FilterButton';
import Input from '../../../components/ui/Input';
import Pagination from '../../../components/ui/Pagination';
import CustomDropdown from '../../../components/ui/CustomDropdown';
import TimePicker from '../../../components/ui/TimePicker';
import ActionButtons from '../../../components/ui/ActionButtons';

// ── Tab config ──────────────────────────────────────────────────────────────
const TABS = ['Event Details', 'Location & Venue', 'Organizer & Contact', 'Additional Info & Media'];

// ── Constants & Dropdown Options ───────────────────────────────────────────
const EVENT_STATUSES = [
  { label: 'Upcoming', value: 'Upcoming', color: 'sky' },
  { label: 'Ongoing', value: 'Ongoing', color: 'teal' },
  { label: 'Completed', value: 'Completed', color: 'slate' },
  { label: 'Cancelled', value: 'Cancelled', color: 'rose' }
];
const SANGHS = [
  { label: 'Paldi Jain Sangh', value: 1 },
  { label: 'Navrangpura Jain Sangh', value: 2 },
  { label: 'Surat City Sangh', value: 3 }
];
const DERASARS = [
  { label: 'None', value: null },
  { label: 'Shree Chandraprabhu Derasar', value: 1 },
  { label: 'Shree Mahaveer Derasar', value: 2 }
];
const GUJARAT_DISTRICTS = ['Ahmedabad','Surat','Vadodara','Rajkot','Bhavnagar','Junagadh','Patan','Mehsana','Gandhinagar','Anand','Kheda','Nadiad','Surendranagar','Amreli','Porbandar','Jamnagar','Kutch','Banaskantha','Sabarkantha','Other'];

// ── Empty forms ─────────────────────────────────────────────────────────────
const emptyCategoryForm = {
  categoryName: '',
  description: '',
  isPublished: true
};

// ── Empty form ───────────────────────────────────────────────────────────────
const emptyForm = {
  // Tab 1
  eventName: '',
  eventCode: '', // Auto-generated in service
  eventType: '',
  description: '',
  startDate: '',
  endDate: '',
  startTime: '09:00',
  endTime: '18:00',
  expectedAttendees: '',
  confirmedAttendees: '',
  isFree: true,
  ticketPrice: '',
  maxParticipants: '',
  eventStatus: 'Upcoming',
  eventImage: null,
  createdBy: 'Sangh Admin',
  isPublished: false,
  
  // Tab 2
  venueAddress: '',
  landmark: '',
  city: '',
  district: '',
  pincode: '',
  googleMapsLink: '',
  latitude: '',
  longitude: '',
  venueName: '',
  venueCapacity: '',
  parkingAvailable: false,
  disabledAccessAvailable: false,

  // Tab 3
  sanghId: '',
  derasarId: null,
  organizerName: '',
  organizerPhone: '',
  organizerEmail: '',
  registrationPhone: '',
  secondaryContactName: '',
  secondaryContactPhone: '',
  speakerName: '',
  speakerContact: '',
  websiteLink: '',

  // Tab 4
  parkingArrangement: '',
  foodPrasad: '',
  accommodation: '',
  transportation: '',
  medicalFacilities: '',
  security: '',
  eventBrochure: null,
  galleryPhotos: [],
  announcements: '',
};

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ eventType: 'All', eventStatus: 'All' });
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [previewImage, setPreviewImage] = useState(null);
  const showToast = useToast();

  const [activeSubmodule, setActiveSubmodule] = useState('category'); // 'event' or 'category'
  const [categories, setCategories] = useState([]);
  const [categorySearch, setCategorySearch] = useState('');
  const [categoryFilters, setCategoryFilters] = useState({ isPublished: 'All' });
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState(emptyCategoryForm);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [activeTab, setActiveTab] = useState(0);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await eventService.getEvents();
      setEvents(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await eventService.getCategories();
      setCategories(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      showToast('Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchData();
    fetchCategories();
  }, []);

  const filteredData = useMemo(() => {
    return events.filter(item => {
      const q = search.toLowerCase();
      return (!search || item.eventName?.toLowerCase().includes(q) || item.city?.toLowerCase().includes(q) || item.eventCode?.toLowerCase().includes(q)) && 
             (filters.eventType === 'All' || item.eventType === filters.eventType) &&
             (filters.eventStatus === 'All' || item.eventStatus === filters.eventStatus);
    });
  }, [events, search, filters]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * recordsPerPage;
    return filteredData.slice(start, start + recordsPerPage);
  }, [filteredData, currentPage, recordsPerPage]);

  const filteredCategories = useMemo(() => {
    return categories.filter(item => {
      const q = categorySearch.toLowerCase();
      const matchesSearch = !categorySearch || 
                           item.categoryName?.toLowerCase().includes(q) || 
                           item.description?.toLowerCase().includes(q);
      const matchesStatus = categoryFilters.isPublished === 'All' || 
                           (categoryFilters.isPublished === 'Active' ? item.isPublished : !item.isPublished);
      return matchesSearch && matchesStatus;
    });
  }, [categories, categorySearch, categoryFilters]);

  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * recordsPerPage;
    return filteredCategories.slice(start, start + recordsPerPage);
  }, [filteredCategories, currentPage, recordsPerPage]);

  const stats = useMemo(() => [
    { title: 'Total Events', value: events.length, icon: CalendarDays, color: 'sky' },
    { title: 'Upcoming Events', value: events.filter(e => e.eventStatus === 'Upcoming').length, icon: Clock, color: 'teal' },
    { title: 'Total Attendance', value: events.reduce((acc, e) => acc + (parseInt(e.confirmedAttendees) || 0), 0), icon: Users, color: 'amber' },
    { title: 'Completed Events', value: events.filter(e => e.eventStatus === 'Completed').length, icon: Check, color: 'emerald' },
  ], [events]);

  const openModal = (mode, item = null) => {
    setModalMode(mode);
    setCurrentItem(item);
    setFormData(item ? { ...emptyForm, ...item } : { ...emptyForm });
    setActiveTab(0);
    setIsModalOpen(true);
  };

  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

  const togglePublished = async (item) => {
    try {
      const newPublished = !item.isPublished;
      await eventService.updateEvent(item.id, { ...item, isPublished: newPublished });
      fetchData();
      showToast(`Event ${newPublished ? 'Published' : 'Unpublished'}`);
    } catch (error) {
      console.error('Error updating published status:', error);
      showToast('Failed to update status', 'error');
    }
  };

  const handleSave = async () => {
    try {
      if (modalMode === 'add') {
        await eventService.createEvent(formData);
        showToast('Event created successfully');
      } else {
        await eventService.updateEvent(currentItem.id, formData);
        showToast('Event updated successfully');
      }
      fetchData();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving event:', error);
      showToast('Action failed', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      if (activeSubmodule === 'event') {
        await eventService.deleteEvent(itemToDelete.id);
        showToast('Event deleted', 'delete');
        fetchData();
      } else {
        await eventService.deleteCategory(itemToDelete.id);
        showToast('Category deleted', 'delete');
        fetchCategories();
      }
      setIsDeleteModalOpen(false);
    } catch (error) {
      showToast('Delete failed', 'error');
    }
  };

  const toggleCategoryPublished = async (item) => {
    try {
      const newStatus = !item.isPublished;
      await eventService.updateCategory(item.id, { ...item, isPublished: newStatus });
      fetchCategories();
      showToast(`Category ${newStatus ? 'Activated' : 'Deactivated'}`);
    } catch (error) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleCategorySave = async () => {
    try {
      if (modalMode === 'add') {
        await eventService.createCategory(categoryFormData);
        showToast('Category created successfully');
      } else {
        await eventService.updateCategory(currentItem.id, categoryFormData);
        showToast('Category updated successfully');
      }
      fetchCategories();
      setIsCategoryModalOpen(false);
    } catch (error) {
      showToast('Save failed', 'error');
    }
  };

  const openCategoryModal = (mode, item = null) => {
    setModalMode(mode);
    setCurrentItem(item);
    setCategoryFormData(item ? { ...item } : { ...emptyCategoryForm });
    setIsCategoryModalOpen(true);
  };

  const isView = modalMode === 'view';

  const eventColumns = [
    { key: 'id', label: 'Sr. No', align: 'left', render: (_, __, i) => i + 1 },
    { key: 'eventName', label: 'Event Name', align: 'center', sortable: true, render: (v) => <span className="font-bold text-teal-600">{v}</span> },
    { key: 'eventType', label: 'Event Type', align: 'center', render: v => (
      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wider">{v}</span>
    )},
    { key: 'location', label: 'Location', align: 'center', render: (_, r) => (
      <div className="flex flex-col items-center">
        <span className="text-slate-600 font-medium text-[12px]">{r.city || '—'}</span>
        <span className="text-[10px] text-slate-400">{r.district || ''}</span>
      </div>
    )},
    { key: 'organizerName', label: 'Organizer', align: 'center', render: v => <span className="text-slate-600 font-medium text-[12px]">{v || '—'}</span> },
    { key: 'eventStatus', label: 'Status', align: 'center', render: v => {
        const s = EVENT_STATUSES.find(st => st.value === v) || { label: v, color: 'slate' };
        let colorClasses = "bg-slate-100 text-slate-600";
        if (s.color === 'sky') colorClasses = "bg-sky-100 text-sky-600";
        if (s.color === 'teal') colorClasses = "bg-teal-100 text-teal-600";
        if (s.color === 'rose') colorClasses = "bg-rose-100 text-rose-600";
        if (s.color === 'emerald') colorClasses = "bg-emerald-100 text-emerald-600";
        return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${colorClasses}`}>{s.label}</span>;
    }},
    { key: 'isPublished', label: 'Published', align: 'center', render: (v, r) => <StatusToggle status={v} onToggle={() => togglePublished(r)} /> },
    { key: 'actions', label: 'Actions', align: 'center', render: (_, r) => (
      <ActionButtons
        onView={row => openModal('view', row)}
        onEdit={row => openModal('edit', row)}
        onDelete={row => { setItemToDelete(row); setIsDeleteModalOpen(true); }}
        row={r}
      />
    )}
  ];

  const categoryColumns = [
    { key: 'id', label: 'Sr. No', align: 'left', render: (_, __, i) => i + 1 },
    { key: 'categoryName', label: 'Category Name', align: 'center', sortable: true, render: (v) => <span className="font-bold text-teal-600">{v}</span> },
    { key: 'description', label: 'Description', align: 'center', render: (v) => <span className="text-slate-500 text-[12px]">{v || '—'}</span> },
    { key: 'isPublished', label: 'Status', align: 'center', render: (v, r) => <StatusToggle status={v} onToggle={() => toggleCategoryPublished(r)} /> },
    { key: 'actions', label: 'Actions', align: 'center', render: (_, r) => (
      <ActionButtons
        onView={row => openCategoryModal('view', row)}
        onEdit={row => openCategoryModal('edit', row)}
        onDelete={row => { setItemToDelete(row); setIsDeleteModalOpen(true); }}
        row={r}
      />
    )}
  ];

  const columns = activeSubmodule === 'event' ? eventColumns : categoryColumns;

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
            {modalMode === 'add' ? 'Create New' : modalMode === 'edit' ? 'Edit' : 'View'} Event
          </h2>
          {formData.eventCode && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{formData.eventCode}</span>}
        </div>
      </div>

      <div className="flex gap-1.5 p-1 bg-slate-50/80 rounded-2xl border border-slate-100 w-fit overflow-x-auto max-w-full">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(i)}
            className={`px-6 py-2.5 text-[13px] font-bold rounded-xl whitespace-nowrap transition-all duration-300 ${
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
            className="w-32 h-10 text-[13px] font-bold rounded-xl border-slate-200 text-slate-500 hover:bg-slate-50 transition-all shadow-sm"
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
              {currentItem ? "Update" : "Create"} Event
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
    <CommonPageLayout title="Event Management" stats={stats}>
      <div className="w-full relative bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mb-6 px-1">
          <div className="flex items-center gap-2 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => {
                setActiveSubmodule("category");
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-bold transition-all ${activeSubmodule === "category" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
            >
              Event Category
            </button>
            <button
              onClick={() => {
                setActiveSubmodule("event");
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-bold transition-all ${activeSubmodule === "event" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
            >
              Event
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div className="w-full sm:max-w-sm relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              value={activeSubmodule === "event" ? search : categorySearch}
              onChange={(e) => (activeSubmodule === "event" ? setSearch(e.target.value) : setCategorySearch(e.target.value))}
              placeholder={activeSubmodule === "event" ? "Search event name, code or city..." : "Search category name or description..."}
              className="w-full h-10 pl-11 pr-4 rounded-lg border border-gray-300 bg-white text-[13px] outline-none focus:ring-2 focus:ring-emerald-50 focus:border-emerald-500 transition-all font-medium text-slate-700 shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            {activeSubmodule === "event" ? (
              <>
                <FilterButton
                  filters={filters}
                  options={[
                    {
                      key: "eventType",
                      placeholder: "Event Type",
                      items: categories.map((c) => ({ label: c.categoryName, value: c.categoryName })),
                    },
                    {
                      key: "eventStatus",
                      placeholder: "Status",
                      items: EVENT_STATUSES.map((s) => ({ label: s.label, value: s.value })),
                    },
                  ]}
                  onChange={(k, v) => setFilters((p) => ({ ...p, [k]: v }))}
                  onClear={() => setFilters({ eventType: "All", eventStatus: "All" })}
                  dataCount={filteredData.length}
                  className="h-10 rounded-lg border-gray-300"
                />
                <Button
                  variant="emerald"
                  icon={Plus}
                  onClick={() => openModal("add")}
                  className="h-10 text-[13px] font-bold shadow-lg shadow-emerald-900/10"
                >
                  CREATE EVENT
                </Button>
              </>
            ) : (
              <>
                <FilterButton
                  filters={categoryFilters}
                  options={[
                    {
                      key: "isPublished",
                      placeholder: "Status",
                      items: [
                        { label: "Active", value: "Active" },
                        { label: "Inactive", value: "Inactive" },
                      ],
                    },
                  ]}
                  onChange={(k, v) => setCategoryFilters((p) => ({ ...p, [k]: v }))}
                  onClear={() => setCategoryFilters({ isPublished: "All" })}
                  dataCount={filteredCategories.length}
                  className="h-10 rounded-lg border-gray-300"
                />
                <Button
                  variant="emerald"
                  icon={Plus}
                  onClick={() => openCategoryModal("add")}
                  className="h-10 text-[13px] font-bold shadow-lg shadow-emerald-900/10"
                >
                  ADD CATEGORY
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="overflow-hidden border border-gray-300 bg-white mb-2 rounded-2xl">
          <div className="m-3 mt-3">
            <Table
              variant="emerald"
              columns={columns}
              data={activeSubmodule === "event" ? paginatedData : paginatedCategories}
              loading={loading}
              skipCard={true}
            />
          </div>
        </div>
        
        <Pagination 
          currentPage={currentPage} 
          totalRecords={activeSubmodule === 'event' ? filteredData.length : filteredCategories.length} 
          recordsPerPage={recordsPerPage} 
          onPageChange={setCurrentPage} 
          onRecordsPerPageChange={v => { setRecordsPerPage(v); setCurrentPage(1); }} 
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="xxl" title={modalHeader} footer={modalFooter}>
        <div className="px-1 sm:px-2 py-2 overflow-x-hidden">
          {activeTab === 0 && (
            <div className="animate-in fade-in duration-300">
               <Tab1 formData={formData} set={set} isView={isView} onImageClick={setPreviewImage} categories={categories} />
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
          {activeTab === 3 && (
            <div className="animate-in fade-in duration-300">
               <Tab4 formData={formData} set={set} isView={isView} />
            </div>
          )}
        </div>
      </Modal>

      <Modal 
        isOpen={isCategoryModalOpen} 
        onClose={() => setIsCategoryModalOpen(false)} 
        title={
          <div className="flex items-center gap-3">
            <button onClick={() => setIsCategoryModalOpen(false)} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-slate-100 text-slate-500 transition-all active:scale-95 border border-transparent hover:border-slate-200"><ArrowLeft size={18} strokeWidth={2.5} /></button>
            <div><h2 className="text-[17px] font-bold text-slate-800 tracking-tight">{modalMode === 'add' ? 'Add' : modalMode === 'edit' ? 'Edit' : 'View'} Category</h2></div>
          </div>
        }
        footer={
          <div className="flex items-center gap-3">
            {modalMode !== 'view' ? (
              <>
                <button onClick={() => setIsCategoryModalOpen(false)} className="w-32 h-10 rounded-xl border border-slate-200 text-slate-500 font-bold text-[13px] hover:bg-slate-50 transition-all">Cancel</button>
                <Button variant="emerald" onClick={handleCategorySave} className="w-32 h-10 shadow-lg shadow-emerald-900/10 font-bold text-[13px]">{modalMode === 'add' ? 'Submit' : 'Update'}</Button>
              </>
            ) : (
              <button onClick={() => setIsCategoryModalOpen(false)} className="w-32 h-10 rounded-xl border border-slate-200 text-slate-500 font-bold text-[13px] hover:bg-slate-50 transition-all">Close</button>
            )}
          </div>
        }
      >
        <div className="p-4 space-y-5">
          <Input 
            label="Category Name" 
            placeholder="e.g. Parv, Lecture, etc." 
            value={categoryFormData.categoryName} 
            onChange={e => setCategoryFormData(prev => ({ ...prev, categoryName: e.target.value }))} 
            disabled={modalMode === 'view'} 
            required 
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-slate-600 block mb-1.5">Description</label>
            <textarea 
              value={categoryFormData.description} 
              onChange={e => setCategoryFormData(prev => ({ ...prev, description: e.target.value }))} 
              disabled={modalMode === 'view'} 
              rows={4} 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[13px] focus:ring-2 focus:ring-teal-50 focus:border-[#10b981] outline-none transition-all font-medium bg-white disabled:bg-slate-50/50 resize-none" 
              placeholder="Provide category details..." 
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-slate-700">Publication Status</label>
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <StatusToggle 
                status={categoryFormData.isPublished} 
                disabled={modalMode === 'view'}
                onToggle={() => {
                  setCategoryFormData(p => ({ ...p, isPublished: !p.isPublished }));
                }} 
              />
              <span className={`text-[12px] font-bold ${categoryFormData.isPublished ? 'text-emerald-600' : 'text-slate-400'}`}>{categoryFormData.isPublished ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={handleDelete} 
        title={`Delete ${activeSubmodule === 'event' ? 'Event' : 'Category'}`} 
        message={`Are you sure you want to delete this ${activeSubmodule === 'event' ? 'event' : 'category'}?`} 
        confirmLabel="Delete" 
        variant="danger" 
      />

      {previewImage && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-10 animate-in fade-in duration-200" onClick={() => setPreviewImage(null)}>
          <button className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all shadow-2xl" onClick={() => setPreviewImage(null)}><X size={24} /></button>
          <img src={typeof previewImage === 'string' ? previewImage : URL.createObjectURL(previewImage)} alt="Preview" className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </CommonPageLayout>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 1: Event Details
// ─────────────────────────────────────────────────────────────────────────────
function Tab1({ formData, set, isView, onImageClick, categories }) {
  const fileRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) set('eventImage', file);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="flex flex-col lg:flex-row gap-10">
      <div className="flex-shrink-0">
        <div className="w-[340px] space-y-4">
          <label className="text-[13px] font-bold text-slate-700 block px-1">Event Banner Image</label>
          <div 
            className={`relative aspect-video rounded-2xl overflow-hidden border-2 border-dashed transition-all cursor-pointer group
              ${formData.eventImage ? 'border-teal-500 bg-teal-50/20' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 hover:border-teal-300'}`}
            onClick={() => !isView && fileRef.current.click()}
          >
            {formData.eventImage ? (
              <img 
                src={typeof formData.eventImage === 'string' ? formData.eventImage : URL.createObjectURL(formData.eventImage)} 
                alt="Banner" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2">
                <ImageIcon size={40} strokeWidth={1.5} />
                <span className="text-[12px] font-medium">Click to upload banner</span>
              </div>
            )}
            {!isView && (
              <div className="absolute inset-x-0 bottom-0 bg-slate-900/40 backdrop-blur-sm p-2 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] text-white font-bold flex items-center gap-1.5"><Camera size={12} /> CHANGE PHOTO</span>
              </div>
            )}
            <input type="file" ref={fileRef} accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>
          {!isView && (
            <p className="text-[10px] text-slate-400 font-medium text-center italic">* Recommended size: 1200x675px. Max 2MB.</p>
          )}
          
          <div className="pt-4 space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-bold text-slate-700">Publication Status</label>
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <StatusToggle 
                  status={formData.isPublished} 
                  disabled={isView}
                  onToggle={() => {
                    set('isPublished', !formData.isPublished);
                  }} 
                />
                <span className={`text-[12px] font-bold ${formData.isPublished ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {formData.isPublished ? 'Live & Published' : 'Draft / Private'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        <Input label="Event Name" placeholder="e.g. Paryushan Mahaparva" value={formData.eventName} onChange={e => set('eventName', e.target.value)} required disabled={isView} />
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-slate-600">Event Type *</label>
          <CustomDropdown 
            value={formData.eventType} 
            onChange={v => set('eventType', v)} 
            items={categories.filter(c => c.isPublished).map(c => c.categoryName)} 
            placeholder="Select Category" 
            disabled={isView} 
          />
        </div>
        <div className="md:col-span-2">
            <label className="text-[13px] font-medium text-slate-600 block mb-1.5">Description</label>
            <textarea value={formData.description} onChange={e => set('description', e.target.value)} disabled={isView} rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[13px] focus:ring-2 focus:ring-teal-50 focus:border-[#10b981] outline-none transition-all font-medium bg-white disabled:bg-slate-50/50 resize-none" placeholder="Provide event details..." />
        </div>
        <Input label="Start Date" type="date" value={formData.startDate} onChange={e => set('startDate', e.target.value)} required disabled={isView} />
        <Input label="End Date" type="date" value={formData.endDate} onChange={e => set('endDate', e.target.value)} required disabled={isView} />
        
        <div>
          <label className="text-[13px] font-medium text-slate-600 block mb-1.5">Start Time</label>
          <TimePicker value={formData.startTime} onChange={e => set('startTime', e.target.value)} disabled={isView} />
        </div>
        <div>
          <label className="text-[13px] font-medium text-slate-600 block mb-1.5">End Time</label>
          <TimePicker value={formData.endTime} onChange={e => set('endTime', e.target.value)} disabled={isView} />
        </div>

        <Input label="Expected Attendees" type="number" placeholder="0" value={formData.expectedAttendees} onChange={e => set('expectedAttendees', e.target.value)} disabled={isView} icon={Users} />
        <Input label="Confirmed Attendees" type="number" placeholder="0" value={formData.confirmedAttendees} onChange={e => set('confirmedAttendees', e.target.value)} disabled={isView} icon={Check} />
        
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-slate-600">Ticketing *</label>
          <div className="grid grid-cols-2 gap-2">
             <button type="button" onClick={() => set('isFree', true)} className={`h-10 rounded-xl text-[12px] font-bold transition-all ${formData.isFree ? 'bg-teal-600 text-white shadow-lg shadow-teal-100' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`} disabled={isView}>FREE</button>
             <button type="button" onClick={() => set('isFree', false)} className={`h-10 rounded-xl text-[12px] font-bold transition-all ${!formData.isFree ? 'bg-amber-600 text-white shadow-lg shadow-amber-100' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`} disabled={isView}>PAID</button>
          </div>
        </div>

        {!formData.isFree && (
          <Input label="Ticket Price (₹)" type="number" placeholder="0.00" value={formData.ticketPrice} onChange={e => set('ticketPrice', e.target.value)} disabled={isView} icon={Ticket} />
        )}
        
        <Input label="Max Participants" type="number" placeholder="Leave empty for unlimited" value={formData.maxParticipants} onChange={e => set('maxParticipants', e.target.value)} disabled={isView} icon={Users} />
        
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-slate-600">Event Status *</label>
          <CustomDropdown value={formData.eventStatus} onChange={v => set('eventStatus', v)} items={EVENT_STATUSES.map(s => s.value)} placeholder="Select Status" disabled={isView} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 2: Location & Venue
// ─────────────────────────────────────────────────────────────────────────────
function Tab2({ formData, set, isView }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        <div className="md:col-span-2">
            <Input label="Venue Address" placeholder="Detailed Address" value={formData.venueAddress} onChange={e => set('venueAddress', e.target.value)} required disabled={isView} icon={MapPin} />
        </div>
        <Input label="Landmark" placeholder="Near..." value={formData.landmark} onChange={e => set('landmark', e.target.value)} disabled={isView} />
        <Input label="City / Village" placeholder="e.g. Ahmedabad" value={formData.city} onChange={e => set('city', e.target.value)} required disabled={isView} />
        
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-slate-600">District *</label>
          <CustomDropdown value={formData.district} onChange={v => set('district', v)} items={GUJARAT_DISTRICTS} placeholder="Select District" disabled={isView} />
        </div>
        <Input label="Pincode" placeholder="6 digits" value={formData.pincode} onChange={e => set('pincode', e.target.value)} required disabled={isView} maxLength={6} />
        
        <div className="md:col-span-2">
            <Input label="Google Maps Link" placeholder="https://maps.app.goo.gl/..." value={formData.googleMapsLink} onChange={e => set('googleMapsLink', e.target.value)} disabled={isView} icon={ExternalLink} />
        </div>

        <Input label="Latitude" placeholder="e.g. 23.0225" value={formData.latitude} onChange={e => set('latitude', e.target.value)} disabled={isView} />
        <Input label="Longitude" placeholder="e.g. 72.5714" value={formData.longitude} onChange={e => set('longitude', e.target.value)} disabled={isView} />
        
        <Input label="Venue Name / Hall" placeholder="e.g. Mahasabha Hall" value={formData.venueName} onChange={e => set('venueName', e.target.value)} disabled={isView} icon={Building2} />
        <Input label="Venue Capacity" type="number" placeholder="0" value={formData.venueCapacity} onChange={e => set('venueCapacity', e.target.value)} disabled={isView} icon={Users} />
      </div>

      <div>
        <h4 className="text-slate-800 font-bold text-[14px] mb-4">Venue Facilities</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <label className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${formData.parkingAvailable ? 'border-teal-200 bg-teal-50 text-teal-700' : 'border-slate-200 bg-white text-slate-500'} ${isView ? 'pointer-events-none' : ''}`}>
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${formData.parkingAvailable ? 'bg-teal-600 border-teal-600' : 'border-slate-300'}`}>{formData.parkingAvailable && <Check size={14} className="text-white" />}</div>
                <input type="checkbox" checked={formData.parkingAvailable} onChange={e => set('parkingAvailable', e.target.checked)} className="hidden" />
                <span className="text-[13px] font-bold">Parking Available</span>
            </label>
            <label className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${formData.disabledAccessAvailable ? 'border-teal-200 bg-teal-50 text-teal-700' : 'border-slate-200 bg-white text-slate-500'} ${isView ? 'pointer-events-none' : ''}`}>
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${formData.disabledAccessAvailable ? 'bg-teal-600 border-teal-600' : 'border-slate-300'}`}>{formData.disabledAccessAvailable && <Check size={14} className="text-white" />}</div>
                <input type="checkbox" checked={formData.disabledAccessAvailable} onChange={e => set('disabledAccessAvailable', e.target.checked)} className="hidden" />
                <span className="text-[13px] font-bold">Disabled Access</span>
            </label>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 3: Organizer & Contact
// ─────────────────────────────────────────────────────────────────────────────
function Tab3({ formData, set, isView }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
      <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-slate-600">Sangh / Organization *</label>
          <CustomDropdown value={formData.sanghId} onChange={v => set('sanghId', v)} items={SANGHS} placeholder="Select Sangh" disabled={isView} />
      </div>
      <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-slate-600">Derasar (Optional)</label>
          <CustomDropdown value={formData.derasarId} onChange={v => set('derasarId', v)} items={DERASARS} placeholder="Link to Derasar" disabled={isView} />
      </div>
      
      <div className="md:col-span-2 pt-2 border-b border-slate-100 pb-2"><h4 className="text-slate-400 text-[11px] font-black uppercase tracking-widest">Main Contact Persons</h4></div>
      
      <Input label="Primary Organizer Name" placeholder="Name" value={formData.organizerName} onChange={e => set('organizerName', e.target.value)} required disabled={isView} icon={Users} />
      <Input label="Organizer Phone" type="tel" placeholder="Phone" value={formData.organizerPhone} onChange={e => set('organizerPhone', e.target.value)} required disabled={isView} icon={Phone} />
      
      <Input label="Organizer Email" type="email" placeholder="Email" value={formData.organizerEmail} onChange={e => set('organizerEmail', e.target.value)} disabled={isView} icon={Mail} />
      <Input label="Registration Inquiries" type="tel" placeholder="Registration Hotline" value={formData.registrationPhone} onChange={e => set('registrationPhone', e.target.value)} disabled={isView} icon={Phone} />
      
      <Input label="Secondary Contact Name" placeholder="Secondary contact" value={formData.secondaryContactName} onChange={e => set('secondaryContactName', e.target.value)} disabled={isView} icon={Users} />
      <Input label="Secondary Contact Phone" type="tel" placeholder="Secondary Phone" value={formData.secondaryContactPhone} onChange={e => set('secondaryContactPhone', e.target.value)} disabled={isView} icon={Phone} />

      <div className="md:col-span-2 pt-2 border-b border-slate-100 pb-2"><h4 className="text-slate-400 text-[11px] font-black uppercase tracking-widest">Speaker / Dignitary Info</h4></div>
      
      <Input label="Speaker / Guest Name" placeholder="Dignitary Name" value={formData.speakerName} onChange={e => set('speakerName', e.target.value)} disabled={isView} icon={Users} />
      <Input label="Speaker Email/Phone" placeholder="Contact Detail" value={formData.speakerContact} onChange={e => set('speakerContact', e.target.value)} disabled={isView} />
      
      <div className="md:col-span-2">
        <Input label="Website / Registration Link" placeholder="https://..." value={formData.websiteLink} onChange={e => set('websiteLink', e.target.value)} disabled={isView} icon={Globe} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 4: Additional Info & Media
// ─────────────────────────────────────────────────────────────────────────────
function Tab4({ formData, set, isView }) {
  const galleryRef = useRef(null);
  const brochureRef = useRef(null);

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      set('galleryPhotos', [...(formData.galleryPhotos || []), ...files]);
    }
  };

  const handleBrochureChange = (e) => {
    const file = e.target.files[0];
    if (file) set('eventBrochure', file);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        <Input label="Parking Arrangements" placeholder="Details about parking" value={formData.parkingArrangement} onChange={e => set('parkingArrangement', e.target.value)} disabled={isView} icon={Truck} />
        <Input label="Food / Prasad" placeholder="Catering details" value={formData.foodPrasad} onChange={e => set('foodPrasad', e.target.value)} disabled={isView} icon={Info} />
        
        <Input label="Accommodation" placeholder="Guest stay details" value={formData.accommodation} onChange={e => set('accommodation', e.target.value)} disabled={isView} icon={Building2} />
        <Input label="Transportation" placeholder="Shuttle/Bus services" value={formData.transportation} onChange={e => set('transportation', e.target.value)} disabled={isView} icon={Truck} />
        
        <Input label="Medical Facilities" placeholder="First aid, medical booth" value={formData.medicalFacilities} onChange={e => set('medicalFacilities', e.target.value)} disabled={isView} icon={Stethoscope} />
        <Input label="Security Arrangements" placeholder="Guards, CCTV" value={formData.security} onChange={e => set('security', e.target.value)} disabled={isView} icon={Shield} />
        
        <div className="md:col-span-2">
            <label className="text-[13px] font-medium text-slate-600 block mb-1.5">Special Announcements</label>
            <textarea value={formData.announcements} onChange={e => set('announcements', e.target.value)} disabled={isView} rows={2} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[13px] focus:ring-2 focus:ring-teal-50 focus:border-[#10b981] outline-none transition-all font-medium bg-white disabled:bg-slate-50/50 resize-none" placeholder="Important notes for participants..." />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4 border-t border-slate-100">
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-slate-800 font-bold text-[14px]">Event Brochure (PDF)</h4>
                {!isView && (
                    <button type="button" onClick={() => brochureRef.current.click()} className="text-[11px] font-bold text-teal-600 hover:text-teal-700 px-3 py-1 bg-teal-50 rounded-lg">Upload Brochure</button>
                )}
                <input type="file" ref={brochureRef} accept=".pdf" className="hidden" onChange={handleBrochureChange} />
            </div>
            {formData.eventBrochure ? (
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600"><Briefcase size={20} /></div>
                        <div className="flex flex-col">
                            <span className="text-[12px] font-bold text-slate-700 truncate max-w-[200px]">{formData.eventBrochure.name || 'Event_Brochure.pdf'}</span>
                            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">PDF document</span>
                        </div>
                    </div>
                    {!isView && <button type="button" onClick={() => set('eventBrochure', null)} className="text-rose-500 hover:text-rose-600"><X size={16} /></button>}
                </div>
            ) : (
                <div className="p-8 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-300">
                    <Briefcase size={32} strokeWidth={1} />
                    <span className="text-[11px] font-medium mt-2">No brochure uploaded</span>
                </div>
            )}
        </div>

        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-slate-800 font-bold text-[14px]">Gallery Photos</h4>
                {!isView && (
                    <button type="button" onClick={() => galleryRef.current.click()} className="text-[11px] font-bold text-teal-600 hover:text-teal-700 px-3 py-1 bg-teal-50 rounded-lg">Add Photos</button>
                )}
                <input type="file" ref={galleryRef} multiple accept="image/*" className="hidden" onChange={handleGalleryChange} />
            </div>
            {(formData.galleryPhotos?.length > 0) ? (
                <div className="grid grid-cols-4 gap-2">
                    {formData.galleryPhotos.map((photo, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                            <img src={typeof photo === 'string' ? photo : URL.createObjectURL(photo)} alt="Gallery" className="w-full h-full object-cover" />
                            {!isView && (
                                <button type="button" onClick={() => {
                                    const newGallery = [...formData.galleryPhotos];
                                    newGallery.splice(idx, 1);
                                    set('galleryPhotos', newGallery);
                                }} className="absolute top-1 right-1 w-5 h-5 bg-white shadow-sm rounded-full flex items-center justify-center text-rose-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"><X size={10} /></button>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-8 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-300">
                    <ImageIcon size={32} strokeWidth={1} />
                    <span className="text-[11px] font-medium mt-2">No gallery photos</span>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
