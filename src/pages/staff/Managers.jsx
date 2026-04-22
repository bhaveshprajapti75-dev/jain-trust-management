import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CommonPageLayout from '../../components/ui/CommonPageLayout';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import StatusBadge from '../../components/ui/StatusBadge';
import { Pencil, Trash2, Eye, Plus } from 'lucide-react';

export default function Managers() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  
  const mockManagers = [
    { id: 'MGR001', name: 'Amit Shah', department: 'Operations', phone: '+91 9876543210', status: 'Active' },
    { id: 'MGR002', name: 'Nirav Mehta', department: 'Accounts', phone: '+91 9898989898', status: 'Active' },
    { id: 'MGR003', name: 'Sanjay Jhaveri', department: 'Events', phone: '+91 9123456789', status: 'Inactive' }
  ];

  const filteredManagers = mockManagers.filter(mgr =>
    mgr.name.toLowerCase().includes(search.toLowerCase()) ||
    mgr.department.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'department', label: 'Department' },
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
    <CommonPageLayout
      title="Staff Members"
      subtitle="View and manage organization staff members."
      tabs={[
        { id: '/users/all', label: 'All Users' },
        { id: '/members/families', label: 'Families' },
        { id: '/members/individual', label: 'Individuals' },
        { id: '/members/committee', label: 'Committee' },
        { id: '/staff/dept', label: 'Departments' },
        { id: '/staff/members', label: 'Staff' },
      ]}
      activeTab={location.pathname}
      onTabChange={(tabId) => navigate(tabId)}
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search by name or department..."
      action={<Button icon={Plus}>Add Staff Member</Button>}
    >
      <Table 
        columns={columns} 
        data={filteredManagers} 
        loading={false} 
        skipCard={false}
      />
    </CommonPageLayout>
  );
}
