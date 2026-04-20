import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Gem, Plus, Eye, Pencil, Trash2, MapPin, Users, CalendarDays,
  Search, Phone, Mail, Clock, Building2, ChevronRight, Image as ImageIcon,
  ArrowLeft, X, Check, Camera
} from 'lucide-react';
import CommonPageLayout from '../../../components/ui/CommonPageLayout';
import Button from '../../../components/ui/Button';
import Table from '../../../components/ui/Table';
import StatusToggle from '../../../components/ui/StatusToggle';
import { useToast } from '../../../components/ui/Toast';
import Modal from '../../../components/ui/Modal';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import { derasarService } from '../../../services/derasarService';
import FilterButton from '../../../components/ui/FilterButton';
import Input from '../../../components/ui/Input';
import Pagination from '../../../components/ui/Pagination';
import CustomDropdown from '../../../components/ui/CustomDropdown';
import TimePicker from '../../../components/ui/TimePicker';

// ── Tab config ──────────────────────────────────────────────────────────────
const TABS = ['Derasar Details', 'Location', 'Contact & Management'];

// ── Dropdown Options ────────────────────────────────────────────────────────
const DERASAR_TYPES = ['Shwetambar', 'Digambar', 'Sthanakvasi', 'Terapanthi'];
const PRATIMA_TYPES = [
  { label: 'Marble (આરસ)', value: 'Marble (આરસ)' },
  { label: 'Panchdhatu', value: 'Panchdhatu' },
  { label: 'Ashtadhatu', value: 'Ashtadhatu' },
  { label: 'Stone (પથ્થર)', value: 'Stone (પથ્થર)' }
];
const STATUS_OPTIONS = [
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' }
];
const GUJARAT_DISTRICTS = ['Ahmedabad','Surat','Vadodara','Rajkot','Bhavnagar','Junagadh','Patan','Mehsana','Gandhinagar','Anand','Kheda','Nadiad','Surendranagar','Amreli','Porbandar','Jamnagar','Kutch','Banaskantha','Sabarkantha','Other'];

// ── Empty form ───────────────────────────────────────────────────────────────
const emptyForm = {
  name: '',
  type: '',
  moolNayak: '',
  pratimaType: '',
  established: '',
  pratimas: '',
  poojaris: '',
  morningFrom: '06:00',
  morningTo: '12:00',
  eveningFrom: '16:00',
  eveningTo: '20:00',
  dharamshala: false,
  bhojanshala: false,
  parking: false,
  upashray: false,
  disabled: false,
  photos: [],
  status: 'Active',
  registrationNumber: '',
  address: '',
  landmark: '',
  city: '',
  taluka: '',
  district: '',
  pincode: '',
  mapLink: '',
  trusteeName: '',
  trusteePhone: '',
  pujariName: '',
  pujariPhone: '',
  trustName: '',
  email: '',
};

