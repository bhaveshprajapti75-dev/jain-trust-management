import { useMemo, useState } from 'react'
import { Landmark, Receipt, TrendingUp, TrendingDown, Plus } from 'lucide-react'
import Button from '../../components/common/Button'
import EmptyState from '../../components/common/EmptyState'
import CommonCard from '../../components/common/CommonCard'
import CommonPageLayout from '../../components/common/CommonPageLayout'

const DATA = [
  { id: 1, ledger: 'Central Trust Ledger', sangh: 'Sathandji Kalyanji Sangh', balance: '?18,45,000', income: '?3,25,000', expense: '?1,42,000', status: 'Active' },
  { id: 2, ledger: 'Pathshala Ledger', sangh: 'Bhavnagar Upashray Sangh', balance: '?4,10,000', income: '?92,000', expense: '?48,000', status: 'Active' },
  { id: 3, ledger: 'Derasar Seva Ledger', sangh: 'Taleti Jain Sangh', balance: '?2,36,000', income: '?58,000', expense: '?63,000', status: 'Inactive' },
]

export default function Accounts() {
  const [search, setSearch] = useState('')
  const filtered = useMemo(function() {
    return DATA.filter(function(item) {
      const query = search.toLowerCase()
      return !query || [item.ledger, item.sangh, item.balance].some(function(value) {
        return String(value || '').toLowerCase().includes(query)
      })
    })
  }, [search])

  return (
    <CommonPageLayout
      title="Accounts"
      subtitle="Track sangh and trust ledgers, balances, income, and expenses."
      stats={[
        { title: 'Ledgers', value: DATA.length, icon: Receipt, color: 'teal' },
        { title: 'Active Ledgers', value: DATA.filter(function(item) { return item.status === 'Active' }).length, icon: Landmark, color: 'emerald' },
        { title: 'Income This Cycle', value: '?4.75L', icon: TrendingUp, color: 'sky' },
        { title: 'Expense This Cycle', value: '?2.53L', icon: TrendingDown, color: 'amber' },
      ]}
      action={<Button icon={Plus}>Add Ledger</Button>}
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search ledger, sangh, or balance..."
      isEmpty={!filtered.length}
      emptyState={<EmptyState message="No accounts found" description="Add a ledger to start tracking income and expense by sangh or trust." icon={Receipt} />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(function(item, index) {
          return (
            <CommonCard
              key={item.id}
              icon={Receipt}
              iconWrapperClassName="bg-teal-50 border-teal-100"
              iconClassName="text-teal-600"
              accentClassName="bg-teal-500"
              title={item.ledger}
              subtitle={item.sangh}
              status={item.status}
              meta={[
                { value: `Balance: ${item.balance}`, className: 'text-teal-600 font-bold' },
                { value: `Income: ${item.income}` },
                { value: `Expense: ${item.expense}` },
              ]}
              footerLeft={<span className="text-[11px] font-bold text-slate-400">Accounts Overview</span>}
              index={index}
            />
          )
        })}
      </div>
    </CommonPageLayout>
  )
}
