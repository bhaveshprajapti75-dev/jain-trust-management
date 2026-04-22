import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Printer, Download, Gem } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import StatusBadge from '../../components/ui/StatusBadge'

export default function Receipt() {
  const { id } = useParams()
  const navigate = useNavigate()
  const donation = { donorName: 'Rajesh Shah', phone: '9876543210', type: 'Devdravya', amount: 51000, date: '2025-01-15', mode: 'Cheque', receiptNo: `RCP-${id}`, status: 'Verified' }

  return (
    <div className="space-y-5">
      <PageHeader title="Donation Receipt" breadcrumbs={[{ label: 'Home' }, { label: 'Donations' }, { label: 'Receipt' }]} action={<div className="flex items-center gap-2"><Button variant="secondary" size="sm" icon={ArrowLeft} onClick={() => navigate('/donations')}>Back</Button><Button variant="secondary" size="sm" icon={Printer}>Print</Button><Button size="sm" icon={Download}>PDF</Button></div>} />

      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-200/30 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg"><Gem className="w-5 h-5" /></div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Shree Jain Sangh</h2>
              <p className="text-[11px] text-slate-400">Navrangpura, Ahmedabad</p>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-white/10 pt-3">
            <span className="text-[11px] font-semibold tracking-wider text-slate-300">DONATION RECEIPT</span>
            <span className="text-[11px] font-mono bg-white/10 px-2.5 py-1 rounded-md">{donation.receiptNo}</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Donor Details</p>
              <div><p className="text-[11px] text-slate-400">Name</p><p className="text-sm font-medium text-slate-800">{donation.donorName}</p></div>
              <div><p className="text-[11px] text-slate-400">Phone</p><p className="text-sm text-slate-600">{donation.phone}</p></div>
            </div>
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Donation Details</p>
              <div><p className="text-[11px] text-slate-400">Type</p><p className="text-sm font-medium text-slate-800">{donation.type}</p></div>
              <div><p className="text-[11px] text-slate-400">Date</p><p className="text-sm text-slate-600">{donation.date}</p></div>
            </div>
          </div>

          <div className="bg-teal-50 rounded-xl p-5 text-center border border-teal-200/60">
            <p className="text-[10px] font-semibold text-teal-600 uppercase tracking-wider mb-1">Donation Amount</p>
            <p className="text-3xl font-extrabold text-teal-700 tracking-tight">₹{donation.amount.toLocaleString()}</p>
            <p className="text-[11px] text-teal-500 mt-1">Payment Mode: {donation.mode}</p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <StatusBadge status={donation.status} size="md" />
            <p className="text-[11px] text-slate-400">80G Eligible: Yes</p>
          </div>
        </div>
      </div>
    </div>
  )
}