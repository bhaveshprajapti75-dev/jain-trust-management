import React, { useState } from 'react';
import { X, Users, User, Phone, Mail, MapPin, Building2, Calendar, FileText, Activity } from 'lucide-react';
import StatusToggle from '../../../components/common/StatusToggle';
import { getTrustName } from '../orgData';

export default function SanghDetailsModal({ isOpen, onClose, sangh, allData, onStatusToggle }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !sangh) return null;

  const linkedTrusts = allData.links.filter(l => l.sanghId === sangh.id && l.status);
  const activities = sangh.activity || [];

  const DetailItem = ({ icon: Icon, label, value }) => (
    <div className="p-3 bg-slate-50 rounded-xl">
      <p className="text-[10px] font-medium text-slate-400 uppercase mb-1 flex items-center gap-1">
        <Icon size={12} /> {label}
      </p>
      <p className="text-[13px] font-semibold text-slate-700">{value || '---'}</p>
    </div>
  );

  const TabButton = ({ tab, label }) => (
    <button onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === tab ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>
      {label}
    </button>
  );

  const linkedTrust = linkedTrusts.length > 0 ? allData.trusts.find(t => t.id === linkedTrusts[0].trustId) : null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center">
              <Users size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Sangh Details</h3>
              <p className="text-xs text-slate-400">{sangh.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <div className="px-6 pt-4 border-b border-slate-100 flex gap-2">
          <TabButton tab="overview" label="Overview" />
          <TabButton tab="committee" label="Committee Members" />
          <TabButton tab="linked" label="Linked Trust" />
          <TabButton tab="activity" label="Activity" />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Status</p>
                  <p className={`text-sm font-semibold ${sangh.status ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {sangh.status ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <StatusToggle status={sangh.status} onToggle={() => onStatusToggle(sangh.id, 'sangh', sangh.status)} />
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><Users size={14} className="text-emerald-600" /> Basic Information</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <DetailItem icon={Users} label="Sangh Name" value={sangh.name} />
                  <DetailItem icon={User} label="Main Person Name" value={sangh.mainPersonName} />
                  <DetailItem icon={Phone} label="Mobile" value={sangh.mobile} />
                  <DetailItem icon={Mail} label="Email" value={sangh.email} />
                  <div className="col-span-2">
                    <DetailItem icon={MapPin} label="Address" value={`${sangh.address}, ${sangh.area}, ${sangh.city}, ${sangh.state}`} />
                  </div>
                  <DetailItem icon={Users} label="Total Families" value={sangh.totalFamilies} />
                  <DetailItem icon={Users} label="Total Members" value={sangh.totalMembers} />
                  <div className="col-span-2">
                    <DetailItem icon={FileText} label="About Sangh" value={sangh.about} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'committee' && (
            <div className="space-y-4">
              {sangh.committee && sangh.committee.length > 0 ? (
                sangh.committee.map((member) => (
                  <div key={member.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-800">{member.name}</h4>
                        <p className="text-xs text-emerald-600 font-medium">{member.designation}</p>
                        <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><Phone size={11} /> {member.mobile}</span>
                          <span className="flex items-center gap-1"><Mail size={11} /> {member.email}</span>
                          <span className="flex items-center gap-1"><MapPin size={11} /> {member.area}, {member.city}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${member.status ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                        {member.status ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400">No committee members added</div>
              )}
            </div>
          )}

          {activeTab === 'linked' && (
            <div className="space-y-3">
              {linkedTrust ? (
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
              ) : <div className="text-center py-8 text-slate-400">No linked trust found</div>}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-3">
              {activities.length > 0 ? activities.map(activity => (
                <div key={activity.id} className="p-3 bg-slate-50 rounded-xl border-l-4 border-emerald-500">
                  <p className="text-sm font-medium text-slate-700">{activity.action}</p>
                  <p className="text-xs text-slate-400 mt-1">{new Date(activity.timestamp).toLocaleString()} by {activity.user || 'Admin'}</p>
                </div>
              )) : <div className="text-center py-8 text-slate-400">No activity recorded</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}