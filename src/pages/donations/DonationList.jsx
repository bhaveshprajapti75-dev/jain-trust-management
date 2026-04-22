import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Plus, Download, Pencil, Trash2, FileText, IndianRupee } from 'lucide-react'
import CommonPageLayout from '../../components/ui/CommonPageLayout'
import Button from '../../components/ui/Button'
import StatusBadge from '../../components/ui/StatusBadge'
import Table from '../../components/ui/Table'

const DONATIONS = [
  { id: 1, donorName: 'Rajesh Shah', type: 'Devdravya', amount: 51000, date: '2025-01-15', mode: 'Cheque', status: 'Verified', receiptNo: 'RCP-001' },
  { id: 2, donorName: 'Meena Patel', type: 'Jivdaya', amount: 25000, date: '2025-01-18', mode: 'Online', status: 'Pending', receiptNo: 'RCP-002' },
  { id: 3, donorName: 'Suresh Jain', type: 'Pathshala', amount: 10000, date: '2025-01-20', mode: 'Cash', status: 'Verified', receiptNo: 'RCP-003' }
]

export default function DonationList() {
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState('')
  const filtered = DONATIONS.filter((d) => d.donorName.toLowerCase().includes(search.toLowerCase()))
  
  const columns = [
    { key: 'receiptNo', label: 'Receipt', render: (v) => <span className="text-[12.5px] text-[#1A1A1A]">{v}</span> },
    { key: 'donorName', label: 'Donor', render: (v) => <span className="text-[12.5px] text-[#1A1A1A]">{v}</span> },
    { key: 'type', label: 'Type', render: (v) => <span className="text-[12.5px] text-[#1A1A1A]">{v}</span> },
    { key: 'amount', label: 'Amount', render: (v) => <span className="text-[12.5px] text-[#1A1A1A]">₹{v.toLocaleString()}</span> },
    { key: 'date', label: 'Date', render: (v) => <span className="text-[12.5px] text-[#1A1A1A]">{v}</span> },
    { key: 'mode', label: 'Mode', render: (v) => <span className="text-[12.5px] text-[#1A1A1A]">{v}</span> },
    { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
    { key: 'actions', label: '', sortable: false, render: (_, row) => (
      <div className="flex items-center justify-end gap-1">
        <button onClick={(e) => { e.stopPropagation(); navigate(`/donations/receipt/${row.id}`) }} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-teal-600 transition-colors" title="View Receipt"><FileText className="w-4 h-4" /></button>
        <button onClick={(e) => { e.stopPropagation(); navigate(`/donations/edit/${row.id}`) }} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-sky-600 transition-colors" title="Edit"><Pencil className="w-4 h-4" /></button>
        <button className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
      </div>
    )}
  ]

  return (
    <CommonPageLayout
      title="Donation Management"
      subtitle="Track donations & generate receipts"
      tabs={[
        { id: '/finance/donations', label: 'Donations' },
        { id: '/finance/expenses', label: 'Expenses & Bills' },
        { id: '/finance/receipts', label: 'Donation Receipts' },
      ]}
      activeTab={location.pathname}
      onTabChange={(tabId) => navigate(tabId)}
      breadcrumbs={[{ label: 'Home' }, { label: 'Finance' }]}
      action={
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" icon={Download}>Export</Button>
          <Button size="sm" icon={Plus} onClick={() => navigate('/donations/add')} className="bg-gradient-to-r from-teal-600 to-emerald-600 border-0 text-white">Add Donation</Button>
        </div>
      }
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search by donor..."
    >
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden mt-4">
        <Table columns={columns} data={filtered} emptyMessage="No donations found" onRowClick={(row) => navigate(`/donations/receipt/${row.id}`)} skipCard={true} />
      </div>
    </CommonPageLayout>
  )
}