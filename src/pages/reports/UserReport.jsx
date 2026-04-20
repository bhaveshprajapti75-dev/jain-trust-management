import React, { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import SearchBar from '../../components/common/SearchBar';

export default function UserReport() {
  const [search, setSearch] = useState('');

  
  const mockReportData = [
    { id: 1, name: 'Moxa Shah', role: 'Super Admin', loginCount: 45, lastLogin: '2026-04-06' },
    { id: 2, name: 'Rajesh Mehta', role: 'Sangh Head', loginCount: 12, lastLogin: '2026-04-05' },
    { id: 3, name: 'Suresh Jhaveri', role: 'Volunteer', loginCount: 5, lastLogin: '2026-04-01' }
  ];

  const filteredData = mockReportData.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.role.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { key: 'id', label: 'Sr. No.' },
    { key: 'name', label: 'User Name', sortable: true },
    { key: 'role', label: 'Assigned Role' },
    { key: 'loginCount', label: 'Total Logins' },
    { key: 'lastLogin', label: 'Last Login Date' }
  ];

  return (
    <div className="p-6 space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader 
          title="User Analytics Report" 
          subtitle="View user engagement and system activity reports." 
        />
        <button className="px-5 py-2.5 bg-teal-600 text-white text-[13px] font-bold rounded-xl hover:bg-teal-700 transition-all shadow-sm">
          Export PDF
        </button>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="p-4 text-center">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Total Active Users</p>
          <h2 className="text-[24px] font-bold text-teal-600 mt-1">25</h2>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-[11px] font-bold text-slate-400 uppercase">New Users (This Month)</p>
          <h2 className="text-[24px] font-bold text-sky-600 mt-1">5</h2>
        </Card>
        <div className="flex items-center">
          <div className="w-full">
            <SearchBar 
              placeholder="Search by user or role..." 
              value={search}
              onChange={setSearch}
            />
          </div>
        </div>
      </div>

      
      <Card className="p-4">
        <div className="mb-4">
          <h3 className="text-[14px] font-bold text-slate-800">User Activity Log</h3>
        </div>
        <Table 
          columns={columns} 
          data={filteredData} 
          loading={false} 
        />
      </Card>
    </div>
  );
}
