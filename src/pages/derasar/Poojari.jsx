import { useMemo, useState } from 'react'
import { Gem, Phone, SunMedium, Plus } from 'lucide-react'
import Button from '../../components/common/Button'
import EmptyState from '../../components/common/EmptyState'
import CommonCard from '../../components/common/CommonCard'
import CommonPageLayout from '../../components/common/CommonPageLayout'

const DATA = [
  { id: 1, name: 'Maheshbhai Joshi', derasar: 'Adinath Derasar', shift: 'Morning', phone: '+91 98250 11223', sevaYears: 12, status: 'Active' },
  { id: 2, name: 'Pravinbhai Shah', derasar: 'Shantinath Derasar', shift: 'Evening', phone: '+91 98980 44556', sevaYears: 8, status: 'Active' },
  { id: 3, name: 'Chetanbhai Mehta', derasar: 'Taleti Derasar', shift: 'Festival Relief', phone: '+91 98242 22331', sevaYears: 5, status: 'Inactive' },
]

export default function Poojari() {
  const [search, setSearch] = useState('')

  const filtered = useMemo(function() {
    return DATA.filter(function(item) {
      const query = search.toLowerCase()
      return !query || [item.name, item.derasar, item.shift, item.phone].some(function(value) {
        return String(value || '').toLowerCase().includes(query)
      })
    })
  }, [search])

  const stats = useMemo(function() {
    const active = DATA.filter(function(item) { return item.status === 'Active' }).length
    const derasars = new Set(DATA.map(function(item) { return item.derasar })).size
    const sevaYears = DATA.reduce(function(sum, item) { return sum + item.sevaYears }, 0)
    return [
      { title: 'Poojaris', value: DATA.length, icon: Gem, color: 'teal' },
      { title: 'Active Seva', value: active, icon: SunMedium, color: 'emerald' },
      { title: 'Derasars', value: derasars, icon: Gem, color: 'sky' },
      { title: 'Total Seva Years', value: sevaYears, icon: Phone, color: 'amber' },
    ]
  }, [])

  return (
    <CommonPageLayout
      title="Poojari Management"
      subtitle="Manage poojari assignments, seva history, and derasar shift coordination."
      breadcrumbs={[{ label: 'Derasar' }, { label: 'Poojari' }]}
      action={<Button icon={Plus}>Add Poojari</Button>}
      stats={stats}
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search poojari, derasar, shift, or phone..."
      isEmpty={!filtered.length}
      emptyState={<EmptyState message="No poojari records found" description="Add a poojari assignment to track derasar seva coverage." icon={Gem} />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(function(item, index) {
          return (
            <CommonCard
              key={item.id}
              icon={Gem}
              iconWrapperClassName="bg-amber-50 border-amber-100"
              iconClassName="text-amber-600"
              accentClassName="bg-amber-500"
              title={item.name}
              subtitle={item.derasar}
              status={item.status}
              meta={[
                { value: `Shift: ${item.shift}` },
                { value: item.phone },
                { value: `${item.sevaYears} Years Seva`, className: 'text-teal-600 font-bold' },
              ]}
              footerLeft={<span className="text-[11px] font-bold text-slate-400">Derasar Duty</span>}
              index={index}
            />
          )
        })}
      </div>
    </CommonPageLayout>
  )
}
