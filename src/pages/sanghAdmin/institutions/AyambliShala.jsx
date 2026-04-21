import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Building2, Plus, Eye, Pencil, Trash2, MapPin, Users,
  Search, Phone, Mail, Clock, ChevronRight, Image as ImageIcon,
  ArrowLeft, X, Check, Globe, Camera
} from 'lucide-react';
import CommonPageLayout from '../../../components/ui/CommonPageLayout';
import Button from '../../../components/ui/Button';
import Table from '../../../components/ui/Table';
import StatusToggle from '../../../components/ui/StatusToggle';
import { useToast } from '../../../components/ui/Toast';
import Modal from '../../../components/ui/Modal';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import { ayambliShalaService } from '../../../services/ayambliShalaService';
import FilterButton from '../../../components/ui/FilterButton';
import Input from '../../../components/ui/Input';
import Pagination from '../../../components/ui/Pagination';
import CustomDropdown from '../../../components/ui/CustomDropdown';
import TimePicker from '../../../components/ui/TimePicker';
import ActionButtons from '../../../components/ui/ActionButtons';
import ImageGalleryUpload from '../../../components/ui/ImageGalleryUpload';

// ── Tab config ──────────────────────────────────────────────────────────────
const TABS = ['Ayambli Details', 'Location', 'Contact & Management'];

// ── Dropdown Options ────────────────────────────────────────────────────────
const OPERATIONAL_TYPES = [
  'Daily (Runs 365 days)',
  'Only Oli (Runs only during Chaitra/Ashwin Navpad Oli)',
  'Specific Tithis (e.g., only on Ashtami, Chaturdashi)'
];

const STATUS_OPTIONS = [
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' },
  { label: 'Under Renovation', value: 'Under Renovation' }
];

const GUJARAT_DISTRICTS = [
  'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch', 'Bhavnagar', 
  'Botad', 'Chhota Udepur', 'Dahod', 'Dang', 'Devbhumi Dwarka', 'Gandhinagar', 
  'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kutch', 'Kheda', 'Mahisagar', 'Mehsana', 
  'Morbi', 'Narmada', 'Navsari', 'Panchmahal', 'Patan', 'Porbandar', 'Rajkot', 
  'Sabarkantha', 'Surat', 'Surendranagar', 'Tapi', 'Vadodara', 'Valsad'
];

// ── Empty form ───────────────────────────────────────────────────────────────
const emptyForm = {
  name: '',
  operationalType: '',
  sittingCapacity: '',
  morningFrom: '10:00',
  morningTo: '13:30',
  separateSeating: false,
  wheelchairAccessible: false,
  boiledWater: false,
  waitingArea: false,
  status: 'Active',
  photos: [],
  
  // Tab 2: Location
  address: '',
  landmark: '',
  city: '',
  taluka: '',
  district: '',
  pincode: '',
  mapLink: '',

  // Tab 3: Contact
  trustName: '',
  sanchalakName: '',
  sanchalakPhone: '',
  maharajName: '',
  email: ''
};

