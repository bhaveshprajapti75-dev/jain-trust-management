import { useNavigate } from "react-router-dom";
import { Users, UserPlus, IndianRupee, Wallet, BarChart3, TrendingUp } from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend 
} from "recharts";
import StatCard from "../../components/common/StatCard";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

// Mock Data
const MEMBER_DATA = [
  { month: 'Jan', members: 4200 },
  { month: 'Feb', members: 4350 },
  { month: 'Mar', members: 4500 },
  { month: 'Apr', members: 4620 },
  { month: 'May', members: 4780 },
  { month: 'Jun', members: 4850 }
];

const FINANCE_DATA = [
  { month: 'Jan', donation: 85000, expense: 42000 },
  { month: 'Feb', donation: 125000, expense: 68000 },
  { month: 'Mar', donation: 98000, expense: 55000 },
  { month: 'Apr', donation: 145000, expense: 82000 },
  { month: 'May', donation: 110000, expense: 75000 },
  { month: 'Jun', donation: 160000, expense: 91000 }
];

export default function SanghAdminDashboard() {
  const navigate = useNavigate();

  const tipStyle = { 
    borderRadius: '12px', border: '1px solid #e2e8f0', 
    fontSize: '12px', fontWeight: '600', padding: '10px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  };

  // Class to remove animations and hover effects for simple cards
  const simpleCardCls = "transition-none hover:translate-y-0 hover:shadow-none shadow-sm";

  return (
    <div className="-mx-5 lg:-mx-7 -mt-5 lg:-mt-7 px-5 lg:px-7 pt-6 pb-8 bg-[#fafafa] min-h-[calc(100vh-3.5rem)]">
      <div className="max-w-[1480px] space-y-6">
        
        {/* Header - Only one quick action button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-bold text-teal-700 tracking-tight">
              Sangh Admin Portal
            </h1>
            <p className="text-[13px] font-medium text-slate-400 mt-0.5">
              Overview of your Sangh community and financial health
            </p>
          </div>
          <div className="flex items-center">
            <Button
              size="sm"
              icon={UserPlus}
              onClick={() => navigate("/sangh-admin/members/individuals")}
            >
              Add Member
            </Button>
          </div>
        </div>

        {/* 4 Simple Static Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Family"
            value="1,240"
            icon={Users}
            color="teal"
            className={simpleCardCls}
          />
          <StatCard
            title="Total Member"
            value="4,850"
            icon={TrendingUp}
            color="emerald"
            className={simpleCardCls}
          />
          <StatCard
            title="Donation"
            value="₹12.4L"
            icon={IndianRupee}
            color="sky"
            className={simpleCardCls}
          />
          <StatCard
            title="Expense"
            value="₹8.1L"
            icon={Wallet}
            color="rose"
            className={simpleCardCls}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Pillar Type Chart (Bar Chart) for Finance */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-[15px] font-bold text-slate-800 uppercase tracking-wide">Finance Overview</h3>
                <p className="text-[11px] text-slate-400 font-medium">Monthly Donation vs Expenses</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                <BarChart3 className="w-5 h-5" />
              </div>
            </div>
            
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={FINANCE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} tickFormatter={(v) => `₹${v/1000}K`} />
                  <Tooltip contentStyle={tipStyle} cursor={{fill: '#f8fafc'}} />
                  <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{fontSize: '11px', fontWeight: 600, paddingBottom: 20}} />
                  <Bar dataKey="donation" name="Donation" fill="#0d9488" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="expense" name="Expense" fill="#e11d48" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Member Growth Trend Area Chart */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-[15px] font-bold text-slate-800 uppercase tracking-wide">Member Onboarding</h3>
                <p className="text-[11px] text-slate-400 font-medium">Total registered members trajectory</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MEMBER_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} />
                  <Tooltip contentStyle={tipStyle} />
                  <Area 
                    type="monotone" 
                    dataKey="members" 
                    stroke="#10b981" 
                    strokeWidth={2.5}
                    strokeDasharray="5 5"
                    fillOpacity={1} 
                    fill="url(#colorMem)" 
                    activeDot={{ r: 5, strokeWidth: 0, fill: '#10b981' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
