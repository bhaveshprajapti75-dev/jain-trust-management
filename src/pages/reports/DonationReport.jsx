import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'

const DATA = [{ month: 'Jan', amount: 86000 }, { month: 'Feb', amount: 183000 }, { month: 'Mar', amount: 83000 }]

export default function DonationReport() {
  return (
    <div className="space-y-5">
      <PageHeader title="Donation Reports" subtitle="Analyze donation trends" breadcrumbs={[{ label: 'Home' }, { label: 'Reports' }, { label: 'Donations' }]} action={<Button variant="secondary" size="sm">Export PDF</Button>} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total', value: '₹3.52L', cls: 'text-slate-800' },
          { label: 'Average', value: '₹1.17L', cls: 'text-slate-800' },
          { label: 'Top Month', value: 'Feb (₹1.83L)', cls: 'text-teal-600' }
        ].map((t) => (
          <div key={t.label} className="bg-white rounded-2xl border border-slate-200/80 p-5">
            <p className="text-[11px] text-slate-400 font-medium mb-1">{t.label}</p>
            <p className={`text-lg font-bold ${t.cls}`}>{t.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-5">Monthly Collection</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `₹${v / 1000}K`} />
            <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`, 'Amount']} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
            <Bar dataKey="amount" fill="#0d9488" radius={[6, 6, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}