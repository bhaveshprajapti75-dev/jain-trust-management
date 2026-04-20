import { Building2 } from 'lucide-react'
import CommonCard from '../common/CommonCard'

export default function DepartmentCard({ dept, trustName, memberCount, onEdit, onDelete, index = 0, onClick }) {
  return (
    <CommonCard
      icon={Building2}
      iconWrapperClassName="bg-violet-50 border-violet-100"
      iconClassName="text-violet-600"
      accentClassName="bg-violet-500"
      title={dept.name}
      subtitle={trustName}
      status={dept.status}
      description={dept.description}
      meta={[
        { value: `${memberCount ?? dept.memberCount ?? 0} Members`, className: 'text-teal-600 font-bold' },
        { value: `Head: ${dept.head || '-'}` },
      ]}
      footerLeft={<span className="text-[11px] font-bold text-slate-400">Department</span>}
      actions={[
        { label: 'Edit', variant: 'edit', onClick: onEdit },
        { label: 'Delete', variant: 'delete', onClick: onDelete },
      ]}
      onClick={onClick}
      index={index}
    />
  )
}
