import { Landmark } from 'lucide-react'
import CommonCard from '../common/CommonCard'

export default function TrustCard({ trust, sanghCount, onEdit, onDelete, index = 0, onClick }) {
  return (
    <CommonCard
      icon={Landmark}
      iconWrapperClassName="bg-rose-50 border-rose-100"
      iconClassName="text-rose-600"
      accentClassName="bg-teal-500"
      title={trust.name}
      subtitle={trust.address}
      status={trust.status}
      meta={[
        { value: `Est: ${trust.established || '-'}` },
        { value: trust.phone || '-' },
        { value: `${sanghCount ?? trust.sanghCount ?? 0} Sanghs`, className: 'text-teal-600 font-bold' },
      ]}
      footerLeft={<span className="text-[11px] font-bold text-slate-400">{trust.code || trust.admin || 'Trust Record'}</span>}
      actions={[
        { label: 'Edit', variant: 'edit', onClick: onEdit },
        { label: 'Delete', variant: 'delete', onClick: onDelete },
      ]}
      onClick={onClick}
      index={index}
    />
  )
}
