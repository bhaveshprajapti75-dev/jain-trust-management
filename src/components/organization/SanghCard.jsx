import { Users } from 'lucide-react'
import CommonCard from '../common/CommonCard'

export default function SanghCard({ sangh, trustName, memberCount, onEdit, onDelete, index = 0, onClick }) {
  return (
    <CommonCard
      icon={Users}
      iconWrapperClassName="bg-emerald-50 border-emerald-100"
      iconClassName="text-emerald-600"
      accentClassName="bg-emerald-500"
      title={sangh.name}
      subtitle={trustName}
      status={sangh.status}
      tags={
        <>
          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{sangh.type}</span>
          <span className="text-[11px] text-teal-600 font-bold">{memberCount ?? sangh.memberCount ?? 0} Members</span>
        </>
      }
      meta={[
        { value: `${sangh.area || sangh.city || '-'}` },
        { value: `${sangh.city || '-'}, ${sangh.state || '-'}` },
      ]}
      footerLeft={<span className="text-[11px] font-bold text-slate-400">{sangh.managersCount || 0} Managers</span>}
      actions={[
        { label: 'Edit', variant: 'edit', onClick: onEdit },
        { label: 'Delete', variant: 'delete', onClick: onDelete },
      ]}
      onClick={onClick}
      index={index}
    />
  )
}