export default function Derasar() {
  const [derasars, setDerasars] = useState([]);
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
      const response = await derasarService.getDerasars();
      setDerasars(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error fetching derasars:', error);
      showToast('Failed to load derasar data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredData = useMemo(() => derasars.filter(item => {
    const q = search.toLowerCase();
    return (!search || item.name?.toLowerCase().includes(q) || item.city?.toLowerCase().includes(q) || item.moolNayak?.toLowerCase().includes(q)) && 
           (filters.status === 'All' || item.status === filters.status) &&
           (filters.district === 'All' || item.district === filters.district);
  }), [derasars, search, filters]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * recordsPerPage;
    return filteredData.slice(start, start + recordsPerPage);
  }, [filteredData, currentPage, recordsPerPage]);

  const stats = useMemo(() => [
    { title: 'TOTAL DERASAR', value: derasars.length, icon: Gem, color: 'sky' },
    { title: 'ACTIVE DERASAR', value: derasars.filter(d => d.status === 'Active').length, icon: Gem, color: 'teal' },
    { title: 'INACTIVE DERASAR', value: derasars.filter(d => d.status === 'Inactive').length, icon: Gem, color: 'rose' },
  ], [derasars]);

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
      await derasarService.updateDerasar(item.id, { ...item, status: newStatus });
      fetchData();
      showToast(`Derasar set to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('Failed to update status', 'error');
    }
  };

  const handleSave = async () => {
    try {
      if (modalMode === 'add') {
        await derasarService.createDerasar(formData);
        showToast('Derasar added successfully');
      } else {
        await derasarService.updateDerasar(currentItem.id, formData);
        showToast('Derasar updated successfully');
      }
      fetchData();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving derasar:', error);
      showToast('Action failed', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await derasarService.deleteDerasar(itemToDelete.id);
      showToast('Derasar deleted successfully', 'delete');
      fetchData();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting derasar:', error);
      showToast('Delete failed', 'error');
    }
  };

  const isView = modalMode === 'view';



  const columns = [
    { key: 'id', label: 'SR. NO', align: 'center', render: (_, __, i) => i + 1 },
    { key: 'name', label: 'DERASAR NAME', sortable: true, render: (v, r) => (
      <div className="flex flex-col">
        <span className="font-bold text-teal-600">{v}</span>
        <span className="text-xs text-slate-400">{r.type || ''}</span>
      </div>
    )},
    { key: 'moolNayak', label: 'MOOL NAYAK', render: v => <span className="text-slate-600 font-medium text-sm">{v || '—'}</span> },
    { key: 'city', label: 'VILLAGE / CITY', render: (v, r) => (
      <div className="flex flex-col">
        <span className="text-slate-600 font-medium text-sm">{v}</span>
        <span className="text-xs text-slate-400">{r.district || ''}</span>
      </div>
    )},
    { key: 'pratimas', label: 'PRATIMAS', align: 'center' },
    { key: 'poojaris', label: 'POOJARIS', align: 'center' },
    { key: 'status', label: 'STATUS', align: 'center', render: (v, r) => <StatusToggle status={v === 'Active'} onToggle={() => toggleStatus(r)} /> },
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
            {modalMode === 'add' ? 'Add New' : modalMode === 'edit' ? 'Edit' : 'View'} Derasar
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
    <CommonPageLayout title="Derasar Management" stats={stats}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        <div className="w-full sm:max-w-sm relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#10b981] transition-colors" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="w-full h-[34px] pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50/30 text-[13px] focus:ring-2 focus:ring-teal-50 focus:border-[#10b981] outline-none transition-all font-medium" />
        </div>
        <div className="flex items-center gap-2">
          <FilterButton 
            filters={filters} 
            options={[
              { key: 'status', placeholder: 'Status', items: [{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }] },
              { key: 'district', placeholder: 'City', items: GUJARAT_DISTRICTS.map(d => ({ label: d, value: d })) }
            ]} 
            onChange={(k, v) => { setFilters(p => ({ ...p, [k]: v })); setCurrentPage(1); }} 
            onClear={() => { setFilters({ status: 'All', district: 'All' }); setCurrentPage(1); }} 
            dataCount={filteredData.length} 
          />
          <Button icon={Plus} onClick={() => openModal('add')} className="shadow-lg shadow-teal-100 text-[13px] h-[34px] px-4 font-bold">Add Derasar</Button>
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

      <ConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDelete} title="Delete Derasar" message={`Delete "${itemToDelete?.name}"?`} confirmLabel="Delete" variant="danger" />

      {/* Image Preview Overlay */}
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

  // Close menu on click outside
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
            <label className="text-[13px] font-bold text-slate-700">Derasar Gallery</label>
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
                      onClick={(e) => {
                        e.preventDefault();
                        removePhoto(idx);
                      }}
                      className="absolute top-1 right-1 w-5 h-5 bg-white/90 backdrop-blur shadow rounded-full flex items-center justify-center text-rose-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
                    >
                      <X size={10} />
                    </button>
                  )}
                </div>
              ))}
              
              {/* Empty placeholder removed as requested */}
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
        <Input label="Derasar Name" placeholder="Enter Name" value={formData.name} onChange={e => set('name', e.target.value)} required disabled={isView} />
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-slate-600">Derasar Type *</label>
          <CustomDropdown
            value={formData.type}
            onChange={v => set('type', v)}
            items={DERASAR_TYPES}
            placeholder="Select Type"
            disabled={isView}
          />
        </div>
        <Input label="Mool Nayak (મૂળ નાયક)" placeholder="Enter Name" value={formData.moolNayak} onChange={e => set('moolNayak', e.target.value)} required disabled={isView} />
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-slate-600">Pratima Type</label>
          <CustomDropdown
            value={formData.pratimaType}
            onChange={v => set('pratimaType', v)}
            items={PRATIMA_TYPES}
            placeholder="Select Material"
            disabled={isView}
          />
        </div>
        <Input label="Established Year" placeholder="Enter Year" value={formData.established} onChange={e => set('established', e.target.value)} disabled={isView} />
        <Input label="No. of Pratimas" type="number" placeholder="Count" value={formData.pratimas} onChange={e => set('pratimas', e.target.value)} required disabled={isView} />
        <Input label="No. of Poojaris" type="number" placeholder="Count" value={formData.poojaris} onChange={e => set('poojaris', e.target.value)} required disabled={isView} />
        <Input label="Registration Number" placeholder="Number" value={formData.registrationNumber} onChange={e => set('registrationNumber', e.target.value)} disabled={isView} />
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
      </div>
    </div>
  );
}

function Tab2({ formData, set, isView }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      <div className="md:col-span-2"><Input label="Address" placeholder="Address" value={formData.address} onChange={e => set('address', e.target.value)} required disabled={isView} /></div>
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
      <Input label="Google Maps Link" placeholder="Link" value={formData.mapLink} onChange={e => set('mapLink', e.target.value)} disabled={isView} icon={MapPin} />
    </div>
  );
}

function Tab3({ formData, set, isView }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <Input label="Trustee Name" placeholder="Trustee Name" value={formData.trusteeName} onChange={e => set('trusteeName', e.target.value)} required disabled={isView} icon={Users} />
        <Input label="Trustee Phone" placeholder="Phone" type="tel" value={formData.trusteePhone} onChange={e => set('trusteePhone', e.target.value)} required disabled={isView} icon={Phone} />
        <Input label="Pujari Name" placeholder="Pujari Name" value={formData.pujariName} onChange={e => set('pujariName', e.target.value)} disabled={isView} icon={Users} />
        <Input label="Pujari Phone" placeholder="Phone" type="tel" value={formData.pujariPhone} onChange={e => set('pujariPhone', e.target.value)} disabled={isView} icon={Phone} />
        <Input label="Trust Name" placeholder="Trust Name" value={formData.trustName} onChange={e => set('trustName', e.target.value)} disabled={isView} icon={Building2} />
        <Input label="Email" placeholder="Email" type="email" value={formData.email} onChange={e => set('email', e.target.value)} disabled={isView} icon={Mail} />
      </div>
      <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h4 className="flex items-center gap-2 text-slate-800 font-bold text-[14px] mb-6">
          <Clock size={16} className="text-teal-600" />
          Temple Timings
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <label className="block text-[13px] font-bold text-slate-600 mb-3">Morning Session</label>
            <div className="flex items-center gap-3">
              <TimePicker 
                value={formData.morningFrom} 
                onChange={e => set('morningFrom', e.target.value)} 
                disabled={isView} 
                className="flex-1" 
              />
              <span className="text-slate-400 text-[11px] font-black uppercase tracking-widest px-1">to</span>
              <TimePicker 
                value={formData.morningTo} 
                onChange={e => set('morningTo', e.target.value)} 
                disabled={isView} 
                className="flex-1" 
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-slate-600 mb-3">Evening Session</label>
            <div className="flex items-center gap-3">
              <TimePicker 
                value={formData.eveningFrom} 
                onChange={e => set('eveningFrom', e.target.value)} 
                disabled={isView} 
                className="flex-1" 
              />
              <span className="text-slate-400 text-[11px] font-black uppercase tracking-widest px-1">to</span>
              <TimePicker 
                value={formData.eveningTo} 
                onChange={e => set('eveningTo', e.target.value)} 
                disabled={isView} 
                className="flex-1" 
              />
            </div>
          </div>
        </div>
      </div>
      <div><h4 className="text-slate-800 font-bold text-[14px] mb-4">Facilities</h4><div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {['dharamshala','bhojanshala','parking','upashray','disabled'].map(k => (
          <label key={k} className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all duration-200 select-none ${formData[k] ? 'border-teal-200 bg-teal-50 text-teal-700' : 'border-slate-200 bg-white text-slate-500 hover:border-teal-300'} ${isView ? 'pointer-events-none' : 'active:scale-95'}`}>
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${formData[k] ? 'bg-teal-600 border-teal-600' : 'border-slate-300 bg-white'}`}>
              {formData[k] && <Check size={14} className="text-white stroke-[3px]" />}
            </div>
            <input type="checkbox" checked={!!formData[k]} onChange={e => set(k, e.target.checked)} disabled={isView} className="hidden" />
            <span className="text-[13px] font-bold capitalize">{k}</span>
          </label>
        ))}
      </div></div>
    </div>
  );
}