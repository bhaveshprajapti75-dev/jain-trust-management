import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, RotateCcw, User, HandHeart, FileText, CreditCard } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

export default function AddDonation() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ donorName: '', phone: '', type: '', amount: '', date: new Date().toISOString().split('T')[0], mode: '', notes: '' })
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader 
        title="Add New Donation" 
        subtitle="Record a new donation entry" 
        breadcrumbs={[{ label: 'Home' }, { label: 'Donations' }, { label: 'Add New' }]} 
        action={<Button variant="secondary" size="sm" icon={RotateCcw} onClick={() => navigate('/donations')}>Cancel</Button>} 
      />

      {/* Donor Information */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
            <User className="w-4 h-4 text-teal-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Donor Information</h3>
            <p className="text-[11px] text-slate-400">Enter details of the person donating</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Input label="Donor Name" name="donorName" value={form.donorName} onChange={handleChange} placeholder="Full name" required />
          <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} placeholder="98XXXXXXXX" icon={User} />
          <Input label="Date" name="date" type="date" value={form.date} onChange={handleChange} required />
        </div>
      </div>

      {/* Donation Details */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
            <HandHeart className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Donation Details</h3>
            <p className="text-[11px] text-slate-400">Specify amount, type and payment mode</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-slate-600">Type <span className="text-rose-500">*</span></label>
            <select name="type" value={form.type} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-50/50 outline-none transition-all cursor-pointer">
              <option value="">Select Type</option>
              {['Jivdaya', 'Devdravya', 'Derasar Nidhi', 'Pathshala', 'Aayambil', 'General'].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          
          <Input label="Amount (₹)" name="amount" type="number" value={form.amount} onChange={handleChange} placeholder="Enter amount" required />
          
          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-slate-600">Mode <span className="text-rose-500">*</span></label>
            <select name="mode" value={form.mode} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-50/50 outline-none transition-all cursor-pointer">
              <option value="">Select Mode</option>
              {['Cash', 'Cheque', 'Online', 'UPI'].map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
        </div>
        
        <div className="mt-5">
          <Input label="Notes" name="notes" value={form.notes} onChange={handleChange} placeholder="Optional notes or reference numbers" />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" icon={RotateCcw} className="px-5">Reset</Button>
        <Button icon={Save} onClick={() => navigate('/donations')} className="px-5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 border-0 text-white">Save Donation</Button>
      </div>
    </div>
  )
}