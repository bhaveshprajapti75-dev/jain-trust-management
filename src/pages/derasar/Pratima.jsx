import { Plus } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Table from '../../components/ui/Table'

const DATA = [{ id: 1, name: 'Shree Chandraprabhu Bhagwan', derasar: 'Chandraprabhu Derasar', type: 'Mulnayak', height: '3.5 feet', material: 'Panchdhatu' }]
const columns = [
  { key: 'name', label: 'Pratima Name', render: (v) => <span className="font-medium text-rose-600">{v}</span> },
  { key: 'derasar', label: 'Derasar' },
  { key: 'type', label: 'Type', render: (v) => <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${v === 'Mulnayak' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>{v}</span> },
  { key: 'height', label: 'Height' },
  { key: 'material', label: 'Material' }
]

export default function Pratima() {
  return (
    <div className="space-y-5">
      <PageHeader title="Pratima Management" subtitle="Murti details & history" breadcrumbs={[{ label: 'Home' }, { label: 'Derasar' }, { label: 'Pratima' }]} action={<Button size="sm" icon={Plus}>Add Pratima</Button>} />
      <Table columns={columns} data={DATA} emptyMessage="No pratima records" />
    </div>
  )
}