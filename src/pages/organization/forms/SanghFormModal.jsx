import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Eye, Upload, FileText, User, Phone, Mail, MapPin, Users, Building2 } from 'lucide-react';
import Input from '../../../components/common/Input';
import StatusToggle from '../../../components/common/StatusToggle';
import { getOrgData } from '../orgData';

export default function SanghFormModal({ isOpen, onClose, initialData, onSave }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [trusts, setTrusts] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [editingMember, setEditingMember] = useState(null);

  useEffect(() => {
    const data = getOrgData();
    setTrusts(data.trusts);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    mainPersonName: '',
    mobile: '',
    email: '',
    address: '',
    area: '',
    city: '',
    state: '',
    totalFamilies: 0,
    totalMembers: 0,
    about: '',
    committee: [],
    document: null,
    linkedTrustId: null,
    status: true
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        mainPersonName: initialData.mainPersonName || '',
        mobile: initialData.mobile || '',
        email: initialData.email || '',
        address: initialData.address || '',
        area: initialData.area || '',
        city: initialData.city || '',
        state: initialData.state || '',
        totalFamilies: initialData.totalFamilies || 0,
        totalMembers: initialData.totalMembers || 0,
        about: initialData.about || '',
        committee: initialData.committee || [],
        document: initialData.document || null,
        linkedTrustId: initialData.linkedTrustId || null,
        status: initialData.status !== undefined ? initialData.status : true
      });
      setUploadedFile(initialData.document);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleCommitteeAdd = () => {
    setEditingMember({ id: Date.now(), name: '', designation: '', mobile: '', email: '', area: '', city: '', status: true });
  };

  const handleCommitteeSave = () => {
    if (editingMember) {
      if (formData.committee.find(m => m.id === editingMember.id)) {
        setFormData(prev => ({
          ...prev,
          committee: prev.committee.map(m => m.id === editingMember.id ? editingMember : m)
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          committee: [...prev.committee, editingMember]
        }));
      }
    }
    setEditingMember(null);
  };

  const handleCommitteeEdit = (member) => {
    setEditingMember({ ...member });
  };

  const handleCommitteeRemove = (id) => {
    setFormData(prev => ({
      ...prev,
      committee: prev.committee.filter(m => m.id !== id)
    }));
  };

  const handleCommitteeChange = (field, value) => {
    setEditingMember(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileObj = { name: file.name, size: file.size, uploadDate: new Date().toISOString(), file: file };
      setUploadedFile(fileObj);
      setFormData(prev => ({ ...prev, document: fileObj }));
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setFormData(prev => ({ ...prev, document: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const TabButton = ({ tab, label }) => (
    <button onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === tab ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>
      {label}
    </button>
  );

  const designationOptions = ['President', 'Secretary', 'Committee Member', 'Manager', 'Teacher', 'Poojari'];
  const linkedTrust = trusts.find(t => t.id === formData.linkedTrustId);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
          <h3 className="text-lg font-bold text-slate-800">{initialData ? 'Edit Sangh' : 'Create New Sangh'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
        </div>

        <div className="px-6 pt-4 border-b border-slate-100 flex gap-2">
          <TabButton tab="overview" label="Overview" />
          <TabButton tab="committee" label="Committee Members" />
          <TabButton tab="document" label="Document" />
          <TabButton tab="linked" label="Linked Trust" />
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Sangh Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Enter sangh name" />
                <Input label="Main Person Name" required value={formData.mainPersonName} onChange={e => setFormData({...formData, mainPersonName: e.target.value})} placeholder="Full name" />
                <Input label="Mobile Number" required value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} placeholder="+91..." />
                <Input label="Email Address" required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="email@example.com" />
                <div className="col-span-2">
                  <Input label="Address" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Street address" />
                </div>
                <Input label="Area" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} placeholder="Locality/Area" />
                <Input label="City" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} placeholder="City name" />
                <Input label="State" required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} placeholder="State name" />
                <Input label="Total Families" type="number" value={formData.totalFamilies} onChange={e => setFormData({...formData, totalFamilies: parseInt(e.target.value) || 0})} placeholder="0" />
                <Input label="Total Members" type="number" value={formData.totalMembers} onChange={e => setFormData({...formData, totalMembers: parseInt(e.target.value) || 0})} placeholder="0" />
                <div className="col-span-2">
                  <Input label="About Sangh" value={formData.about} onChange={e => setFormData({...formData, about: e.target.value})} placeholder="Brief description" textarea rows={3} />
                </div>
                <div className="col-span-2">
                  <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Status</label>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-sm font-medium text-slate-700">{formData.status ? 'Active' : 'Inactive'}</span>
                    <StatusToggle status={formData.status} onToggle={() => setFormData({...formData, status: !formData.status})} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Committee Members Tab */}
          {activeTab === 'committee' && (
            <div className="space-y-4">
              {/* Committee Member List */}
              {formData.committee.map((member) => (
                <div key={member.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                          <User size={18} className="text-emerald-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800">{member.name}</h4>
                          <p className="text-xs text-emerald-600 font-medium">{member.designation}</p>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Phone size={11} /> {member.mobile}</span>
                        <span className="flex items-center gap-1"><Mail size={11} /> {member.email}</span>
                        <span className="flex items-center gap-1"><MapPin size={11} /> {member.area}, {member.city}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${member.status ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                        {member.status ? 'Active' : 'Inactive'}
                      </span>
                      <button type="button" onClick={() => handleCommitteeEdit(member)} className="p-1 text-slate-400 hover:text-emerald-600 rounded-lg">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button type="button" onClick={() => handleCommitteeRemove(member.id)} className="p-1 text-slate-400 hover:text-rose-500 rounded-lg">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add/Edit Committee Member Form */}
              {editingMember && (
                <div className="p-4 bg-white rounded-xl border-2 border-emerald-200">
                  <h4 className="font-bold text-slate-700 mb-3">{formData.committee.find(m => m.id === editingMember.id) ? 'Edit Member' : 'Add New Member'}</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Full Name" value={editingMember.name} onChange={e => handleCommitteeChange('name', e.target.value)} placeholder="Member name" />
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-500">Designation</label>
                      <select value={editingMember.designation} onChange={e => handleCommitteeChange('designation', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-emerald-500">
                        <option value="">Select Designation</option>
                        {designationOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                    <Input label="Mobile Number" value={editingMember.mobile} onChange={e => handleCommitteeChange('mobile', e.target.value)} placeholder="+91..." />
                    <Input label="Email Address" type="email" value={editingMember.email} onChange={e => handleCommitteeChange('email', e.target.value)} placeholder="Email" />
                    <Input label="Area" value={editingMember.area} onChange={e => handleCommitteeChange('area', e.target.value)} placeholder="Area/Locality" />
                    <Input label="City" value={editingMember.city} onChange={e => handleCommitteeChange('city', e.target.value)} placeholder="City" />
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-slate-500">Status</label>
                      <StatusToggle status={editingMember.status} onToggle={() => handleCommitteeChange('status', !editingMember.status)} />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button type="button" onClick={handleCommitteeSave} className="px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600">Save Member</button>
                    <button type="button" onClick={() => setEditingMember(null)} className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50">Cancel</button>
                  </div>
                </div>
              )}

              {!editingMember && (
                <button type="button" onClick={handleCommitteeAdd} className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                  <Plus size={16} /> Add Committee Member
                </button>
              )}
            </div>
          )}

          {/* Document Tab */}
          {activeTab === 'document' && (
            <div className="space-y-4">
              <Input label="Document Title" placeholder="e.g., Sangh Registration Certificate" />
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-emerald-400 transition-colors">
                <input type="file" id="file-upload" className="hidden" onChange={handleFileUpload} />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload size={32} className="text-slate-400" />
                  <span className="text-sm text-slate-500">Click to upload or drag and drop</span>
                  <span className="text-xs text-slate-400">PDF, DOC, JPG, PNG (Max 5MB)</span>
                </label>
              </div>
              {uploadedFile && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-emerald-600" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">{uploadedFile.name}</p>
                      <p className="text-xs text-slate-400">Uploaded: {new Date(uploadedFile.uploadDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg"><Eye size={16} /></button>
                    <button type="button" onClick={handleRemoveFile} className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Linked Trust Tab */}
          {activeTab === 'linked' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[13px] font-bold text-slate-700">Linked Trust</label>
                <select 
                  value={formData.linkedTrustId || ''} 
                  onChange={e => setFormData({...formData, linkedTrustId: e.target.value ? Number(e.target.value) : null})} 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                >
                  <option value="">Select Trust</option>
                  {trusts.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              {linkedTrust && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-800">{linkedTrust.name}</h4>
                      <p className="text-xs text-slate-500 mt-1">{linkedTrust.mainContactPerson} • {linkedTrust.mobile}</p>
                      <p className="text-xs text-slate-400 mt-1">{linkedTrust.area}, {linkedTrust.city}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${linkedTrust.status ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                      {linkedTrust.status ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
            <button type="button" onClick={onClose} className="px-5 py-2 text-[13px] font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all">Cancel</button>
            <button type="submit" className="px-5 py-2 text-[13px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-100 transition-all">
              {initialData ? 'Update Sangh' : 'Create Sangh'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}