import { useEffect, useMemo, useState } from 'react'
import { Building2, Edit2, Globe2, Hash, MapPinned, Navigation, Plus, Search, Trash2 } from 'lucide-react'
import Button from '../../components/common/Button'
import CommonPageLayout from '../../components/common/CommonPageLayout'
import ConfirmModal from '../../components/common/ConfirmModal'
import Input from '../../components/common/Input'
import Modal from '../../components/common/Modal'
import Table from '../../components/common/Table'
import UserStatusToggle from '../../components/users/UserStatusToggle'

const STORAGE_KEY = 'master_locations'
const INITIAL_DATA = [
  { id: 1, country: 'India', state: 'Gujarat', city: 'Ahmedabad', area: 'Bhadaj', pincode: '380060', status: 'Active' },
  { id: 2, country: 'India', state: 'Gujarat', city: 'Bhavnagar', area: 'Palitana', pincode: '364270', status: 'Active' },
  { id: 3, country: 'India', state: 'Maharashtra', city: 'Mumbai', area: 'Andheri West', pincode: '400053', status: 'Inactive' },
  { id: 4, country: 'India', state: 'Rajasthan', city: 'Jaipur', area: 'Malviya Nagar', pincode: '302017', status: 'Active' },
  { id: 5, country: 'India', state: 'Karnataka', city: 'Bangalore', area: 'Indiranagar', pincode: '560038', status: 'Active' },
]

const EMPTY_FORM = {
  country: '',
  state: '',
  city: '',
  area: '',
  pincode: '',
  status: 'Active',
}

function readLocations() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const parsed = stored ? JSON.parse(stored) : INITIAL_DATA
    return Array.isArray(parsed) && parsed.length ? parsed : INITIAL_DATA
  } catch {
    return INITIAL_DATA
  }
}

