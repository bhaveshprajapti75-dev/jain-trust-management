import React, { useState } from 'react';
import { Upload, FileText, Trash2, X } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

const DOC_TYPES = ['Aadhaar Card', 'PAN Card', 'Photo', 'ID Card'];

export default function UserDocuments({ documents = [], onUpload, onDelete }) {
  const [showUpload, setShowUpload] = useState(false);
  const [uploadForm, setUploadForm] = useState({ type: '', notes: '' });

  const handleUpload = () => {
    if (!uploadForm.type) return;
    onUpload({ ...uploadForm, id: Date.now(), uploadDate: '2026-04-06', status: 'Pending' });
    setUploadForm({ type: '', notes: '' });
    setShowUpload(false);
  };

  const inputCls = 'w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-medium';

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-[14px] font-bold text-slate-800">Uploaded Documents</h3>
        <button 
          onClick={() => setShowUpload(true)} 
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-[12px] font-bold rounded-xl hover:bg-teal-700 transition-all"
        >
          <Upload className="w-4 h-4" strokeWidth={2.5} /> Upload New
        </button>
      </div>

      {showUpload && (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200" style={{ animation: 'slideDown 0.2s ease-out' }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-bold text-slate-700">Add Document</span>
            <button onClick={() => setShowUpload(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <select 
              value={uploadForm.type} 
              onChange={e => setUploadForm({ ...uploadForm, type: e.target.value })} 
              className={inputCls}
            >
              <option value="">Select Document Type</option>
              {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <input 
              type="text" 
              placeholder="Enter notes or description" 
              value={uploadForm.notes} 
              onChange={e => setUploadForm({ ...uploadForm, notes: e.target.value })} 
              className={inputCls} 
            />
          </div>
          <div className="flex justify-end">
            <button 
              onClick={handleUpload} 
              className="px-4 py-2 bg-teal-600 text-white text-[12px] font-bold rounded-lg hover:bg-teal-700 transition-all"
            >
              Upload
            </button>
          </div>
        </div>
      )}

      {documents.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl">
          <p className="text-[12px] text-slate-400 font-medium">No documents uploaded yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {documents.map((doc) => (
            <div key={doc.id} className="border border-slate-100 rounded-xl p-3 flex items-center justify-between bg-white hover:border-slate-200 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h4 className="text-[12px] font-bold text-slate-800">{doc.type}</h4>
                  <p className="text-[10px] text-slate-400 font-medium">Date: {doc.uploadDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={doc.status} />
                <button 
                  onClick={() => onDelete(doc.id)} 
                  className="w-7 h-7 rounded-md hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center text-slate-400 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}