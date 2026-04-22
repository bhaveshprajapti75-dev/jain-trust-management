import { Plus } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Table from '../../components/ui/Table'

const DATA = [{ id: 1, derasar: 'Chandraprabhu Derasar', tithi: 'Kartak Sud Poonam', date: '2025-11-05', donor: 'Rajesh Shah', amount: 51000, expenses: 28000 }]
const columns = [
  { key: 'derasar', label: 'Derasar', render: (v) => <span className="font-medium text-slate-700">{v}</span> },
  { key: 'tithi', label: 'Tithi', render: (v) => <span className="text-[13px] font-medium text-rose-600">{v}</span> },
  { key: 'date', label: 'Date' },
  { key: 'donor', label: 'Donor' },
  { key: 'amount', label: 'Donation', render: (v) => <span className="font-semibold text-emerald-600">₹{v.toLocaleString()}</span> },
  { key: 'expenses', label: 'Expenses', render: (v) => <span className="font-semibold text-rose-500">₹{v.toLocaleString()}</span> }
]

export default function Salgirah() {
  return (
    <div className="space-y-5">
      <PageHeader title="Salgirah Management" subtitle="Tithi-wise anniversary celebrations" breadcrumbs={[{ label: 'Home' }, { label: 'Derasar' }, { label: 'Salgirah' }]} action={<Button size="sm" icon={Plus}>Add Salgirah</Button>} />
      <Table columns={columns} data={DATA} emptyMessage="No salgirah records" />
    </div>
  )
}