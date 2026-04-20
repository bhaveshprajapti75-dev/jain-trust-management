import { Bell, CheckCircle } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import StatusBadge from '../../components/ui/StatusBadge'

const NOTIFS = [
  { id: 1, title: 'New Donation Received', desc: 'Rajesh Shah donated ₹51,000 for Devdravya', time: '2 hours ago', status: 'Unread' },
  { id: 2, title: 'Salgirah Reminder', desc: 'Kartak Sud Poonam is in 15 days', time: '1 day ago', status: 'Unread' },
  { id: 3, title: 'Exam Results Published', desc: 'Monthly Jan exam results are ready', time: '3 days ago', status: 'Read' }
]

export default function Notifications() {
  return (
    <div className="space-y-5 max-w-3xl">
      <PageHeader title="Notifications" subtitle="Stay updated with latest activities" breadcrumbs={[{ label: 'Home' }, { label: 'Notifications' }]} action={<Button variant="secondary" size="sm" icon={CheckCircle}>Mark All Read</Button>} />
      <div className="space-y-2">
        {NOTIFS.map((n) => (
          <div key={n.id} className={`p-4 rounded-xl border transition-all hover:shadow-sm cursor-pointer ${n.status === 'Unread' ? 'bg-teal-50/40 border-teal-200/60' : 'bg-white border-slate-200/80'}`}>
            <div className="flex items-start gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${n.status === 'Unread' ? 'bg-teal-100' : 'bg-slate-100'}`}>
                <Bell className={`w-4 h-4 ${n.status === 'Unread' ? 'text-teal-600' : 'text-slate-400'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <h3 className={`text-[13px] font-medium truncate ${n.status === 'Unread' ? 'text-slate-800' : 'text-slate-600'}`}>{n.title}</h3>
                  <StatusBadge status={n.status} />
                </div>
                <p className="text-[13px] text-slate-500">{n.desc}</p>
                <p className="text-[11px] text-slate-400 mt-1">{n.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}