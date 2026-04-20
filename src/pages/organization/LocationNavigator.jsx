import { useEffect, useMemo, useState } from 'react'
import { Building2, Edit2, Filter, Globe2, Hash, MapPinned, Navigation, Plus, Search, Trash2 } from 'lucide-react'
import Button from '../../components/common/Button'
import CommonPageLayout from '../../components/common/CommonPageLayout'
import ConfirmModal from '../../components/common/ConfirmModal'
import CustomDropdown from '../../components/common/CustomDropdown'
import Input from '../../components/common/Input'
import Modal from '../../components/common/Modal'
import Table from '../../components/common/Table'

const STORAGE_KEY = 'master_locations'
const INITIAL_DATA = [
  { id: 1, country: 'India', state: 'Gujarat', city: 'Ahmedabad', area: 'Bhadaj', pincode: '380060', status: 'Active' },
  { id: 2, country: 'United Arab Emirates', state: 'Dubai', city: 'Dubai', area: 'Jumeirah', pincode: '500001', status: 'Active' },
  { id: 3, country: 'United States', state: 'California', city: 'Fremont', area: 'Ardenwood', pincode: '945550', status: 'Inactive' },
  { id: 4, country: 'Singapore', state: 'Central Region', city: 'Singapore', area: 'Novena', pincode: '307506', status: 'Active' },
  { id: 5, country: 'United Kingdom', state: 'England', city: 'London', area: 'Wembley', pincode: '700001', status: 'Active' },
]

const EMPTY_FORM = {
  country: '',
  state: '',
  city: '',
  area: '',
  pincode: '',
  status: 'Active',
}

const EMPTY_FILTERS = {
  country: '',
  state: '',
  city: '',
  area: '',
  pincode: '',
}

const SECTION_CONFIGS = [
  { key: 'country', label: 'Country', icon: Globe2, summary: 'National mapping' },
  { key: 'state', label: 'State', icon: MapPinned, summary: 'Regional control' },
  { key: 'city', label: 'City', icon: Navigation, summary: 'Operational cities' },
  { key: 'area', label: 'Area', icon: Building2, summary: 'Local clusters' },
  { key: 'pincode', label: 'Pincode', icon: Hash, summary: 'Postal coverage' },
]

const COUNTRY_CODE_MAP = {
  India: 'IN',
  'United Arab Emirates': 'AE',
  'United States': 'US',
  Singapore: 'SG',
  'United Kingdom': 'GB',
}

function isLegacySeed(records) {
  if (!Array.isArray(records) || records.length !== 5) return false
  return records.every(function(item) { return item.country === 'India' })
}

function getLocationCode(sectionKey, value) {
  const text = String(value || '').trim()
  if (!text) return '--'
  if (sectionKey === 'country' && COUNTRY_CODE_MAP[text]) return COUNTRY_CODE_MAP[text]
  if (sectionKey === 'pincode') return text

  const words = text
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)

  const initials = words.map(function(word) { return word[0] }).join('').toUpperCase()
  if (initials.length >= 2) return initials.slice(0, 3)

  return text.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 3) || '--'
}

function readLocations() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const parsed = stored ? JSON.parse(stored) : INITIAL_DATA
    if (!Array.isArray(parsed) || !parsed.length) return INITIAL_DATA
    return isLegacySeed(parsed) ? INITIAL_DATA : parsed
  } catch {
    return INITIAL_DATA
  }
}

function getUniqueOptions(records, key) {
  return Array.from(new Set(records.map(function(item) { return item[key] }).filter(Boolean)))
}

function CompactStatusToggle({ status, onChange }) {
  const active = status === 'Active'

  return (
    <button
      type="button"
      onClick={function() { onChange(active ? 'Inactive' : 'Active') }}
      className={`relative inline-flex h-5 w-10 items-center rounded-full transition-all ${
        active ? 'bg-emerald-500' : 'bg-slate-300'
      }`}
      aria-label="Toggle status"
      aria-pressed={active}
    >
      <span
        className={`absolute h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-all ${
          active ? 'right-1' : 'left-1'
        }`}
      />
    </button>
  )
}

