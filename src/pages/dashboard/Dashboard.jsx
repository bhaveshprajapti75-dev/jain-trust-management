import { useEffect, useMemo, useRef, useState } from 'react'
import {
  HandHeart,
  Users,
  Landmark,
  Building2,
  TrendingUp,
  ArrowDownRight,
  Wallet,
  ArrowUpRight,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import CommonPageLayout from '../../components/ui/CommonPageLayout'

const MONTHLY_TRENDS = [
  { month: 'Jan', income: 120000, expense: 80000 },
  { month: 'Feb', income: 250000, expense: 110000 },
  { month: 'Mar', income: 180000, expense: 95000 },
  { month: 'Apr', income: 320000, expense: 140000 },
  { month: 'May', income: 210000, expense: 105000 },
  { month: 'Jun', income: 280000, expense: 130000 },
  { month: 'Jul', income: 235000, expense: 122000 },
  { month: 'Aug', income: 295000, expense: 148000 },
  { month: 'Sep', income: 260000, expense: 132000 },
  { month: 'Oct', income: 330000, expense: 162000 },
  { month: 'Nov', income: 305000, expense: 154000 },
  { month: 'Dec', income: 360000, expense: 175000 },
]

const DONATION_DISTRIBUTION = [
  { name: 'Devdravya', value: 450000 },
  { name: 'Jivdaya', value: 300000 },
  { name: 'General', value: 150000 },
  { name: 'Pathshala', value: 100000 },
]

const RECENT_ACTIVITIES = [
  { donor: 'Rajesh Shah', type: 'Devdravya', amount: 51000, date: '10 Apr', status: 'Verified', initial: 'RS' },
  { donor: 'Vimal Mehta', type: 'Jivdaya', amount: 25000, date: '09 Apr', status: 'Pending', initial: 'VM' },
  { donor: 'Amit Sanghavi', type: 'General', amount: 11000, date: '08 Apr', status: 'Verified', initial: 'AS' },
]

const CHART_COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7']

const RANGE_OPTIONS = [
  { id: '3m', label: 'Last 3 Months', months: 3 },
  { id: '6m', label: 'Last 6 Months', months: 6 },
  { id: '12m', label: 'Last 12 Months', months: 12 },
]

const formatLakhs = (value) => `₹${(value / 100000).toFixed(2)}L`

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null

  const tooltipLabel = label || payload[0]?.name || 'Details'

  return (
    <div className="bg-white p-3.5 rounded-xl shadow-lg border border-slate-200 flex flex-col gap-1.5">
      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{tooltipLabel}</p>
      <div className="space-y-1">
        {payload.map((entry, index) => {
          const seriesLabel =
            (entry.dataKey === 'income' && 'Income') ||
            (entry.dataKey === 'expense' && 'Expense') ||
            entry.name

          return (
            <p key={index} className="text-[13px] font-bold" style={{ color: entry.color }}>
              {seriesLabel}: {formatLakhs(entry.value)}
            </p>
          )
        })}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [selectedRange, setSelectedRange] = useState('6m')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const filterRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const visibleTrends = useMemo(() => {
    const activeOption = RANGE_OPTIONS.find((option) => option.id === selectedRange) || RANGE_OPTIONS[1]
    return MONTHLY_TRENDS.slice(-activeOption.months)
  }, [selectedRange])

  const selectedRangeLabel = RANGE_OPTIONS.find((option) => option.id === selectedRange)?.label || 'Last 6 Months'
  const totalInc = visibleTrends.reduce((sum, month) => sum + month.income, 0)
  const totalExp = visibleTrends.reduce((sum, month) => sum + month.expense, 0)
  const netBalance = totalInc - totalExp
  const totalDonation = DONATION_DISTRIBUTION.reduce((sum, item) => sum + item.value, 0)

  const stats = [
    { title: 'Total Sanghs', value: '124', icon: Building2, color: 'emerald' },
    { title: 'Total Members', value: '12,450', icon: Users, color: 'teal' },
    { title: 'Donations', value: '₹24.8L', icon: HandHeart, color: 'emerald' },
    { title: 'Total Trusts', value: '86', icon: Landmark, color: 'sage' },
  ]

  return (
    <CommonPageLayout
      title="Dashboard"
      subtitle="Super Admin system overview, analytics, and activity insights"
      stats={stats}
      contentClassName="bg-transparent border-none p-0 shadow-none"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 lg:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Financial Trends</p>
                <h3 className="text-xl font-bold text-slate-800 mt-1">Platform Cash Flow</h3>
              </div>

              <div className="relative" ref={filterRef}>
                <button
                  onClick={() => setIsFilterOpen((prev) => !prev)}
                  className="h-10 px-3.5 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all flex items-center gap-2"
                >
                  <SlidersHorizontal size={16} className="text-emerald-700" />
                  {selectedRangeLabel}
                  <ChevronDown size={16} className={`text-slate-400 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>

                {isFilterOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-lg p-1.5 z-30">
                    {RANGE_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          setSelectedRange(option.id)
                          setIsFilterOpen(false)
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedRange === option.id
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={visibleTrends} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5a4" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#0ea5a4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} tickFormatter={(value) => `₹${Math.round(value / 1000)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="income" stroke="#059669" strokeWidth={3} fill="url(#incomeGrad)" />
                  <Area type="monotone" dataKey="expense" stroke="#0ea5a4" strokeWidth={2.5} fill="url(#expenseGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600 mb-1">Income</p>
                <p className="text-lg font-bold text-emerald-800">{formatLakhs(totalInc)}</p>
              </div>
              <div className="rounded-xl border border-teal-100 bg-teal-50 px-4 py-3">
                <p className="text-[11px] font-bold uppercase tracking-widest text-teal-600 mb-1">Expense</p>
                <p className="text-lg font-bold text-teal-800">{formatLakhs(totalExp)}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">Net Balance</p>
                <p className="text-lg font-bold text-slate-800">{formatLakhs(netBalance)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 lg:p-6 shadow-sm">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Distribution</p>
            <h3 className="text-xl font-bold text-slate-800 mt-1 mb-3">Donation Mix</h3>

            <div className="w-full h-[220px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={DONATION_DISTRIBUTION} innerRadius={58} outerRadius={82} paddingAngle={3} dataKey="value" stroke="none" cornerRadius={6}>
                    {DONATION_DISTRIBUTION.map((_, index) => (
                      <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</span>
                <span className="text-[20px] font-black text-slate-800">{formatLakhs(totalDonation)}</span>
              </div>
            </div>

            <div className="space-y-2.5 mt-2">
              {DONATION_DISTRIBUTION.map((item, index) => {
                const ratio = Math.round((item.value / totalDonation) * 100)

                return (
                  <div key={index} className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[index] }} />
                        <span className="text-[12px] font-semibold text-slate-700">{item.name}</span>
                      </div>
                      <span className="text-[12px] font-bold text-slate-700">{ratio}%</span>
                    </div>

                    <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden mb-1.5">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${ratio}%`, backgroundColor: CHART_COLORS[index] }}
                      />
                    </div>

                    <p className="text-[12px] font-bold text-slate-500">{formatLakhs(item.value)}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 lg:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[14px] font-extrabold text-slate-800 uppercase tracking-widest">Recent Activity</h3>
              <button className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-1 rounded-lg flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest transition-all">
                View All <ArrowUpRight size={14} strokeWidth={3} />
              </button>
            </div>

            <div className="space-y-4">
              {RECENT_ACTIVITIES.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:border-emerald-100 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 text-emerald-700 flex items-center justify-center font-black text-[12px]">
                      {activity.initial}
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-slate-800">{activity.donor}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                        {activity.type} • {activity.date}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-[15px] font-black text-slate-800 mb-1">₹{activity.amount.toLocaleString()}</p>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        activity.status === 'Verified'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}
                    >
                      {activity.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 lg:p-6 shadow-sm">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Overview</p>
            <h3 className="text-xl font-bold text-slate-800 mt-1">Financial Summary</h3>

            <div className="space-y-3 mt-5">
              <div className="flex items-center justify-between p-4 rounded-xl border border-emerald-100 bg-emerald-50">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <TrendingUp size={18} />
                  </div>
                  <span className="text-[12px] font-bold text-emerald-700 uppercase tracking-widest">Total Income</span>
                </div>
                <span className="text-[18px] font-black text-emerald-700">{formatLakhs(totalInc)}</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-teal-100 bg-teal-50">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                    <ArrowDownRight size={18} />
                  </div>
                  <span className="text-[12px] font-bold text-teal-700 uppercase tracking-widest">Total Expense</span>
                </div>
                <span className="text-[18px] font-black text-teal-700">{formatLakhs(totalExp)}</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center">
                    <Wallet size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-0.5">Net Treasury Balance</span>
                    <span className="text-[12px] font-medium text-slate-500 uppercase">Consolidated</span>
                  </div>
                </div>
                <span className="text-2xl font-black text-slate-800">{formatLakhs(netBalance)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CommonPageLayout>
  )
}
