import { Gem, MapPin, Users, CalendarDays } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import Button from '../../components/common/Button'
import StatusBadge from '../../components/common/StatusBadge'
import CommonPageLayout from '../../components/common/CommonPageLayout'
import Table from '../../components/common/Table'
import { Pencil } from 'lucide-react'

const DERASARS = [
  { id: 1, name: 'Shree Chandraprabhu Derasar', location: 'Navrangpura, Ahmedabad', pratimas: 12, poojaris: 3, status: 'Active', established: '1960' },
  { id: 2, name: 'Shree Mahaveer Derasar', location: 'Adajan, Surat', pratimas: 8, poojaris: 2, status: 'Active', established: '1975' }
]

export default function DerasarList() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <CommonPageLayout
      title="Derasar Management"
      subtitle="Manage Derasar profiles & operations"
      tabs={[
        { id: '/institutions/derasar', label: 'Derasar' },
        { id: '/institutions/pathshala', label: 'Pathshala' },
        { id: '/institutions/aayambil', label: 'Aayambil Shala' },
        { id: '/institutions/upasray', label: 'Upasray' },
      ]}
      activeTab={location.pathname}
      onTabChange={(tabId) => navigate(tabId)}
      action={<Button size="sm" icon={Gem}>Add Derasar</Button>}
      contentClassName="p-0 border-none bg-transparent shadow-none"
    >
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm mt-1 mx-1 mb-1">
        <Table
          columns={[
            {
              key: 'srNo',
              label: 'Sr. No.',
              align: 'center',
              render: (_, __, i) => <span className="text-[13.5px] font-medium text-slate-500">{i + 1}</span>
            },
            {
              key: 'name',
              label: 'Institution Name',
              render: (_, d) => (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                    <Gem className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-[13.5px] font-bold text-slate-800 group-hover:text-emerald-700 transition-colors uppercase decoration-emerald-200 underline-offset-4 hover:decoration-emerald-500 hover:underline">{d.name}</span>
                </div>
              )
            },
            {
              key: 'location',
              label: 'Location',
              render: (_, d) => <span className="text-[12.5px] font-medium text-slate-600">{d.location}</span>
            },
            {
              key: 'details',
              label: 'Details',
              render: (_, d) => (
                <div className="flex flex-col gap-1 flex-wrap text-[11px] font-medium text-slate-500">
                  <span className="px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200">Pratimas: <strong>{d.pratimas}</strong></span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200">Poojaris: <strong>{d.poojaris}</strong></span>
                </div>
              )
            },
            {
              key: 'established',
              label: 'Established',
              render: (_, d) => <span className="text-[12.5px] font-medium text-slate-600">{d.established}</span>
            },
            {
              key: 'status',
              label: 'Status',
              align: 'center',
              render: (_, d) => (
                <div className="flex justify-center">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm ${d.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-50 text-slate-600 border border-slate-200'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${d.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                    {d.status}
                  </span>
                </div>
              )
            },
            {
              key: 'actions',
              label: 'Actions',
              align: 'center',
              render: () => (
                <div className="flex items-center justify-center gap-2">
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 border border-transparent hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50/50 transition-all duration-200"
                  >
                    <Pencil size={15} strokeWidth={2} />
                  </button>
                </div>
              )
            }
          ]}
          data={DERASARS}
          skipCard={true}
        />
      </div>
    </CommonPageLayout>
  )
}