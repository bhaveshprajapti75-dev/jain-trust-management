import { MapPin } from 'lucide-react'
import CommonCard from '../common/CommonCard'

export default function LocationCard({ location, sanghCount, onEdit, onDelete, index = 0, onClick }) {
  return (
    <CommonCard
      icon={MapPin}
      iconWrapperClassName="bg-amber-50 border-amber-100"
      iconClassName="text-amber-600"
      accentClassName="bg-amber-500"
      title={location.locality || location.area || location.city}
      subtitle={`${location.area || location.city || '-'}, ${location.state || '-'}`}
      status={location.status}
      meta={[
        { value: `Country: ${location.country || '-'}` },
        { value: `City: ${location.city || '-'}` },
        { value: `Pincode: ${location.pincode || '-'}` },
        { value: `${sanghCount ?? location.sanghCount ?? 0} Sanghs`, className: 'text-amber-600 font-bold' },
      ]}
      footerLeft={<span className="text-[11px] font-bold text-slate-400">{location.trustCount || 0} Trusts</span>}
      actions={[
        { label: 'Edit', variant: 'edit', onClick: onEdit },
        { label: 'Delete', variant: 'delete', onClick: onDelete },
      ]}
      onClick={onClick}
      index={index}
    />
  )
}
