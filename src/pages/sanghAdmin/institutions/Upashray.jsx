import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Building2, Plus, Eye, Pencil, Trash2, MapPin, Users,
  Search, Phone, Mail, ChevronRight, Image as ImageIcon,
  ArrowLeft, X, Check, Globe, Camera
} from 'lucide-react';
import CommonPageLayout from '../../../components/ui/CommonPageLayout';
import Button from '../../../components/ui/Button';
import Table from '../../../components/ui/Table';
import StatusToggle from '../../../components/ui/StatusToggle';
import { useToast } from '../../../components/ui/Toast';
import Modal from '../../../components/ui/Modal';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import { upashrayService } from '../../../services/upashrayService';
import FilterButton from '../../../components/ui/FilterButton';
import Input from '../../../components/ui/Input';
import Pagination from '../../../components/ui/Pagination';
import CustomDropdown from '../../../components/ui/CustomDropdown';

// ── Tab config ──────────────────────────────────────────────────────────────
const TABS = ['Upashray Details', 'Location', 'Contact & Management'];

// ── Dropdown Options ────────────────────────────────────────────────────────
const ALLOCATION_TYPES = [
  'Only for Sadhus (Male Ascetics)',
  'Only for Sadhvis (Female Ascetics)',
  'Both (Separate Sections)'
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
  allocationType: '',
  hallCapacity: '',
  numberOfRooms: '',
  gyanBhandar: false,
  separateWashrooms: false,
  woodenPlanks: false,
  audioSystem: false,
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
  trusteeName: '',
  trusteePhone: '',
  caretakerName: '',
  caretakerPhone: '',
  email: ''
};

