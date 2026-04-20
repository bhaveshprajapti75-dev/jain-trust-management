import { Globe2, MapPinned, Navigation, Building2, Hash } from 'lucide-react'
import StatCard from '../../components/common/StatCard'

export default function LocationStats({ statsData }) {
  
  const items = [
    { label: 'Countries', value: statsData?.Country || '30', icon: Globe2, color: 'sky' },
    { label: 'States', value: statsData?.State || '30', icon: MapPinned, color: 'sage' },
    { label: 'Cities', value: statsData?.City || '30', icon: Navigation, color: 'emerald' },
    { label: 'Areas', value: statsData?.Area || '30', icon: Building2, color: 'teal' },
    { label: 'Pincodes', value: statsData?.Pincode || '30', icon: Hash, color: 'amber' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
      {items.map((s) => (
        <div key={s.label}>
          <StatCard 
            title={s.label} 
            value={s.value.toString()} 
            icon={s.icon} 
            color={s.color} 
            compact
            className="h-full"
          />
        </div>
      ))}
    </div>
  )
}