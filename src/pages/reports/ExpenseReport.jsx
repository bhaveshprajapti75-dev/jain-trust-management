import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import PageHeader from '../../components/common/PageHeader'

const DATA = [{ month: 'Jan', expense: 68000 }, { month: 'Feb', expense: 95000 }, { month: 'Mar', expense: 72000 }]

export default function ExpenseReport() {
  return (
    <div className="space-y-5">
      <PageHeader title="Expense Reports" subtitle="Analyze expense patterns" breadcrumbs={[{ label: 'Home' }, { label: 'Reports' }, { label: 'Expenses' }]} />
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-5">Monthly Expenses</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `₹${v / 1000}K`} />
            <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`, 'Expense']} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
            <Bar dataKey="expense" fill="#e11d48" radius={[6, 6, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}