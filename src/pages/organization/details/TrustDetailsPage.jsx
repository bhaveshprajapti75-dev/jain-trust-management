import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Link2,
  Unlink,
  CalendarDays,
  Users,
} from 'lucide-react'
import StatusToggle from '../../../components/common/StatusToggle'

export default function TrustDetailsPage({
  trust,
  allData,
  onBack,
  onStatusToggle,
  onLinkSangh,
  onUnlinkSangh,
}) {
  const [selectedSanghId, setSelectedSanghId] = useState('')

  const linkedRecords = useMemo(() => {
    if (!trust) return []
    return allData.links.filter((link) => link.trustId === trust.id && link.status)
  }, [allData.links, trust])

  const linkedSanghs = useMemo(() => {
    return linkedRecords
      .map((link) => {
        const sangh = allData.sanghs.find((item) => item.id === link.sanghId)
        if (!sangh) return null
        return {
          linkId: link.id,
          linkedAt: link.linkedAt,
          sangh,
        }
      })
      .filter(Boolean)
  }, [allData.sanghs, linkedRecords])

  const availableSanghs = useMemo(() => {
    const linkedSet = new Set(linkedRecords.map((link) => link.sanghId))
    return allData.sanghs.filter((sangh) => !linkedSet.has(sangh.id))
  }, [allData.sanghs, linkedRecords])

  useEffect(() => {
    if (availableSanghs.length > 0) {
      setSelectedSanghId(String(availableSanghs[0].id))
    } else {
      setSelectedSanghId('')
    }
  }, [availableSanghs])

  if (!trust) return null

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 h-10 px-3.5 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
        >
          <ArrowLeft size={16} />
          Back to Trust Management
        </button>

        <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</p>
            <p className={`text-sm font-semibold ${trust.status ? 'text-emerald-700' : 'text-rose-600'}`}>
              {trust.status ? 'Active' : 'Inactive'}
            </p>
          </div>
          <StatusToggle status={trust.status} onToggle={() => onStatusToggle(trust.id, 'trust', trust.status)} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Building2 size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">{trust.name}</h2>
            <p className="text-xs text-slate-500">Trust Profile Overview</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <User size={12} />
              Main Contact
            </p>
            <p className="text-sm font-semibold text-slate-800">{trust.mainContactPerson || '---'}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Phone size={12} />
              Mobile
            </p>
            <p className="text-sm font-semibold text-slate-800">{trust.mobile || '---'}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Mail size={12} />
              Email
            </p>
            <p className="text-sm font-semibold text-slate-800">{trust.email || '---'}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Users size={12} />
              Linked Sanghs
            </p>
            <p className="text-sm font-semibold text-slate-800">{linkedSanghs.length}</p>
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <MapPin size={12} />
            Address
          </p>
          <p className="text-sm font-semibold text-slate-800">
            {[trust.address, trust.area, trust.city, trust.state].filter(Boolean).join(', ') || '---'}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Link2 size={16} className="text-emerald-700" />
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Link Sangh to This Trust</h3>
        </div>

        {availableSanghs.length > 0 ? (
          <div className="flex flex-col sm:flex-row gap-2.5">
            <select
              className="flex-1 h-10 px-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:border-emerald-600"
              value={selectedSanghId}
              onChange={(event) => setSelectedSanghId(event.target.value)}
            >
              {availableSanghs.map((sangh) => (
                <option key={sangh.id} value={sangh.id}>
                  {sangh.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => onLinkSangh(trust.id, Number(selectedSanghId))}
              className="h-10 px-4 rounded-lg text-sm font-bold text-white border border-emerald-700 bg-emerald-700 hover:bg-emerald-800 transition-all"
            >
              Link Sangh
            </button>
          </div>
        ) : (
          <p className="text-sm text-slate-500">All sanghs are already linked to this trust.</p>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Linked Sanghs</h3>

        {linkedSanghs.length > 0 ? (
          <div className="space-y-3">
            {linkedSanghs.map(({ linkId, linkedAt, sangh }) => (
              <div key={linkId} className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{sangh.name}</h4>
                  <p className="text-xs font-medium text-slate-500 mt-1">
                    {sangh.mainPersonName || '---'} • {sangh.mobile || '---'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Linked On: {linkedAt || 'N/A'}
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${sangh.status ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'}`}>
                    {sangh.status ? 'Active' : 'Inactive'}
                  </span>

                  <button
                    onClick={() => onUnlinkSangh(linkId)}
                    className="h-9 px-3 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 text-xs font-bold hover:bg-rose-100 transition-all inline-flex items-center gap-1.5"
                  >
                    <Unlink size={14} />
                    Unlink
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No sangh linked with this trust yet.</p>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays size={16} className="text-slate-600" />
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Activity</h3>
        </div>

        {Array.isArray(trust.activity) && trust.activity.length > 0 ? (
          <div className="space-y-2.5">
            {trust.activity.map((activity) => (
              <div key={activity.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                <p className="text-sm font-semibold text-slate-700">{activity.action}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(activity.timestamp).toLocaleString()} by {activity.user || 'Admin'}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No activity recorded yet.</p>
        )}
      </div>
    </div>
  )
}
