import PageHeader from './PageHeader'
import SearchBar from './SearchBar'
import EmptyState from './EmptyState'
import StatCard from './StatCard'

export default function CommonPageLayout({
  title,
  subtitle,
  breadcrumbs,
  action,
  stats = [],
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  toolbar,
  tabs = [],
  activeTab,
  onTabChange,
  children,
  isEmpty = false,
  emptyState,
  className = '',
  contentClassName = '',
}) {
  const hasControls = typeof searchValue === 'string' || toolbar

  const getStatsGridClass = (count) => {
    if (count >= 5) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
    if (count === 4) return 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'
    if (count === 3) return 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
    if (count === 2) return 'grid-cols-1 sm:grid-cols-2'
    return 'grid-cols-1'
  }

  return (
    <div className={`-mx-5 lg:-mx-7 -mt-8 lg:-mt-10 bg-gray-100 min-h-screen font-sans pb-10 ${className}`}>
      <div className="px-5 lg:px-7 pt-8 pb-4 space-y-5">
        <PageHeader title={title} subtitle={subtitle} breadcrumbs={breadcrumbs} action={action} />

        {stats.length ? (
          <div className={`grid gap-4 ${getStatsGridClass(stats.length)}`}>
            {stats.map((stat) => (
              <div key={stat.title} className="min-w-0">
                <StatCard {...stat} compact className="h-full" />
              </div>
            ))}
          </div>
        ) : null}

        {tabs.length > 0 && (
          <div className="bg-white p-1 rounded-lg border border-slate-200/90 shadow-sm flex items-center w-full gap-1">
            {tabs.map((tab) => {
              const tabId = typeof tab === 'string' ? tab : tab.id;
              const tabLabel = typeof tab === 'string' ? tab : tab.label;
              return (
                <button 
                  key={tabId} 
                  onClick={() => onTabChange && onTabChange(tabId)} 
                  className={`h-10 text-[14px] flex-1 rounded-md transition-all duration-150 flex items-center justify-center
                    ${activeTab === tabId 
                      ? 'bg-emerald-50/80 text-emerald-800 font-semibold' 
                      : 'text-slate-600 hover:bg-slate-100/90 hover:text-slate-900 font-medium' 
                  }`}
                >
                  {tabLabel.toUpperCase()}
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="px-5 lg:px-7 mt-2">
        <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${contentClassName}`}>
          {hasControls ? (
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-5">
              {typeof searchValue === 'string' ? (
                <div className="relative w-full md:w-80 group">
                  <SearchBar value={searchValue} onChange={onSearchChange} placeholder={searchPlaceholder} />
                </div>
              ) : <div />}
              {toolbar ? (
                <div className="flex items-center gap-2.5 w-full md:w-auto justify-end relative">
                  {toolbar}
                </div>
              ) : null}
            </div>
          ) : null}

          {isEmpty ? emptyState || <EmptyState /> : children}
        </div>
      </div>
    </div>
  )
}