export default function LocationNavigator() {
  const [activeTab, setActiveTab] = useState('country')
  const [search, setSearch] = useState('')
  const [locations, setLocations] = useState(function() {
    return readLocations()
  })
  const [showModal, setShowModal] = useState(false)
  const [groupEditor, setGroupEditor] = useState(null)
  const [groupValue, setGroupValue] = useState('')
  const [groupError, setGroupError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [draftFilters, setDraftFilters] = useState(EMPTY_FILTERS)
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  useEffect(function() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(locations))
  }, [locations])

  const currentSection = useMemo(function() {
    return SECTION_CONFIGS.find(function(item) { return item.key === activeTab }) || SECTION_CONFIGS[0]
  }, [activeTab])

  const filterOptions = useMemo(function() {
    return {
      country: getUniqueOptions(locations, 'country'),
      state: getUniqueOptions(locations, 'state'),
      city: getUniqueOptions(locations, 'city'),
      area: getUniqueOptions(locations, 'area'),
      pincode: getUniqueOptions(locations, 'pincode'),
    }
  }, [locations])

  const filteredLocations = useMemo(function() {
    const query = search.trim().toLowerCase()

    return locations.filter(function(item) {
      if (appliedFilters.country && item.country !== appliedFilters.country) return false
      if (appliedFilters.state && item.state !== appliedFilters.state) return false
      if (appliedFilters.city && item.city !== appliedFilters.city) return false
      if (appliedFilters.area && item.area !== appliedFilters.area) return false
      if (appliedFilters.pincode && item.pincode !== appliedFilters.pincode) return false

      if (!query) return true

      return [item.country, item.state, item.city, item.area, item.pincode, item.status].some(function(value) {
        return String(value || '').toLowerCase().includes(query)
      })
    })
  }, [appliedFilters, locations, search])

  function updateField(key, value) {
    setForm(function(current) {
      return { ...current, [key]: value }
    })
  }

  function handleDraftFilterChange(key, value) {
    setDraftFilters(function(current) {
      return { ...current, [key]: value }
    })
  }

  function openAddModal() {
    setForm(EMPTY_FORM)
    setErrors({})
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setForm(EMPTY_FORM)
    setErrors({})
  }

  function openGroupEdit(row) {
    setGroupEditor({
      sectionKey: currentSection.key,
      sectionLabel: currentSection.label,
      previousValue: row.name,
      totalCount: row.totalCount,
    })
    setGroupValue(row.name)
    setGroupError('')
  }

  function closeGroupEdit() {
    setGroupEditor(null)
    setGroupValue('')
    setGroupError('')
  }

  function validate() {
    const nextErrors = {}
    if (!form.country.trim()) nextErrors.country = 'Country is required'
    if (!form.state.trim()) nextErrors.state = 'State is required'
    if (!form.city.trim()) nextErrors.city = 'City is required'
    if (!form.area.trim()) nextErrors.area = 'Area is required'
    if (!form.pincode.trim()) nextErrors.pincode = 'Pincode is required'
    if (form.pincode && !/^\d{6}$/.test(form.pincode.trim())) nextErrors.pincode = 'Enter a valid 6-digit pincode'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleSave(event) {
    event.preventDefault()
    if (!validate()) return

    const payload = {
      country: form.country.trim(),
      state: form.state.trim(),
      city: form.city.trim(),
      area: form.area.trim(),
      pincode: form.pincode.trim(),
      status: form.status,
    }

    setLocations(function(current) {
      const nextId = current.reduce(function(maxId, item) { return Math.max(maxId, item.id) }, 0) + 1
      return current.concat([{ id: nextId, ...payload }])
    })

    closeModal()
  }

  function handleGroupSave(event) {
    event.preventDefault()
    if (!groupEditor) return

    const nextValue = groupValue.trim()
    if (!nextValue) {
      setGroupError(groupEditor.sectionLabel + ' name is required')
      return
    }

    const alreadyExists = locations.some(function(item) {
      return item[groupEditor.sectionKey] === nextValue && item[groupEditor.sectionKey] !== groupEditor.previousValue
    })

    if (alreadyExists) {
      setGroupError(groupEditor.sectionLabel + ' already exists')
      return
    }

    setLocations(function(current) {
      return current.map(function(item) {
        return item[groupEditor.sectionKey] === groupEditor.previousValue
          ? { ...item, [groupEditor.sectionKey]: nextValue }
          : item
      })
    })
    closeGroupEdit()
  }

  function handleDelete() {
    if (!deleteTarget) return

    setLocations(function(current) {
      return current.filter(function(item) {
        return item[deleteTarget.sectionKey] !== deleteTarget.value
      })
    })
    setDeleteTarget(null)
  }

  function handleGroupToggle(value, nextStatus) {
    setLocations(function(current) {
      return current.map(function(item) {
        return item[currentSection.key] === value ? { ...item, status: nextStatus } : item
      })
    })
  }

  const groupedRows = useMemo(function() {
    const groups = new Map()

    filteredLocations.forEach(function(item) {
      const value = item[currentSection.key]
      if (!value) return

      if (!groups.has(value)) {
        groups.set(value, {
          groupKey: currentSection.key + '-' + value,
          name: value,
          code: getLocationCode(currentSection.key, value),
          totalCount: 0,
          activeCount: 0,
          inactiveCount: 0,
          status: 'Inactive',
        })
      }

      const current = groups.get(value)
      current.totalCount += 1
      if (item.status === 'Active') current.activeCount += 1
      else current.inactiveCount += 1
      current.status = current.inactiveCount === 0 ? 'Active' : 'Inactive'
    })

    return Array.from(groups.values())
  }, [currentSection.key, filteredLocations])

  const activeGroups = groupedRows.filter(function(item) { return item.status === 'Active' }).length
  const inactiveGroups = groupedRows.length - activeGroups

  const stats = [
    { title: 'Total ' + currentSection.label, value: String(groupedRows.length).padStart(2, '0'), icon: currentSection.icon, color: 'teal' },
    { title: 'Active ' + currentSection.label, value: String(activeGroups).padStart(2, '0'), icon: Globe2, color: 'emerald' },
    { title: 'Inactive ' + currentSection.label, value: String(inactiveGroups).padStart(2, '0'), icon: Hash, color: 'sky' },
  ]

  const headerActions = (
    <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center">
      <div className="relative min-w-0 lg:w-[320px]">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder={`Search ${currentSection.label.toLowerCase()}...`}
          value={search}
          onChange={function(event) { setSearch(event.target.value) }}
          className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-[13px] text-slate-700 shadow-sm outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-50"
        />
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={function() { setShowFilterMenu(function(current) { return !current }) }}
          className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-[13px] font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
        >
          <Filter className="h-4 w-4" />
          Filter
        </button>

        {showFilterMenu && (
          <div className="absolute right-0 top-full z-20 mt-2 w-[320px] rounded-[24px] border border-slate-200 bg-white p-4 shadow-2xl">
            <div className="space-y-3">
              <CustomDropdown value={draftFilters.country} onChange={function(value) { handleDraftFilterChange('country', value) }} placeholder="Country" items={filterOptions.country} className="w-full" />
              <CustomDropdown value={draftFilters.state} onChange={function(value) { handleDraftFilterChange('state', value) }} placeholder="State" items={filterOptions.state} className="w-full" />
              <CustomDropdown value={draftFilters.city} onChange={function(value) { handleDraftFilterChange('city', value) }} placeholder="City" items={filterOptions.city} className="w-full" />
              <CustomDropdown value={draftFilters.area} onChange={function(value) { handleDraftFilterChange('area', value) }} placeholder="Area" items={filterOptions.area} className="w-full" />
              <CustomDropdown value={draftFilters.pincode} onChange={function(value) { handleDraftFilterChange('pincode', value) }} placeholder="Pincode" items={filterOptions.pincode} className="w-full" />

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={function() {
                    setDraftFilters(EMPTY_FILTERS)
                    setAppliedFilters(EMPTY_FILTERS)
                    setShowFilterMenu(false)
                  }}
                  className="rounded-2xl bg-slate-100 px-4 py-2 text-[12px] font-semibold text-slate-600 transition-all hover:bg-slate-200"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={function() {
                    setAppliedFilters(draftFilters)
                    setShowFilterMenu(false)
                  }}
                  className="rounded-2xl bg-teal-600 px-4 py-2 text-[12px] font-semibold text-white transition-all hover:bg-teal-700"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Button icon={Plus} onClick={openAddModal} className="h-11 rounded-2xl px-4 text-[13px]">
        Add Location
      </Button>
    </div>
  )

  const groupedColumns = [
    {
      key: 'srno',
      label: 'Sr. No.',
      headerClassName: 'text-center',
      cellClassName: 'py-1.5 text-center',
      render: function(_, __, index) {
        return <div className="text-center font-semibold text-slate-400">{index + 1}</div>
      },
    },
    {
      key: 'name',
      label: currentSection.label + ' Name',
      headerClassName: 'text-center',
      cellClassName: 'py-1.5 text-center',
      render: function(value) {
        return <div className="text-center font-semibold text-slate-700">{value}</div>
      },
    },
    {
      key: 'code',
      label: currentSection.label + ' Code',
      headerClassName: 'text-center',
      cellClassName: 'py-1.5 text-center',
      render: function(value) {
        return <div className="text-center font-semibold uppercase tracking-[0.16em] text-slate-500">{value}</div>
      },
    },
    {
      key: 'status',
      label: 'Status',
      headerClassName: 'text-center',
      cellClassName: 'py-1.5 text-center',
      render: function(value, row) {
        return (
          <div className="flex justify-center" onClick={function(event) { event.stopPropagation() }}>
            <CompactStatusToggle
              status={value}
              onChange={function(nextStatus) { handleGroupToggle(row.name, nextStatus) }}
            />
          </div>
        )
      },
    },
    {
      key: 'actions',
      label: 'Action',
      headerClassName: 'text-center',
      cellClassName: 'py-1.5 text-center',
      render: function(_, row) {
        return (
          <div className="flex justify-center" onClick={function(event) { event.stopPropagation() }}>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={function() { openGroupEdit(row) }}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-sky-600 transition-all hover:bg-sky-50"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={function() {
                  setDeleteTarget({
                    sectionKey: currentSection.key,
                    sectionLabel: currentSection.label,
                    value: row.name,
                    totalCount: row.totalCount,
                  })
                }}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-rose-600 transition-all hover:bg-rose-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        )
      },
    },
  ]

  return (
    <>
      <CommonPageLayout
        title="Location"
        subtitle="Manage country, state, city, area, and pincode records."
        stats={stats}
        action={headerActions}
      >
        <div className="space-y-2.5">
          <div className="rounded-[28px] border border-slate-200 bg-white p-2.5">
            <div className="grid grid-cols-2 gap-2 rounded-[22px] border border-slate-200 bg-slate-50/80 p-1.5 md:grid-cols-3 xl:grid-cols-5">
              {SECTION_CONFIGS.map(function(section) {
                const Icon = section.icon
                const active = activeTab === section.key
                return (
                  <button
                    key={section.key}
                    type="button"
                    onClick={function() { setActiveTab(section.key) }}
                    className={`group inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-[12px] font-semibold transition-all duration-200 ${
                      active
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm shadow-emerald-200/80'
                        : 'bg-transparent text-slate-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-teal-700'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${active ? 'text-white' : 'text-slate-500 group-hover:text-teal-700'}`} />
                    {section.label}
                  </button>
                )
              })}
            </div>
          </div>

          <Table
            columns={groupedColumns}
            data={groupedRows}
            rowKey="groupKey"
            variant="plain"
            density="compact"
            emptyMessage={`No ${currentSection.label.toLowerCase()} data found`}
            emptyDescription="Adjust the filters or add a new location record."
          />
        </div>
      </CommonPageLayout>

      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title="Add New Location"
        subtitle="Add all five fields so they appear in every navigation table."
        size="xl"
      >
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input label="Country" placeholder="Enter country" value={form.country} onChange={function(event) { updateField('country', event.target.value) }} error={errors.country} />
            <Input label="State" placeholder="Enter state" value={form.state} onChange={function(event) { updateField('state', event.target.value) }} error={errors.state} />
            <Input label="City" placeholder="Enter city" value={form.city} onChange={function(event) { updateField('city', event.target.value) }} error={errors.city} />
            <Input label="Area" placeholder="Enter area" value={form.area} onChange={function(event) { updateField('area', event.target.value) }} error={errors.area} />
            <Input label="Pincode" placeholder="Enter 6-digit pincode" value={form.pincode} onChange={function(event) { updateField('pincode', event.target.value.replace(/\\D/g, '').slice(0, 6)) }} error={errors.pincode} />
            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-slate-600">Status</label>
              <select value={form.status} onChange={function(event) { updateField('status', event.target.value) }} className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-3 text-[13px] font-medium text-slate-700 shadow-sm shadow-slate-100/60 transition-all focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-50">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button type="submit">Save Location</Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={!!groupEditor}
        onClose={closeGroupEdit}
        title={groupEditor ? 'Update ' + groupEditor.sectionLabel : 'Update Location'}
        subtitle={groupEditor ? 'Rename the selected ' + groupEditor.sectionLabel.toLowerCase() + ' for all linked records.' : ''}
        size="md"
      >
        <form onSubmit={handleGroupSave} className="space-y-5">
          <div className="space-y-4">
            <Input
              label={groupEditor ? groupEditor.sectionLabel + ' Name' : 'Name'}
              placeholder={groupEditor ? 'Enter ' + groupEditor.sectionLabel.toLowerCase() + ' name' : 'Enter name'}
              value={groupValue}
              onChange={function(event) {
                setGroupValue(event.target.value)
                if (groupError) setGroupError('')
              }}
              error={groupError}
            />

            {groupEditor ? (
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-[12px] text-slate-500">
                <span>Linked Records</span>
                <span className="font-semibold text-slate-700">{groupEditor.totalCount}</span>
              </div>
            ) : null}
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <Button type="button" variant="secondary" onClick={closeGroupEdit}>Cancel</Button>
            <Button type="submit">Update</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={function() { setDeleteTarget(null) }}
        onConfirm={handleDelete}
        title={deleteTarget ? 'Delete ' + deleteTarget.sectionLabel + '?' : 'Delete location?'}
        message={deleteTarget ? 'All linked records under this ' + deleteTarget.sectionLabel.toLowerCase() + ' will be removed from the master list.' : 'This location record will be removed from the master list.'}
      />
    </>
  )
}
