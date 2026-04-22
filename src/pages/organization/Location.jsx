import { useState, useRef, useEffect } from 'react'
import { PlusCircle, SlidersHorizontal, ChevronDown, Search } from 'lucide-react'
import LocationTable from './LocationTable'
import { Globe2, MapPinned, Navigation, Building2, Hash } from 'lucide-react'
import Pagination from '../../components/ui/Pagination'

const TABS = ['Country', 'State', 'City', 'Area', 'Pincode']

const STAT_THEMES = [
  { iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  { iconBg: 'bg-green-50', iconColor: 'text-green-600' },
  { iconBg: 'bg-teal-50', iconColor: 'text-teal-600' },
  { iconBg: 'bg-lime-50', iconColor: 'text-lime-600' },
  { iconBg: 'bg-cyan-50', iconColor: 'text-cyan-600' },
]

export default function Location() {
  const [activeTab, setActiveTab] = useState('Country')
  const [search, setSearch] = useState('')
  const [itemsPerPage, setItemsPerPage] = useState(30)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalEntries, setTotalEntries] = useState(0)
  const [stats, setStats] = useState({ Country: 30, State: 30, City: 30, Area: 30, Pincode: 30 })

  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filterValues, setFilterValues] = useState({
    countryId: 'all',
    stateId: 'all',
    cityId: 'all',
    areaId: 'all',
    status: 'all',
    pincodeNumber: ''
  })

  const tableRef = useRef(null)
  const filterRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleAddClick = () => {
    if (tableRef.current) tableRef.current.openAddModal()
  }

  const canUseActions = true

  const handleReset = () => {
    setFilterValues({
      countryId: 'all',
      stateId: 'all',
      cityId: 'all',
      areaId: 'all',
      status: 'all',
      pincodeNumber: ''
    })
  }

  const statItems = [
    { title: 'Countries', value: (stats?.Country || 30).toString(), icon: Globe2, color: 'sky' },
    { title: 'States', value: (stats?.State || 30).toString(), icon: MapPinned, color: 'sage' },
    { title: 'Cities', value: (stats?.City || 30).toString(), icon: Navigation, color: 'emerald' },
    { title: 'Areas', value: (stats?.Area || 30).toString(), icon: Building2, color: 'teal' },
    { title: 'Pincodes', value: (stats?.Pincode || 30).toString(), icon: Hash, color: 'amber' },
  ]

  const toolbar = canUseActions ? (
    <>
      <div className="relative" ref={filterRef}>
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`flex items-center gap-2 border px-3 h-10 rounded-lg text-sm font-medium transition-all ${isFilterOpen ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-gray-300 text-slate-700 hover:bg-gray-50'}`}
        >
          <SlidersHorizontal size={16} strokeWidth={2.4} className="text-emerald-700" /> Filter
        </button>

        {isFilterOpen && (
          <div className="absolute right-0 mt-3 w-72 rounded-2xl z-[100] p-5 animate-in fade-in slide-in-from-top-2 duration-200 font-sans border border-slate-200 bg-white shadow-lg">
            <div className="space-y-4">
              {activeTab === 'State' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Country</label>
                  <div className="relative">
                    <select
                      className="w-full pl-3 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none appearance-none focus:border-emerald-600 transition-all"
                      value={filterValues.countryId}
                      onChange={(e) => setFilterValues({...filterValues, countryId: e.target.value })}
                    >
                      <option value="all">All Countries</option>
                      {tableRef.current?.getFilterOptions('Country').map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              )}

              {activeTab === 'City' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">State</label>
                  <div className="relative">
                    <select
                      className="w-full pl-3 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none appearance-none focus:border-emerald-600 transition-all"
                      value={filterValues.stateId}
                      onChange={(e) => setFilterValues({...filterValues, stateId: e.target.value })}
                    >
                      <option value="all">All States</option>
                      {tableRef.current?.getFilterOptions('State').map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              )}

              {activeTab === 'Area' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">City</label>
                  <div className="relative">
                    <select
                      className="w-full pl-3 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none appearance-none focus:border-emerald-600 transition-all"
                      value={filterValues.cityId}
                      onChange={(e) => setFilterValues({...filterValues, cityId: e.target.value })}
                    >
                      <option value="all">All Cities</option>
                      {tableRef.current?.getFilterOptions('City').map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              )}

              {activeTab === 'Pincode' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Area</label>
                  <div className="relative">
                    <select
                      className="w-full pl-3 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none appearance-none focus:border-emerald-600 transition-all"
                      value={filterValues.areaId}
                      onChange={(e) => setFilterValues({...filterValues, areaId: e.target.value })}
                    >
                      <option value="all">All Areas</option>
                      {tableRef.current?.getFilterOptions('Area').map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</label>
                <div className="flex items-center gap-4">
                  {['all', 'active', 'inactive'].map((s) => (
                    <label key={s} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="status"
                        className="hidden"
                        checked={filterValues.status === s}
                        onChange={() => setFilterValues({...filterValues, status: s })}
                      />
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${filterValues.status === s ? 'border-emerald-600' : 'border-slate-300 group-hover:border-emerald-400'}`}>
                        {filterValues.status === s && <div className="w-2 h-2 rounded-full bg-emerald-600" />}
                      </div>
                      <span className={`text-xs font-bold capitalize ${filterValues.status === s ? 'text-slate-700' : 'text-slate-400'}`}>{s}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button onClick={handleReset} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 bg-white hover:bg-slate-50 transition-all">Reset</button>
                <button onClick={() => setIsFilterOpen(false)} className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white border border-emerald-700 bg-emerald-700 hover:bg-emerald-800 transition-all">Filter</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <button onClick={handleAddClick} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-emerald-900 to-emerald-500 text-white text-sm font-medium h-10">
        <PlusCircle size={16} strokeWidth={1.8} /> ADD
      </button>
    </>
  ) : null

  return (
    <div className="w-full">
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-[#1A1A1A]">Location Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4 rounded-xl">
        {statItems.map((item, index) => {
          const Icon = item.icon
          const theme = STAT_THEMES[index % STAT_THEMES.length]

          return (
            <div key={item.title} className="w-full bg-white rounded-lg p-4 flex items-center justify-between border border-slate-200/80 shadow-sm">
              <div className="flex flex-col">
                <p className="text-slate-900 text-[12px] font-medium">{item.title}</p>
                <p className="text-2xl font-bold mt-1 text-slate-900">{item.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${theme.iconBg}`}>
                <Icon className={`h-5 w-5 ${theme.iconColor}`} strokeWidth={2} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="w-full bg-white rounded-lg shadow-sm border border-slate-200 p-1.5 mb-4">
        <div className="flex items-center gap-1.5">
          {TABS.map((tab) => {
            const isActive = activeTab === tab

            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab)
                  handleReset()
                  setIsFilterOpen(false)
                  setCurrentPage(1)
                }}
                className={`h-10 text-sm transition-all whitespace-nowrap rounded-md flex-1 font-medium ${
                  isActive
                    ? 'bg-emerald-50/90 text-emerald-800'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            )
          })}
        </div>
      </div>

      <div className="w-full relative bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
          <div className="flex w-full md:w-[350px] items-center border border-gray-300 rounded-lg px-3 h-10 bg-white">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${activeTab}...`}
              className="ml-2 flex-1 outline-none text-slate-700 text-sm placeholder:text-slate-400 bg-transparent"
            />
          </div>

          {toolbar ? <div className="w-full flex justify-end items-center gap-3 relative">{toolbar}</div> : null}
        </div>

        <LocationTable
          ref={tableRef}
          activeTab={activeTab}
          searchTerm={search}
          filterValues={filterValues}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          setTotalEntries={setTotalEntries}
          onDataChange={(newStats) => setStats(newStats)}
        />

        <div className="mt-2">
          <Pagination
            currentPage={currentPage}
            totalRecords={totalEntries}
            recordsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onRecordsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
            rowsPerPageOptions={[30, 50, 100]}
          />
        </div>
      </div>
    </div>
  )
}