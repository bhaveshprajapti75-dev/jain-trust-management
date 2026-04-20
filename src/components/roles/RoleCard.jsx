import { Shield, Users, Landmark } from 'lucide-react'
import CommonCard from '../common/CommonCard'

const TYPE_ICON = { System: Shield, Sangh: Users, Trust: Landmark }
const TYPE_STYLES = {
  System: { text: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-100' },
  Sangh: { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  Trust: { text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
}

export default function RoleCard({ role, userCount, permCount, onClick, onEdit, index = 0 }) {
  const Icon = TYPE_ICON[role.type] || Shield
  const style = TYPE_STYLES[role.type] || TYPE_STYLES.System

  return (
    <CommonCard
      icon={Icon}
      iconWrapperClassName={`${style.bg} ${style.border}`}
      iconClassName={style.text}
      accentClassName="bg-teal-500"
      title={role.name}
      subtitle={`${role.type} Role`}
      status={role.status}
      description={role.description}
      tags={
        <>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${style.text}`}>{role.type}</span>
          <span className="text-[10px] text-slate-400">{role.permissions === 'all' ? 'Full Access' : 'Scoped Access'}</span>
        </>
      }
      footerLeft={
        <div className="flex items-center gap-4">
          <span className="text-[12px] font-bold text-slate-700">{userCount} Users</span>
          <span className="text-[12px] font-bold text-slate-700">{permCount} Perms</span>
        </div>
      }
      actions={[{ label: 'Edit', variant: 'edit', onClick: onEdit, hidden: !onEdit }]}
      onClick={onClick}
      index={index}
    />
  )
}