export default function AyambliShala() {
  const [ayamblishalas, setAyamblishalas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: 'All', district: 'All' });
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [previewImage, setPreviewImage] = useState(null);
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
      const response = await ayambliShalaService.getAyambliShalas();
      setAyamblishalas(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error fetching ayamblishalas:', error);
      showToast('Failed to load Ayambli Shala data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredData = useMemo(() => ayamblishalas.filter(item => {
    const q = search.toLowerCase();
    return (
      (!search || 
        item.name?.toLowerCase().includes(q) || 
        item.city?.toLowerCase().includes(q) || 
        item.trustName?.toLowerCase().includes(q)
      ) && 
      (filters.status === 'All' || item.status === filters.status) &&
      (filters.district === 'All' || item.district === filters.district)
    );
  }), [ayamblishalas, search, filters]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * recordsPerPage;
    return filteredData.slice(start, start + recordsPerPage);
  }, [filteredData, currentPage, recordsPerPage]);

  const stats = useMemo(() => [
    { title: 'Total Ayambli Shala', value: ayamblishalas.length, icon: Building2, color: 'sky' },
    { title: 'Active Shalas', value: ayamblishalas.filter(p => p.status === 'Active').length, icon: Check, color: 'teal' },
    { title: 'Inactive Shalas', value: ayamblishalas.filter(p => p.status === 'Inactive').length, icon: X, color: 'rose' },
  ], [ayamblishalas]);

  const openModal = (mode, item = null) => {
    setModalMode(mode);
    setCurrentItem(item);
    setFormData(item ? { ...emptyForm, ...item } : emptyForm);
    setActiveTab(0);
    setIsModalOpen(true);
  };

  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

  const toggleStatus = async (item) => {
    try {
      const newStatus = item.status === 'Active' ? 'Inactive' : 'Active';
      await ayambliShalaService.updateAyambliShala(item.id, { ...item, status: newStatus });
      fetchData();
      showToast('Ayambli Shala status updated');
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('Failed to update status', 'error');
    }
  };

  const handleSave = async () => {
    try {
      if (modalMode === 'add') {
        await ayambliShalaService.createAyambliShala(formData);
        showToast('Ayambli Shala added successfully');
      } else {
        await ayambliShalaService.updateAyambliShala(currentItem.id, formData);
        showToast('Ayambli Shala updated successfully');
      }
      fetchData();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving Ayambli Shala:', error);
      showToast('Action failed', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await ayambliShalaService.deleteAyambliShala(itemToDelete.id);
      showToast('Ayambli Shala deleted successfully', 'delete');
      fetchData();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting Ayambli Shala:', error);
      showToast('Delete failed', 'error');
    }
  };

  const isView = modalMode === 'view';



  const columns = [
    { key: 'id', label: 'Sr. No.', align: 'left', render: (_, __, i) => i + 1 },
    { key: 'name', label: 'Shala Name', align: 'center', sortable: true, render: (v, r) => (
      <div className="flex flex-col items-center">
        <span className="font-bold text-teal-600">{v}</span>
        <span className="text-xs text-slate-400 truncate max-w-[200px]">
          {r.operationalType}
        </span>
      </div>
    )},
    { key: 'trustName', label: 'Sangh', align: 'center', render: v => <span className="text-slate-600 font-medium text-sm">{v || '—'}</span> },
    { key: 'city', label: 'Village / City', align: 'center', render: (v, r) => (
      <div className="flex flex-col items-center">
        <span className="text-slate-600 font-medium text-sm">{v}</span>
        <span className="text-xs text-slate-400">{r.district || ''}</span>
      </div>
    )},
    { key: 'sittingCapacity', label: 'Capacity', align: 'center' },
    { key: 'status', label: 'Status', align: 'center', render: (v, r) => (
      v === 'Under Renovation' ? 
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-50 text-orange-600 border border-orange-200">Under Renovation</span> 
      : <StatusToggle status={v === 'Active'} onToggle={() => toggleStatus(r)} />
    )},
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
            {modalMode === 'add' ? 'Add New' : modalMode === 'edit' ? 'Edit' : 'View'} Ayambli Shala
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
          )
        }

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
    <CommonPageLayout title="Ayambli Shala Management" stats={stats}>
      <div className="w-full relative bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div className="w-full sm:max-w-sm relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Shala, City, or Sangh..."
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
                  items: [
                    { label: "Active", value: "Active" },
                    { label: "Inactive", value: "Inactive" },
                    { label: "Under Renovation", value: "Under Renovation" },
                  ],
                },
                {
                  key: "district",
                  placeholder: "City",
                  items: GUJARAT_DISTRICTS.map((d) => ({ label: d, value: d })),
                },
              ]}
              onChange={(k, v) => {
                setFilters((p) => ({ ...p, [k]: v }));
                setCurrentPage(1);
              }}
              onClear={() => {
                setFilters({ status: "All", district: "All" });
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
              ADD AYAMBLI SHALA
            </Button>
          </div>
        </div>

        <div className="overflow-hidden border border-gray-300 bg-white mb-4 rounded-2xl">
          <div className="m-3 mt-3">
            <Table variant="emerald" columns={columns} data={paginatedData} loading={loading} skipCard={true} />
          </div>
        </div>

        <div className="mt-2">
          <Pagination 
            currentPage={currentPage} 
            totalRecords={filteredData.length} 
            recordsPerPage={recordsPerPage} 
            onPageChange={setCurrentPage} 
            onRecordsPerPageChange={v => { setRecordsPerPage(v); setCurrentPage(1); }} 
          />
        </div>
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
              <Tab1 formData={formData} set={set} isView={isView} onImageClick={setPreviewImage} />
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

      <ConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDelete} title="Delete Shala" message={`Delete "${itemToDelete?.name}"?`} confirmLabel="Delete" variant="danger" />

      {previewImage && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-10 animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <button 
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all shadow-2xl"
            onClick={() => setPreviewImage(null)}
          >
            <X size={24} />
          </button>
          <img 
            src={typeof previewImage === 'string' ? previewImage : URL.createObjectURL(previewImage)} 
            alt="Big Preview" 
            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300" 
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </CommonPageLayout>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Components for Tabs
// ─────────────────────────────────────────────────────────────────────────────

function Tab1({ formData, set, isView, onImageClick }) {
  return (
    <div className="flex flex-col lg:flex-row gap-10">
      <div className="flex-shrink-0">
        <div className="w-[260px]">
          <ImageGalleryUpload
            title="Shala Gallery"
            images={formData.photos || []}
            onAdd={(newFiles) => set('photos', [...(formData.photos || []), ...newFiles])}
            onRemove={(idx) => {
              const newPhotos = [...(formData.photos || [])];
              newPhotos.splice(idx, 1);
              set('photos', newPhotos);
            }}
            onImageClick={onImageClick}
            disabled={isView}
            maxImages={8}
          />
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <Input label="Ayambli Shala Name" placeholder="Enter Name" value={formData.name} onChange={e => set('name', e.target.value)} required disabled={isView} />
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-slate-600">Operational Type *</label>
          <CustomDropdown value={formData.operationalType} onChange={v => set('operationalType', v)} items={OPERATIONAL_TYPES} placeholder="Select Type" disabled={isView} />
        </div>
        <Input label="Sitting Capacity" type="number" placeholder="Count" value={formData.sittingCapacity} onChange={e => set('sittingCapacity', e.target.value)} required disabled={isView} />
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-slate-600">Status *</label>
          <CustomDropdown value={formData.status} onChange={v => set('status', v)} items={STATUS_OPTIONS.map(opt => opt.value)} placeholder="Select Status" disabled={isView} />
        </div>

        <div className="md:col-span-2 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-sm mt-2">
          <h4 className="flex items-center gap-2 text-slate-800 font-bold text-[14px] mb-6">
            <Clock size={16} className="text-teal-600" />
            Timings
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <label className="block text-[13px] font-bold text-slate-600 mb-3">Morning / Afternoon Timings</label>
              <div className="flex items-center gap-3">
                <TimePicker value={formData.morningFrom} onChange={e => set('morningFrom', e.target.value)} disabled={isView} className="flex-1" />
                <span className="text-slate-400 text-[11px] font-black uppercase tracking-widest px-1">to</span>
                <TimePicker value={formData.morningTo} onChange={e => set('morningTo', e.target.value)} disabled={isView} className="flex-1" />
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-[13px] font-bold text-slate-600 mb-3">Facilities Available</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'separateSeating', label: 'Separate Male/Female Seating' },
              { id: 'wheelchairAccessible', label: 'Wheelchair Accessible' },
              { id: 'boiledWater', label: 'Boiled Water (Ukalo) Available All Day' },
              { id: 'waitingArea', label: 'Waiting Area' }
            ].map(item => (
              <label key={item.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${formData[item.id] ? 'bg-teal-50 border-teal-200' : 'bg-white border-slate-200 hover:border-teal-200'}`}>
                <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${formData[item.id] ? 'bg-teal-600 text-white' : 'bg-slate-100 text-transparent border border-slate-300'}`}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <span className="text-[13px] font-medium text-slate-700">{item.label}</span>
                <input type="checkbox" className="hidden" checked={formData[item.id]} disabled={isView} onChange={(e) => set(item.id, e.target.checked)} />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Tab2({ formData, set, isView }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      <div className="md:col-span-2">
        <Input label="Address Line 1 & 2" placeholder="Address" value={formData.address} onChange={e => set('address', e.target.value)} required disabled={isView} />
      </div>
      <Input label="Landmark" placeholder="Landmark" value={formData.landmark} onChange={e => set('landmark', e.target.value)} disabled={isView} />
      
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
      
      <Input label="Village" placeholder="Village" value={formData.city} onChange={e => set('city', e.target.value)} required disabled={isView} icon={Building2} />
      <Input label="Area" placeholder="Area" value={formData.taluka} onChange={e => set('taluka', e.target.value)} disabled={isView} icon={Building2} />
      <Input label="Pincode" placeholder="6 Digits" value={formData.pincode} onChange={e => set('pincode', e.target.value)} required disabled={isView} maxLength={6} />
      <Input label="Google Maps Link" placeholder="URL format" value={formData.mapLink} onChange={e => set('mapLink', e.target.value)} disabled={isView} icon={MapPin} />
    </div>
  );
}

function Tab3({ formData, set, isView }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      <Input label="Trust / Sangh Name" placeholder="Trust Name" value={formData.trustName} onChange={e => set('trustName', e.target.value)} disabled={isView} icon={Building2} />
      
      <Input label="Sanchalak (Manager) Name" placeholder="Manager Name" value={formData.sanchalakName} onChange={e => set('sanchalakName', e.target.value)} required disabled={isView} icon={Users} />
      <Input label="Sanchalak Phone" placeholder="Manager Phone" type="tel" value={formData.sanchalakPhone} onChange={e => set('sanchalakPhone', e.target.value)} required disabled={isView} icon={Phone} />

      <Input label="Kitchen Head / Maharaj Name" placeholder="Maharaj Name" value={formData.maharajName} onChange={e => set('maharajName', e.target.value)} disabled={isView} icon={Users} />
      
      <Input label="Email Address" placeholder="Email" type="email" value={formData.email} onChange={e => set('email', e.target.value)} disabled={isView} icon={Mail} />
    </div>
  );
}