export default function Upashray() {
  const [upashrays, setUpashrays] = useState([]);
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
      const response = await upashrayService.getUpashrays();
      setUpashrays(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error fetching upashrays:', error);
      showToast('Failed to load Upashray data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredData = useMemo(() => upashrays.filter(item => {
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
  }), [upashrays, search, filters]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * recordsPerPage;
    return filteredData.slice(start, start + recordsPerPage);
  }, [filteredData, currentPage, recordsPerPage]);

  const stats = useMemo(() => [
    { title: 'TOTAL UPASHRAYS', value: upashrays.length, icon: Building2, color: 'sky' },
    { title: 'ACTIVE', value: upashrays.filter(p => p.status === 'Active').length, icon: Check, color: 'teal' },
    { title: 'INACTIVE', value: upashrays.filter(p => p.status === 'Inactive').length, icon: X, color: 'rose' },
  ], [upashrays]);

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
      await upashrayService.updateUpashray(item.id, { ...item, status: newStatus });
      fetchData();
      showToast('Upashray status updated');
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('Failed to update status', 'error');
    }
  };

  const handleSave = async () => {
    try {
      if (modalMode === 'add') {
        await upashrayService.createUpashray(formData);
        showToast('Upashray added successfully');
      } else {
        await upashrayService.updateUpashray(currentItem.id, formData);
        showToast('Upashray updated successfully');
      }
      fetchData();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving Upashray:', error);
      showToast('Action failed', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await upashrayService.deleteUpashray(itemToDelete.id);
      showToast('Upashray deleted successfully', 'delete');
      fetchData();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting Upashray:', error);
      showToast('Delete failed', 'error');
    }
  };

  const isView = modalMode === 'view';



  const columns = [
    { key: 'id', label: 'SR. NO', align: 'center', render: (_, __, i) => i + 1 },
    { key: 'name', label: 'UPASHRAY NAME', sortable: true, render: (v, r) => (
      <div className="flex flex-col">
        <span className="font-bold text-teal-600">{v}</span>
        <span className="text-xs text-slate-400 truncate max-w-[200px]">
          {r.allocationType}
        </span>
      </div>
    )},
    { key: 'trustName', label: 'SANGH', render: v => <span className="text-slate-600 font-medium text-sm">{v || '—'}</span> },
    { key: 'city', label: 'VILLAGE / CITY', render: (v, r) => (
      <div className="flex flex-col">
        <span className="text-slate-600 font-medium text-sm">{v}</span>
        <span className="text-xs text-slate-400">{r.district || ''}</span>
      </div>
    )},
    { key: 'hallCapacity', label: 'HALL CAPACITY', align: 'center' },
    { key: 'status', label: 'STATUS', align: 'center', render: (v, r) => (
      v === 'Under Renovation' ? 
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-50 text-orange-600 border border-orange-200">Under Renovation</span> 
      : <StatusToggle status={v === 'Active'} onToggle={() => toggleStatus(r)} />
    )},
    { key: 'actions', label: 'ACTION', align: 'center', render: (_, r) => (
      <div className="flex items-center justify-center gap-2">
        <button onClick={() => openModal('view', r)} className="w-8 h-8 flex items-center justify-center text-teal-500 bg-teal-50 hover:bg-teal-100 rounded-full transition-all"><Eye size={15} /></button>
        <button onClick={() => openModal('edit', r)} className="w-8 h-8 flex items-center justify-center text-sky-500 bg-sky-50 hover:bg-sky-100 rounded-full transition-all border border-sky-100"><Pencil size={15} /></button>
        <button onClick={() => { setItemToDelete(r); setIsDeleteModalOpen(true); }} className="w-8 h-8 flex items-center justify-center text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-full transition-all border border-rose-100"><Trash2 size={15} /></button>
      </div>
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
            {modalMode === 'add' ? 'Add New' : modalMode === 'edit' ? 'Edit' : 'View'} Upashray
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
                ? 'bg-[#10b981] text-white shadow-md shadow-emerald-100 ring-1 ring-emerald-500/20' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-white'
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
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="w-36 h-[42px] rounded-xl border border-slate-200 text-slate-500 font-bold text-[14px] hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300 transition-all active:scale-95"
          >
            Cancel
          </button>
          {activeTab < TABS.length - 1 ? (
            <button
              type="button"
              onClick={() => setActiveTab(t => t + 1)}
              className="w-36 h-[42px] rounded-xl bg-[#10b981] text-white font-bold text-[14px] hover:bg-[#059669] hover:shadow-lg hover:shadow-emerald-100 transition-all active:scale-95"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              className="w-36 h-[42px] rounded-xl bg-[#10b981] text-white font-bold text-[14px] hover:bg-[#059669] hover:shadow-lg hover:shadow-emerald-100 transition-all active:scale-95"
            >
              {modalMode === 'add' ? 'Submit' : 'Update'}
            </button>
          )}
        </>
      ) : (
        <button
          type="button"
          onClick={() => setIsModalOpen(false)}
          className="w-36 h-[42px] rounded-xl border border-slate-200 text-slate-500 font-bold text-[14px] hover:bg-slate-50 transition-all"
        >
          Close
        </button>
      )}
    </div>
  );

  return (
    <CommonPageLayout title="Upashray Management" stats={stats}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        <div className="w-full sm:max-w-sm relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#10b981] transition-colors" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search Upashray, City, or Sangh..." className="w-full h-[34px] pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50/30 text-[13px] focus:ring-2 focus:ring-teal-50 focus:border-[#10b981] outline-none transition-all font-medium" />
        </div>
        <div className="flex items-center gap-2">
          <FilterButton 
            filters={filters} 
            options={[
              { key: 'status', placeholder: 'Status', items: [{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }, { label: 'Under Renovation', value: 'Under Renovation' }] },
              { key: 'district', placeholder: 'City', items: GUJARAT_DISTRICTS.map(d => ({ label: d, value: d })) }
            ]} 
            onChange={(k, v) => { setFilters(p => ({ ...p, [k]: v })); setCurrentPage(1); }} 
            onClear={() => { setFilters({ status: 'All', district: 'All' }); setCurrentPage(1); }} 
            dataCount={filteredData.length} 
          />
          <Button icon={Plus} onClick={() => openModal('add')} className="shadow-lg shadow-teal-100 text-[13px] h-[34px] px-4 font-bold">Add Upashray</Button>
        </div>
      </div>
      <Table columns={columns} data={paginatedData} loading={loading} skipCard={true} />
      <Pagination currentPage={currentPage} totalRecords={filteredData.length} recordsPerPage={recordsPerPage} onPageChange={setCurrentPage} onRecordsPerPageChange={v => { setRecordsPerPage(v); setCurrentPage(1); }} />


      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="xxl"
        title={modalHeader}
        footer={modalFooter}
      >
        <div className="px-1 sm:px-2 py-2 grid">
            <div className={`col-start-1 row-start-1 transition-opacity duration-300 ${activeTab === 0 ? 'opacity-100 z-10' : 'opacity-0 -z-10 pointer-events-none invisible'}`}>
              <Tab1 formData={formData} set={set} isView={isView} onImageClick={setPreviewImage} />
            </div>
            <div className={`col-start-1 row-start-1 transition-opacity duration-300 ${activeTab === 1 ? 'opacity-100 z-10' : 'opacity-0 -z-10 pointer-events-none invisible'}`}>
              <Tab2 formData={formData} set={set} isView={isView} />
            </div>
            <div className={`col-start-1 row-start-1 transition-opacity duration-300 ${activeTab === 2 ? 'opacity-100 z-10' : 'opacity-0 -z-10 pointer-events-none invisible'}`}>
              <Tab3 formData={formData} set={set} isView={isView} />
            </div>
          </div>
      </Modal>

      <ConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDelete} title="Delete Upashray" message={`Delete "${itemToDelete?.name}"?`} confirmLabel="Delete" variant="danger" />

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
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const galleryRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFileChange = (e) => {
    const filesArray = Array.from(e.target.files);
    if (filesArray.length > 0) {
      set('photos', [...(formData.photos || []), ...filesArray]);
    }
    setShowMenu(false);
    if (galleryRef.current) galleryRef.current.value = '';
    if (cameraRef.current) cameraRef.current.value = '';
  };

  const removePhoto = (idx) => {
    const newPhotos = [...formData.photos];
    newPhotos.splice(idx, 1);
    set('photos', newPhotos);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-10">
      <div className="flex-shrink-0">
        <div className="w-[340px] space-y-4">
          <div className="flex items-center justify-between px-1">
            <label className="text-[13px] font-bold text-slate-700">Upashray Gallery</label>
            {!isView && (formData.photos?.length || 0) < 8 && (
              <div className="relative" ref={menuRef}>
                <button 
                  type="button"
                  onClick={() => setShowMenu(!showMenu)}
                  className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center hover:bg-teal-100 transition-all shadow-sm border border-teal-100"
                >
                  <Plus size={18} />
                </button>

                {showMenu && (
                  <div className="absolute top-full right-0 mt-2 z-[60] bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 min-w-[220px] animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <button 
                      type="button"
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-teal-50/50 group transition-all"
                      onClick={() => galleryRef.current.click()}
                    >
                      <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-all">
                        <ImageIcon size={18} />
                      </div>
                      <div className="flex flex-col items-start translate-y-[1px]">
                        <span className="text-[13px] font-bold text-slate-700">Gallery</span>
                        <span className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">Upload from device</span>
                      </div>
                    </button>
                    <button 
                      type="button"
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-teal-50/50 group transition-all"
                      onClick={() => cameraRef.current.click()}
                    >
                      <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-all">
                        <Camera size={18} />
                      </div>
                      <div className="flex flex-col items-start translate-y-[1px]">
                        <span className="text-[13px] font-bold text-slate-700">Camera</span>
                        <span className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">Take a photo</span>
                      </div>
                    </button>
                  </div>
                )}
                
                <input type="file" ref={galleryRef} multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                <input type="file" ref={cameraRef} accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
              {formData.photos?.length > 0 ? (
                <img 
                  src={typeof formData.photos[0] === 'string' ? formData.photos[0] : URL.createObjectURL(formData.photos[0])} 
                  alt="Main Preview" 
                  className="w-full h-full object-cover cursor-zoom-in hover:scale-105 transition-transform duration-700"
                  onClick={() => onImageClick(formData.photos[0])}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2">
                  <ImageIcon size={40} strokeWidth={1.5} />
                  <span className="text-[12px] font-medium">No images uploaded</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {formData.photos?.map((photo, idx) => (
                <div 
                  key={idx} 
                  className={`relative group aspect-square rounded-xl overflow-hidden border transition-all duration-300 ${idx === 0 ? 'border-teal-500 ring-2 ring-teal-500/20' : 'border-slate-200'}`}
                >
                  <img 
                    src={typeof photo === 'string' ? photo : URL.createObjectURL(photo)} 
                    alt={`Thumb ${idx + 1}`} 
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity" 
                    onClick={() => onImageClick(photo)}
                  />
                  {!isView && (
                    <button 
                      type="button"
                      onClick={(e) => { e.preventDefault(); removePhoto(idx); }}
                      className="absolute top-1 right-1 w-5 h-5 bg-white/90 backdrop-blur shadow rounded-full flex items-center justify-center text-rose-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
                    >
                      <X size={10} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {!isView && (
            <p className="text-[10px] text-slate-400 font-medium text-center italic">
              * Supports JPG, PNG. Max 8 photos. First image is primary.
            </p>
          )}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <Input label="Upashray Name" placeholder="Enter Name" value={formData.name} onChange={e => set('name', e.target.value)} required disabled={isView} />
        
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-slate-600">Allocation Type *</label>
          <CustomDropdown
            value={formData.allocationType}
            onChange={v => set('allocationType', v)}
            items={ALLOCATION_TYPES}
            placeholder="Select Type"
            disabled={isView}
          />
        </div>

        <Input label="Pravachan Hall Capacity" type="number" placeholder="Count" value={formData.hallCapacity} onChange={e => set('hallCapacity', e.target.value)} required disabled={isView} />
        <Input label="Number of Rooms" type="number" placeholder="Count" value={formData.numberOfRooms} onChange={e => set('numberOfRooms', e.target.value)} required disabled={isView} />

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-slate-600">Status *</label>
          <CustomDropdown
            value={formData.status}
            onChange={v => set('status', v)}
            items={STATUS_OPTIONS.map(opt => opt.value)}
            placeholder="Select Status"
            disabled={isView}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-[13px] font-bold text-slate-600 mb-3">Facilities Available</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'gyanBhandar', label: 'Library (Gyan Bhandar)' },
              { id: 'separateWashrooms', label: 'Separate Washrooms for Ascetics' },
              { id: 'woodenPlanks', label: 'Wooden Planks (Paat/Bajoth) Available' },
              { id: 'audioSystem', label: 'Audio/Mic System (for Pravachan)' }
            ].map(item => (
              <label key={item.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${formData[item.id] ? 'bg-teal-50 border-teal-200' : 'bg-white border-slate-200 hover:border-teal-200'}`}>
                <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${formData[item.id] ? 'bg-teal-600 text-white' : 'bg-slate-100 text-transparent border border-slate-300'}`}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <span className="text-[13px] font-medium text-slate-700">{item.label}</span>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={formData[item.id]} 
                  disabled={isView}
                  onChange={(e) => set(item.id, e.target.checked)}
                />
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
      
      <Input label="Trustee / President Name" placeholder="Trustee Name" value={formData.trusteeName} onChange={e => set('trusteeName', e.target.value)} required disabled={isView} icon={Users} />
      <Input label="Trustee Phone" placeholder="Trustee Phone" type="tel" value={formData.trusteePhone} onChange={e => set('trusteePhone', e.target.value)} required disabled={isView} icon={Phone} />

      <Input label="Caretaker (Manager) Name" placeholder="Caretaker Name" value={formData.caretakerName} onChange={e => set('caretakerName', e.target.value)} required disabled={isView} icon={Users} />
      <Input label="Caretaker Phone" placeholder="Caretaker Phone" type="tel" value={formData.caretakerPhone} onChange={e => set('caretakerPhone', e.target.value)} required disabled={isView} icon={Phone} />
      
      <Input label="Email Address" placeholder="Email" type="email" value={formData.email} onChange={e => set('email', e.target.value)} disabled={isView} icon={Mail} />
    </div>
  );
}
