import React, { useState, useRef, useEffect } from 'react';
import { Plus, SlidersHorizontal, ChevronDown } from 'lucide-react';
import OrgTable from './OrgTable';
import { getOrgData } from './orgData';
import Pagination from '../../components/ui/Pagination';
import CommonPageLayout from '../../components/ui/CommonPageLayout';
import { Building2, Users, Link2 } from 'lucide-react';

const TABS = ['All Organizations', 'Trust Management', 'Sangh Management'];

export default function OrgIndex() {
  const [activeTab, setActiveTab] = useState('All Organizations');
  const [search, setSearch] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [stats, setStats] = useState({ trusts: 0, sanghs: 0, links: 0 });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState({ linkedId: 'all', status: 'all' });
  const [isTrustViewOpen, setIsTrustViewOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const tableRef = useRef(null);
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateStats = () => {
    const data = getOrgData();
    setStats({
      trusts: data.trusts.length,
      sanghs: data.sanghs.length,
      links: data.links.length
    });
  };

  useEffect(() => {
    updateStats();
  }, [refreshKey]);

  const handleReset = () => {
    setFilterValues({ linkedId: 'all', status: 'all' });
  };

  const statItems = [
    { title: 'Total Trusts', value: (stats.trusts || 0).toString(), icon: Building2, color: 'emerald' },
    { title: 'Total Sanghs', value: (stats.sanghs || 0).toString(), icon: Users, color: 'teal' },
    { title: 'Total Linked', value: (stats.links || 0).toString(), icon: Link2, color: 'emerald' },
  ];

  const toolbar = (
    <>
      {(activeTab === 'Trust Management' || activeTab === 'Sangh Management') && (
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center justify-center gap-2 px-4 h-10 rounded-lg text-sm font-bold transition-all border ${isFilterOpen ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700'}`}
          >
            <SlidersHorizontal size={16} strokeWidth={2.5} className="text-emerald-700" /> Filter
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 shadow-xl rounded-2xl z-[100] p-5 animate-in fade-in slide-in-from-top-2 duration-200 font-sans">
              <div className="space-y-4">
                {activeTab === 'Trust Management' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Linked Sangh</label>
                    <div className="relative">
                      <select
                        className="w-full pl-3 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none appearance-none focus:border-emerald-600 transition-all"
                        value={filterValues.linkedId}
                        onChange={(e) => setFilterValues({...filterValues, linkedId: e.target.value})}
                      >
                        <option value="all">All Sanghs</option>
                        {(() => {
                          const data = getOrgData();
                          return data.sanghs.map(s => <option key={s.id} value={s.id}>{s.name}</option>);
                        })()}
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                )}

                {activeTab === 'Sangh Management' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Linked Trust</label>
                    <div className="relative">
                      <select
                        className="w-full pl-3 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none appearance-none focus:border-emerald-600 transition-all"
                        value={filterValues.linkedId}
                        onChange={(e) => setFilterValues({...filterValues, linkedId: e.target.value})}
                      >
                        <option value="all">All Trusts</option>
                        {(() => {
                          const data = getOrgData();
                          return data.trusts.map(t => <option key={t.id} value={t.id}>{t.name}</option>);
                        })()}
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
                          onChange={() => setFilterValues({...filterValues, status: s})}
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
                  <button onClick={handleReset} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all">Reset</button>
                  <button onClick={() => setIsFilterOpen(false)} className="flex-1 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-lg hover:bg-emerald-800 transition-all">Apply</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'Trust Management' && (
        <button 
          onClick={() => tableRef.current?.openTrustModal()} 
          className="flex items-center justify-center gap-2 rounded-lg font-bold px-5 h-10 text-sm border border-emerald-700 bg-emerald-700 text-white hover:bg-emerald-800 transition-all shadow-sm"
        >
          <Plus size={16} strokeWidth={2.5} /> ADD TRUST
        </button>
      )}

      {activeTab === 'Sangh Management' && (
        <button 
          onClick={() => tableRef.current?.openSanghModal()} 
          className="flex items-center justify-center gap-2 rounded-lg font-bold px-5 h-10 text-sm border border-emerald-700 bg-emerald-700 text-white hover:bg-emerald-800 transition-all shadow-sm"
        >
          <Plus size={16} strokeWidth={2.5} /> ADD SANGH
        </button>
      )}
    </>
  );

  const mappedTab = activeTab === 'All Organizations' ? 'all' : activeTab === 'Trust Management' ? 'trusts' : 'sanghs';

  return (
    <>
      <CommonPageLayout
        title="Organization Management"
        stats={statItems}
        tabs={isTrustViewOpen ? [] : TABS}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          handleReset();
          setCurrentPage(1);
          setSearch('');
          setIsTrustViewOpen(false);
        }}
        searchValue={isTrustViewOpen ? undefined : search}
        onSearchChange={setSearch}
        searchPlaceholder={`Search ${activeTab === 'All Organizations' ? 'organizations' : activeTab}...`}
        toolbar={isTrustViewOpen ? null : toolbar}
      >
        <OrgTable
          ref={tableRef}
          activeTab={mappedTab}
          searchTerm={search}
          filterValues={filterValues}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          setTotalEntries={setTotalEntries}
          onDataChange={() => { updateStats(); setRefreshKey(k => k+1); }}
          onTrustViewChange={setIsTrustViewOpen}
        />

        {!isTrustViewOpen && (
          <div className="mt-5">
            <Pagination
              currentPage={currentPage}
              totalRecords={totalEntries}
              recordsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onRecordsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
            />
          </div>
        )}
      </CommonPageLayout>
    </>
  );
}