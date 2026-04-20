import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Users, HandHeart, Gem } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import StatCard from '../../components/ui/StatCard'

const GROWTH = [
  { year: '2021', count: 4000 }, { year: '2022', count: 4200 },
  { year: '2023', count: 4500 }, { year: '2024', count: 4650 }, { year: '2025', count: 4850 }
]

export default function Analytics() {
  return (
    <div className="space-y-5">
      <PageHeader title="Analytics" subtitle="System-wide statistics & insights" breadcrumbs={[{ label: 'Home' }, { label: 'Reports' }, { label: 'Analytics' }]} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Families" value="1,240" icon={Users} color="emerald" />
        <StatCard title="Total Donors" value="892" icon={HandHeart} color="teal" />
        <StatCard title="Active Derasars" value="3" icon={Gem} color="rose" />
      </div>
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-5">Member Growth</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={GROWTH}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }} />
            <Line type="monotone" dataKey="count" stroke="#059669" strokeWidth={2} dot={{ fill: '#059669', r: 3.5, strokeWidth: 0 }} activeDot={{ r: 5, fill: '#059669', stroke: '#fff', strokeWidth: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}