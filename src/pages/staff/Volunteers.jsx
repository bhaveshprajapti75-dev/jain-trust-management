import React, { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Table from '../../components/ui/Table';
import SearchBar from '../../components/ui/SearchBar';
import StatusBadge from '../../components/ui/StatusBadge';
import { Pencil, Trash2, Eye } from 'lucide-react';

export default function Volunteers() {
  const [search, setSearch] = useState('');

  
  const mockVolunteers = [
    { id: 'VOL001', name: 'Mitesh Shah', event: 'Paryushan 2025', phone: '+91 9825099881', status: 'Active' },
    { id: 'VOL002', name: 'Deepak Mehta', event: 'Mahavir Jayanti', phone: '+91 9898077665', status: 'Active' },
    { id: 'VOL003', name: 'Aakash Parikh', event: 'General Seva', phone: '+91 9426055443', status: 'Inactive' }
  ];

  const filteredVolunteers = mockVolunteers.filter(vol =>
    vol.name.toLowerCase().includes(search.toLowerCase()) ||
    vol.event.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'event', label: 'Tagged Event' },
    { key: 'phone', label: 'Phone' },
    { 
      key: 'status', 
      label: 'Status', 
      render: (value) => <StatusBadge status={value} /> 
    },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <div className="flex items-center gap-1">
          <button className="w-7 h-7 rounded-md hover:bg-teal-50 hover:text-teal-600 flex items-center justify-center text-slate-400 transition-all">
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button className="w-7 h-7 rounded-md hover:bg-sky-50 hover:text-sky-600 flex items-center justify-center text-slate-400 transition-all">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button className="w-7 h-7 rounded-md hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center text-slate-400 transition-all">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader 
          title="Volunteers" 
          subtitle="View and manage event volunteers." 
        />
        <button className="px-5 py-2.5 bg-teal-600 text-white text-[13px] font-bold rounded-xl hover:bg-teal-700 transition-all shadow-sm">
          + Add Volunteer
        </button>
      </div>

      
      <div className="w-full md:w-1/3">
        <SearchBar 
          placeholder="Search by name or event..." 
          value={search}
          onChange={setSearch}
        />
      </div>

      
      <Table 
        columns={columns} 
        data={filteredVolunteers} 
        loading={false} 
      />
    </div>
  );
}