export default function LocationMaster() {
  const [search, setSearch] = useState('')
  const [locations, setLocations] = useState(function() {
    return readLocations()
  })
  const [showModal, setShowModal] = useState(false)
  const [editingLocation, setEditingLocation] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  useEffect(function() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(locations))
  }, [locations])

  const stats = useMemo(function() {
    const activeCount = locations.filter(function(item) { return item.status === 'Active' }).length
    const cities = new Set(locations.map(function(item) { return item.city })).size
    return [
      { title: 'Total Locations', value: String(locations.length).padStart(2, '0'), icon: MapPinned, color: 'teal' },
      { title: 'Active Records', value: String(activeCount).padStart(2, '0'), icon: Globe2, color: 'emerald' },
      { title: 'Cities Covered', value: String(cities).padStart(2, '0'), icon: Navigation, color: 'sky' },
    ]
  }, [locations])

  const filteredLocations = useMemo(function() {
    const query = search.trim().toLowerCase()
    if (!query) return locations

    return locations.filter(function(item) {
      return [item.country, item.state, item.city, item.area, item.pincode, item.status].some(function(value) {
        return String(value || '').toLowerCase().includes(query)
      })
    })
  }, [locations, search])

  const sectionConfigs = [
    { key: 'country', label: 'Country', icon: Globe2, blurb: 'National mapping' },
    { key: 'state', label: 'State', icon: MapPinned, blurb: 'Regional control' },
    { key: 'city', label: 'City', icon: Navigation, blurb: 'Operational cities' },
    { key: 'area', label: 'Area', icon: Building2, blurb: 'Local clusters' },
    { key: 'pincode', label: 'Pincode', icon: Hash, blurb: 'Postal coverage' },
  ]

  function updateField(key, value) {
    setForm(function(current) {
      return { ...current, [key]: value }
    })
  }

  function openAddModal() {
    setEditingLocation(null)
    setForm(EMPTY_FORM)
    setErrors({})
    setShowModal(true)
  }

  function openEditModal(location) {
    setEditingLocation(location)
    setForm({
      country: location.country || '',
      state: location.state || '',
      city: location.city || '',
      area: location.area || '',
      pincode: location.pincode || '',
      status: location.status || 'Active',
    })
    setErrors({})
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditingLocation(null)
    setForm(EMPTY_FORM)
    setErrors({})
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

    if (editingLocation) {
      setLocations(function(current) {
        return current.map(function(item) {
          return item.id === editingLocation.id ? { ...item, ...payload } : item
        })
      })
    } else {
      setLocations(function(current) {
        const nextId = current.reduce(function(maxId, item) { return Math.max(maxId, item.id) }, 0) + 1
        return current.concat([{ id: nextId, ...payload }])
      })
    }

    closeModal()
  }

  function handleDelete() {
    setLocations(function(current) {
      return current.filter(function(item) { return item.id !== deleteId })
    })
    setDeleteId(null)
  }

  function handleToggle(id, nextStatus) {
    setLocations(function(current) {
      return current.map(function(item) {
        return item.id === id ? { ...item, status: nextStatus } : item
      })
    })
  }

  function handleGroupedToggle(key, value, nextStatus) {
    setLocations(function(current) {
      return current.map(function(item) {
        return item[key] === value ? { ...item, status: nextStatus } : item
      })
    })
  }

  const groupedSections = useMemo(function() {
    return sectionConfigs.map(function(section) {
      const groups = new Map()

      filteredLocations.forEach(function(item) {
        const value = item[section.key]
        if (!value) return

        if (!groups.has(value)) {
          groups.set(value, {
            groupKey: section.key + '-' + value,
            name: value,
            totalCount: 0,
            activeCount: 0,
            status: 'Inactive',
          })
        }

        const current = groups.get(value)
        current.totalCount += 1
        if (item.status === 'Active') current.activeCount += 1
        current.status = current.activeCount === current.totalCount ? 'Active' : 'Inactive'
      })

      return {
        ...section,
        data: Array.from(groups.values()),
      }
    })
  }, [filteredLocations])

  const groupedColumns = [
    {
      key: 'srno',
      label: 'Sr. No.',
      render: function(_, __, index) {
        return <div className="text-center font-semibold text-slate-400">{index + 1}</div>
      },
    },
    {
      key: 'name',
      label: 'Name',
      render: function(value) {
        return <div className="text-center font-semibold text-slate-700">{value}</div>
      },
    },
    {
      key: 'totalCount',
      label: 'Linked Records',
      render: function(value) {
        return <div className="text-center font-semibold text-slate-700">{value}</div>
      },
    },
    {
      key: 'activeCount',
      label: 'Active',
      render: function(value) {
        return <div className="text-center font-semibold text-emerald-700">{value}</div>
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: function(value, row) {
        return (
          <div className="flex justify-center">
            <UserStatusToggle
              status={value}
              onChange={function(nextStatus) { handleGroupedToggle(row.groupKey.split('-')[0], row.name, nextStatus) }}
            />
          </div>
        )
      },
    },
  ]

  const detailColumns = [
    {
      key: 'srno',
      label: 'Sr. No.',
      render: function(_, __, index) {
        return <div className="text-center font-semibold text-slate-400">{index + 1}</div>
      },
    },
    {
      key: 'country',
      label: 'Country',
      render: function(value) {
        return <div className="text-center font-semibold text-slate-700">{value}</div>
      },
    },
    {
      key: 'state',
      label: 'State',
      render: function(value) {
        return <div className="text-center font-semibold text-slate-700">{value}</div>
      },
    },
    {
      key: 'city',
      label: 'City',
      render: function(value) {
        return <div className="text-center font-semibold text-slate-700">{value}</div>
      },
    },
    {
      key: 'area',
      label: 'Area',
      render: function(value) {
        return <div className="text-center font-semibold text-slate-700">{value}</div>
      },
    },
    {
      key: 'pincode',
      label: 'Pincode',
      render: function(value) {
        return <div className="text-center font-semibold text-slate-700">{value}</div>
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: function(value, row) {
        return (
          <div className="flex justify-center">
            <UserStatusToggle
              status={value}
              onChange={function(nextStatus) { handleToggle(row.id, nextStatus) }}
            />
          </div>
        )
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: function(_, row) {
        return (
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={function() { openEditModal(row) }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-sky-600 transition-all hover:bg-sky-50"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={function() { setDeleteId(row.id) }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-rose-600 transition-all hover:bg-rose-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )
      },
    },
  ]

  return (
    <>
      <CommonPageLayout
        title="Location Hierarchy"
        subtitle="Manage country, state, city, area, and pincode records from one clean location master."
        stats={stats}
      >
        <div className="space-y-6">
          <div className="rounded-[30px] border border-slate-200 bg-gradient-to-r from-white via-slate-50/70 to-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.26em] text-slate-400">Location master</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Company-level address control</h2>
                <p className="mt-2 max-w-2xl text-sm text-slate-500">
                  Keep all five fields together in one table so new location records, status updates, edits, and deletes stay easy to manage.
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 md:flex-row xl:w-auto">
                <div className="relative min-w-0 md:w-[360px]">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search country, state, city, area, or pincode..."
                    value={search}
                    onChange={function(event) { setSearch(event.target.value) }}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-[13px] text-slate-700 shadow-sm outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-50"
                  />
                </div>
                <Button icon={Plus} onClick={openAddModal}>Add Location</Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {groupedSections.map(function(section) {
              const Icon = section.icon

              return (
                <div key={section.key} className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50 text-slate-500">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-[16px] font-semibold text-slate-900">{section.label} Table</h3>
                        <p className="text-[12px] text-slate-500">{section.blurb}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-600">{section.data.length} rows</span>
                  </div>

                  <Table
                    columns={groupedColumns.map(function(column) {
                      if (column.key !== 'status') {
                        return {
                          ...column,
                          label: column.key === 'name' ? section.label : column.label,
                        }
                      }

                      return {
                        ...column,
                        render: function(value, row) {
                          return (
                            <div className="flex justify-center">
                              <UserStatusToggle
                                status={value}
                                onChange={function(nextStatus) { handleGroupedToggle(section.key, row.name, nextStatus) }}
                              />
                            </div>
                          )
                        },
                      }
                    })}
                    data={section.data}
                    rowKey="groupKey"
                    emptyMessage={`No ${section.label.toLowerCase()} records found`}
                    emptyDescription="Try a different search or add a new location record."
                  />
                </div>
              )
            })}
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-[16px] font-semibold text-slate-900">Detailed Location Records</h3>
                <p className="text-[12px] text-slate-500">Full master list with edit, delete, and record-level status toggle.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-600">{filteredLocations.length} records</span>
            </div>

            <Table
              columns={detailColumns}
              data={filteredLocations}
              emptyMessage="No locations found"
              emptyDescription="Try a different search or add a new location record."
            />
          </div>
        </div>
      </CommonPageLayout>

      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingLocation ? 'Update Location' : 'Add New Location'}
        subtitle={editingLocation ? 'Edit the full address record and save the latest status.' : 'Add all five location fields in one place so user forms can reuse them.'}
        size="xl"
      >
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input label="Country" placeholder="Enter country" value={form.country} onChange={function(event) { updateField('country', event.target.value) }} error={errors.country} />
            <Input label="State" placeholder="Enter state" value={form.state} onChange={function(event) { updateField('state', event.target.value) }} error={errors.state} />
            <Input label="City" placeholder="Enter city" value={form.city} onChange={function(event) { updateField('city', event.target.value) }} error={errors.city} />
            <Input label="Area" placeholder="Enter area" value={form.area} onChange={function(event) { updateField('area', event.target.value) }} error={errors.area} />
            <Input label="Pincode" placeholder="Enter 6-digit pincode" value={form.pincode} onChange={function(event) { updateField('pincode', event.target.value.replace(/\D/g, '').slice(0, 6)) }} error={errors.pincode} />
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
            <Button type="submit">{editingLocation ? 'Update Location' : 'Save Location'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={function() { setDeleteId(null) }}
        onConfirm={handleDelete}
        title="Delete location?"
        message="This location record will be removed from the master list."
      />
    </>
  )
}
