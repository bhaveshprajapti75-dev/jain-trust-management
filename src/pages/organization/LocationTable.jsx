import { useState, useImperativeHandle, forwardRef, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { Edit2, Trash2, Eye, X, AlertTriangle } from 'lucide-react'
import StatusToggle from '../../components/common/StatusToggle'
import CustomDropdown from '../../components/common/CustomDropdown'
import { useToast } from '../../components/common/Toast'

const LOCATION_STORAGE_KEY = 'location_v_final_production'
const MODAL_CLOSED_STATE = { isOpen: false, type: '', data: null }

const generateInitialData = () => {
  return {
    Country: [
      { id: 1, name: 'India', code: 'IND', status: true },
      { id: 2, name: 'USA', code: 'USA', status: true },
      { id: 3, name: 'UK', code: 'UK', status: true },
    ],
    State: [
      { id: 101, countryId: 1, name: 'Gujarat', code: 'GJ', status: true },
      { id: 102, countryId: 1, name: 'Maharashtra', code: 'MH', status: true },
      { id: 103, countryId: 2, name: 'California', code: 'CA', status: true },
    ],
    City: [
      { id: 201, stateId: 101, name: 'Ahmedabad', code: 'AMD', status: true },
      { id: 202, stateId: 101, name: 'Surat', code: 'SRT', status: true },
    ],
    Area: [
      { id: 301, cityId: 201, name: 'SG Highway', code: 'SGH', status: true },
      { id: 302, cityId: 201, name: 'Maninagar', code: 'MNR', status: true },
    ],
    Pincode: [
      { id: 401, areaId: 301, name: '380015', code: '380015', status: true },
    ],
  }
}

const LocationTable = forwardRef(({
  activeTab,
  searchTerm,
  filterValues,
  itemsPerPage,
  currentPage,
  setCurrentPage,
  setTotalEntries,
  onDataChange,
}, ref) => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(LOCATION_STORAGE_KEY)
    if (saved) return JSON.parse(saved)
    return generateInitialData()
  })
  const [modal, setModal] = useState(MODAL_CLOSED_STATE)
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null })
  const showToast = useToast()

  const getDefaultFormData = () => {
    const firstCountryId = data.Country[0]?.id || ''
    const firstStateId = data.State.find((state) => state.countryId === firstCountryId)?.id || ''
    const firstCityId = data.City.find((city) => city.stateId === firstStateId)?.id || ''
    const firstAreaId = data.Area.find((area) => area.cityId === firstCityId)?.id || ''

    return {
      status: true,
      name: '',
      code: '',
      countryId: firstCountryId,
      stateId: firstStateId,
      cityId: firstCityId,
      areaId: firstAreaId,
    }
  }

  const [formData, setFormData] = useState(getDefaultFormData)

  const countryById = useMemo(
    () => Object.fromEntries(data.Country.map((item) => [item.id, item])),
    [data.Country],
  )

  const stateById = useMemo(
    () => Object.fromEntries(data.State.map((item) => [item.id, item])),
    [data.State],
  )

  const cityById = useMemo(
    () => Object.fromEntries(data.City.map((item) => [item.id, item])),
    [data.City],
  )

  const areaById = useMemo(
    () => Object.fromEntries(data.Area.map((item) => [item.id, item])),
    [data.Area],
  )

  const getStateCount = (countryId) => data.State.filter((item) => item.countryId === countryId).length
  const getCityCount = (stateId) => data.City.filter((item) => item.stateId === stateId).length
  const getAreaCount = (cityId) => data.Area.filter((item) => item.cityId === cityId).length
  const getPincodeCount = (areaId) => data.Pincode.filter((item) => item.areaId === areaId).length

  const getStateName = (stateId) => stateById[stateId]?.name || '---'
  const getCityName = (cityId) => cityById[cityId]?.name || '---'
  const getAreaName = (areaId) => areaById[areaId]?.name || '---'
  const getCountryCode = (countryId) => countryById[countryId]?.code || '---'

  useEffect(() => {
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(data))
    if (onDataChange) {
      onDataChange({
        Country: data.Country.length,
        State: data.State.length,
        City: data.City.length,
        Area: data.Area.length,
        Pincode: data.Pincode.length,
      })
    }
  }, [data, onDataChange])

  useImperativeHandle(ref, () => ({
    openAddModal: () => {
      setFormData(getDefaultFormData())
      setModal({ isOpen: true, type: 'add', data: null })
    },
    getFilterOptions: (type) => data[type] || [],
  }), [activeTab, data])

  const closeModal = () => setModal(MODAL_CLOSED_STATE)

  const updateStatus = (id, currentStatus) => {
    const nextStatus = !currentStatus
    const updatedRows = data[activeTab].map((item) => (
      item.id === id ? { ...item, status: nextStatus } : item
    ))

    setData({ ...data, [activeTab]: updatedRows })

    if (modal.isOpen && modal.data?.id === id) {
      setModal((prev) => ({
        ...prev,
        data: { ...prev.data, status: nextStatus },
      }))
    }

    showToast(`${activeTab} status updated successfully`, 'success')
  }

  const prepareFormForEdit = (row) => {
    const prepared = {
      ...getDefaultFormData(),
      ...row,
      status: row.status ?? true,
      name: row.name || '',
      code: row.code || '',
    }

    if (activeTab === 'City') {
      const state = stateById[row.stateId]
      prepared.countryId = state?.countryId || prepared.countryId
    }

    if (activeTab === 'Area') {
      const city = cityById[row.cityId]
      const state = stateById[city?.stateId]
      prepared.stateId = city?.stateId || prepared.stateId
      prepared.countryId = state?.countryId || prepared.countryId
    }

    if (activeTab === 'Pincode') {
      const area = areaById[row.areaId]
      const city = cityById[area?.cityId]
      const state = stateById[city?.stateId]
      prepared.cityId = area?.cityId || prepared.cityId
      prepared.stateId = city?.stateId || prepared.stateId
      prepared.countryId = state?.countryId || prepared.countryId
      prepared.code = row.code || ''
      prepared.name = row.code || row.name || ''
    }

    return prepared
  }

  const openViewModal = (row) => {
    setModal({ isOpen: true, type: 'view', data: row })
  }

  const openEditModal = (row) => {
    setFormData(prepareFormForEdit(row))
    setModal({ isOpen: true, type: 'edit', data: row })
  }

  const validateForm = () => {
    const trimmedName = String(formData.name || '').trim()
    const trimmedCode = String(formData.code || '').trim()

    if (activeTab !== 'Country' && !formData.countryId) return 'Please select a country.'

    if (activeTab === 'Country' && !trimmedName) {
      return 'Country name is required.'
    }

    if (activeTab === 'Country' && !trimmedCode) {
      return 'Country code is required.'
    }

    if (['City', 'Area', 'Pincode'].includes(activeTab) && !formData.stateId) {
      return 'Please select a state.'
    }

    if (['Area', 'Pincode'].includes(activeTab) && !formData.cityId) {
      return 'Please select a city.'
    }

    if (activeTab === 'Pincode' && !formData.areaId) {
      return 'Please select an area.'
    }

    if (activeTab === 'State' && !String(formData.name || '').trim()) {
      return 'State name is required.'
    }

    if (activeTab === 'State' && !String(formData.code || '').trim()) {
      return 'State code is required.'
    }

    if (activeTab === 'City' && !String(formData.name || '').trim()) {
      return 'City name is required.'
    }

    if (activeTab === 'Area' && !String(formData.name || '').trim()) {
      return 'Area name is required.'
    }

    if (activeTab === 'Pincode') {
      const pincode = String(formData.code || '').trim()
      if (!pincode) return 'Pincode is required.'
      if (!/^\d{6}$/.test(pincode)) return 'Pincode must be 6 digits.'
    }

    return ''
  }

  const buildPayload = () => {
    const trimmedName = String(formData.name || '').trim()
    const trimmedCode = String(formData.code || '').trim()

    if (activeTab === 'Country') {
      return {
        status: formData.status,
        name: trimmedName,
        code: trimmedCode.toUpperCase(),
      }
    }

    if (activeTab === 'State') {
      return {
        status: formData.status,
        countryId: Number(formData.countryId),
        name: trimmedName,
        code: trimmedCode.toUpperCase(),
      }
    }

    if (activeTab === 'City') {
      return {
        status: formData.status,
        stateId: Number(formData.stateId),
        name: trimmedName,
        code: trimmedCode || trimmedName.slice(0, 3).toUpperCase(),
      }
    }

    if (activeTab === 'Area') {
      return {
        status: formData.status,
        cityId: Number(formData.cityId),
        name: trimmedName,
        code: trimmedCode || trimmedName.slice(0, 3).toUpperCase(),
      }
    }

    return {
      status: formData.status,
      areaId: Number(formData.areaId),
      name: trimmedCode,
      code: trimmedCode,
    }
  }

  const handleSave = () => {
    const validationMessage = validateForm()
    if (validationMessage) {
      showToast(validationMessage, 'error')
      return
    }

    const payload = buildPayload()

    if (modal.type === 'add') {
      const newEntry = { ...payload, id: Date.now() }
      setData((prev) => ({ ...prev, [activeTab]: [...prev[activeTab], newEntry] }))
      showToast(`${activeTab} added successfully`, 'success')
    }

    if (modal.type === 'edit') {
      setData((prev) => ({
        ...prev,
        [activeTab]: prev[activeTab].map((item) => (
          item.id === modal.data.id ? { ...payload, id: modal.data.id } : item
        )),
      }))
      showToast(`${activeTab} updated successfully`, 'success')
    }

    closeModal()
  }

  const filteredData = useMemo(() => {
    const sourceRows = data[activeTab] || []

    return sourceRows.filter((item) => {
      const matchesSearch = (item.name || '').toLowerCase().includes(searchTerm.toLowerCase())
        || (item.code || '').toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = filterValues.status === 'all'
        ? true
        : filterValues.status === 'active'
          ? item.status === true
          : item.status === false

      let matchesParent = true

      if (activeTab === 'State' && filterValues.countryId !== 'all') {
        matchesParent = item.countryId === Number(filterValues.countryId)
      }

      if (activeTab === 'City' && filterValues.stateId !== 'all') {
        matchesParent = item.stateId === Number(filterValues.stateId)
      }

      if (activeTab === 'Area' && filterValues.cityId !== 'all') {
        matchesParent = item.cityId === Number(filterValues.cityId)
      }

      if (activeTab === 'Pincode') {
        const matchesArea = filterValues.areaId === 'all' || item.areaId === Number(filterValues.areaId)
        const matchesPin = filterValues.pincodeNumber === '' || String(item.code).includes(filterValues.pincodeNumber)
        matchesParent = matchesArea && matchesPin
      }

      return matchesSearch && matchesStatus && matchesParent
    })
  }, [data, activeTab, searchTerm, filterValues])

  useEffect(() => {
    setTotalEntries(filteredData.length)
  }, [filteredData.length, setTotalEntries])

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage))
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [filteredData.length, itemsPerPage, currentPage, setCurrentPage])

  const paginatedData = useMemo(
    () => filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [filteredData, currentPage, itemsPerPage],
  )

  const availableStates = useMemo(() => (
    formData.countryId
      ? data.State.filter((item) => item.countryId === Number(formData.countryId))
      : []
  ), [data.State, formData.countryId])

  const availableCities = useMemo(() => (
    formData.stateId
      ? data.City.filter((item) => item.stateId === Number(formData.stateId))
      : []
  ), [data.City, formData.stateId])

  const availableAreas = useMemo(() => (
    formData.cityId
      ? data.Area.filter((item) => item.cityId === Number(formData.cityId))
      : []
  ), [data.Area, formData.cityId])

  const handleCountryChange = (value) => {
    const countryId = Number(value)
    const nextStates = data.State.filter((item) => item.countryId === countryId)
    const nextStateId = nextStates[0]?.id || ''
    const nextCities = data.City.filter((item) => item.stateId === nextStateId)
    const nextCityId = nextCities[0]?.id || ''
    const nextAreas = data.Area.filter((item) => item.cityId === nextCityId)
    const nextAreaId = nextAreas[0]?.id || ''

    setFormData((prev) => ({
      ...prev,
      countryId,
      stateId: nextStateId,
      cityId: nextCityId,
      areaId: nextAreaId,
    }))
  }

  const handleStateChange = (value) => {
    const stateId = Number(value)
    const nextCities = data.City.filter((item) => item.stateId === stateId)
    const nextCityId = nextCities[0]?.id || ''
    const nextAreas = data.Area.filter((item) => item.cityId === nextCityId)
    const nextAreaId = nextAreas[0]?.id || ''

    setFormData((prev) => ({
      ...prev,
      stateId,
      cityId: nextCityId,
      areaId: nextAreaId,
    }))
  }

  const handleCityChange = (value) => {
    const cityId = Number(value)
    const nextAreas = data.Area.filter((item) => item.cityId === cityId)
    const nextAreaId = nextAreas[0]?.id || ''

    setFormData((prev) => ({
      ...prev,
      cityId,
      areaId: nextAreaId,
    }))
  }

  const handleDelete = () => {
    const updatedRows = data[activeTab].filter((item) => item.id !== deleteConfirm.id)
    setData({ ...data, [activeTab]: updatedRows })

    if (paginatedData.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }

    setDeleteConfirm({ show: false, id: null })
    showToast(`${activeTab} deleted successfully`, 'delete')
  }

  const getViewDetails = (item) => {
    if (activeTab === 'Country') {
      return [
        { label: 'Country Name', value: item.name },
        { label: 'Country Code', value: item.code },
        { label: 'State Count', value: getStateCount(item.id) },
      ]
    }

    if (activeTab === 'State') {
      return [
        { label: 'State Name', value: item.name },
        { label: 'State Code', value: item.code },
        { label: 'Country Code', value: getCountryCode(item.countryId) },
        { label: 'City Count', value: getCityCount(item.id) },
      ]
    }

    if (activeTab === 'City') {
      return [
        { label: 'City Name', value: item.name },
        { label: 'State Name', value: getStateName(item.stateId) },
        { label: 'Area Count', value: getAreaCount(item.id) },
      ]
    }

    if (activeTab === 'Area') {
      const city = cityById[item.cityId]
      return [
        { label: 'Area Name', value: item.name },
        { label: 'City Name', value: city?.name || '---' },
        { label: 'State Name', value: getStateName(city?.stateId) },
        { label: 'Pincode Count', value: getPincodeCount(item.id) },
      ]
    }

    if (activeTab === 'Pincode') {
      const area = areaById[item.areaId]
      const city = cityById[area?.cityId]
      return [
        { label: 'Pincode', value: item.code },
        { label: 'Area Name', value: area?.name || '---' },
        { label: 'City Name', value: city?.name || '---' },
        { label: 'State Name', value: getStateName(city?.stateId) },
      ]
    }

    return []
  }

  const actionButtons = (row) => (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => openViewModal(row)}
        className="w-9 h-9 flex items-center justify-center rounded-full text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200"
        title="View"
      >
        <Eye size={16} strokeWidth={2} />
      </button>

      <button
        onClick={() => openEditModal(row)}
        className="w-9 h-9 flex items-center justify-center rounded-full text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200"
        title="Edit"
      >
        <Edit2 size={16} strokeWidth={2} />
      </button>

      <button
        onClick={() => setDeleteConfirm({ show: true, id: row.id })}
        className="w-9 h-9 flex items-center justify-center rounded-full text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200"
        title="Delete"
      >
        <Trash2 size={16} strokeWidth={2} />
      </button>
    </div>
  )

  const tableColumns = useMemo(() => {
    const srNoColumn = {
      label: 'Sr. No.',
      render: (_, index) => (
        <span className="text-sm font-medium text-slate-500">{(currentPage - 1) * itemsPerPage + index + 1}</span>
      ),
    }

    if (activeTab === 'Country') {
      return [
        srNoColumn,
        {
          label: 'Country Name',
          render: (row) => (
            <button
              type="button"
              onClick={() => openViewModal(row)}
              className="text-sm font-medium text-emerald-700 hover:underline"
            >
              {row.name}
            </button>
          ),
        },
        {
          label: 'Country Code',
          render: (row) => <span className="text-sm font-medium text-slate-700">{row.code}</span>,
        },
        {
          label: 'State Count',
          render: (row) => <span className="text-sm font-medium text-slate-700">{getStateCount(row.id)}</span>,
        },
        {
          label: 'Status',
          render: (row) => (
            <div className="flex justify-center">
              <StatusToggle status={row.status} onToggle={() => updateStatus(row.id, row.status)} />
            </div>
          ),
        },
        {
          label: 'Action',
          render: (row) => actionButtons(row),
        },
      ]
    }

    if (activeTab === 'State') {
      return [
        srNoColumn,
        {
          label: 'State Name',
          render: (row) => (
            <button
              type="button"
              onClick={() => openViewModal(row)}
              className="text-sm font-medium text-emerald-700 hover:underline"
            >
              {row.name}
            </button>
          ),
        },
        {
          label: 'Country Code',
          render: (row) => <span className="text-sm font-medium text-slate-700">{getCountryCode(row.countryId)}</span>,
        },
        {
          label: 'State Code',
          render: (row) => <span className="text-sm font-medium text-slate-700">{row.code || '-'}</span>,
        },
        {
          label: 'City Count',
          render: (row) => <span className="text-sm font-medium text-slate-700">{getCityCount(row.id)}</span>,
        },
        {
          label: 'Status',
          render: (row) => (
            <div className="flex justify-center">
              <StatusToggle status={row.status} onToggle={() => updateStatus(row.id, row.status)} />
            </div>
          ),
        },
        {
          label: 'Action',
          render: (row) => actionButtons(row),
        },
      ]
    }

    if (activeTab === 'City') {
      return [
        srNoColumn,
        {
          label: 'City Name',
          render: (row) => (
            <button
              type="button"
              onClick={() => openViewModal(row)}
              className="text-sm font-medium text-emerald-700 hover:underline"
            >
              {row.name}
            </button>
          ),
        },
        {
          label: 'State Name',
          render: (row) => <span className="text-sm font-medium text-slate-700">{getStateName(row.stateId)}</span>,
        },
        {
          label: 'Area Count',
          render: (row) => <span className="text-sm font-medium text-slate-700">{getAreaCount(row.id)}</span>,
        },
        {
          label: 'Status',
          render: (row) => (
            <div className="flex justify-center">
              <StatusToggle status={row.status} onToggle={() => updateStatus(row.id, row.status)} />
            </div>
          ),
        },
        {
          label: 'Action',
          render: (row) => actionButtons(row),
        },
      ]
    }

    if (activeTab === 'Area') {
      return [
        srNoColumn,
        {
          label: 'Area Name',
          render: (row) => (
            <button
              type="button"
              onClick={() => openViewModal(row)}
              className="text-sm font-medium text-emerald-700 hover:underline"
            >
              {row.name}
            </button>
          ),
        },
        {
          label: 'City Name',
          render: (row) => <span className="text-sm font-medium text-slate-700">{getCityName(row.cityId)}</span>,
        },
        {
          label: 'State Name',
          render: (row) => {
            const city = cityById[row.cityId]
            return <span className="text-sm font-medium text-slate-700">{getStateName(city?.stateId)}</span>
          },
        },
        {
          label: 'Pincode Count',
          render: (row) => <span className="text-sm font-medium text-slate-700">{getPincodeCount(row.id)}</span>,
        },
        {
          label: 'Status',
          render: (row) => (
            <div className="flex justify-center">
              <StatusToggle status={row.status} onToggle={() => updateStatus(row.id, row.status)} />
            </div>
          ),
        },
        {
          label: 'Action',
          render: (row) => actionButtons(row),
        },
      ]
    }

    return [
      srNoColumn,
      {
        label: 'Pincode',
        render: (row) => (
          <button
            type="button"
            onClick={() => openViewModal(row)}
            className="text-sm font-medium text-emerald-700 hover:underline"
          >
            {row.code}
          </button>
        ),
      },
      {
        label: 'Area Name',
        render: (row) => <span className="text-sm font-medium text-slate-700">{getAreaName(row.areaId)}</span>,
      },
      {
        label: 'City Name',
        render: (row) => {
          const area = areaById[row.areaId]
          return <span className="text-sm font-medium text-slate-700">{getCityName(area?.cityId)}</span>
        },
      },
      {
        label: 'Status',
        render: (row) => (
          <div className="flex justify-center">
            <StatusToggle status={row.status} onToggle={() => updateStatus(row.id, row.status)} />
          </div>
        ),
      },
      {
        label: 'Action',
        render: (row) => actionButtons(row),
      },
    ]
  }, [
    activeTab,
    areaById,
    cityById,
    currentPage,
    itemsPerPage,
    stateById,
  ])

  const isViewModal = modal.type === 'view'
  const viewDetails = modal.data ? getViewDetails(modal.data) : []

  const showCountryField = ['State', 'City', 'Area', 'Pincode'].includes(activeTab)
  const showStateField = ['City', 'Area', 'Pincode'].includes(activeTab)
  const showCityField = ['Area', 'Pincode'].includes(activeTab)
  const showAreaField = activeTab === 'Pincode'
  const hasCodeField = ['Country', 'State'].includes(activeTab)
  const hasPincodeField = activeTab === 'Pincode'

  const showNameField = ['Country', 'State', 'City', 'Area'].includes(activeTab)
  const nameLabel = activeTab === 'Country'
    ? 'Country Name'
    : activeTab === 'State'
      ? 'State Name'
      : activeTab === 'City'
        ? 'City Name'
        : 'Area Name'

  const inputClassName = 'w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none focus:border-emerald-600 transition-colors'
  const formFieldCount = [
    showCountryField,
    showStateField,
    showCityField,
    showAreaField,
    showNameField,
    hasCodeField,
    hasPincodeField,
  ].filter(Boolean).length
  const statusColumnClass = formFieldCount % 2 === 0 ? 'md:col-span-2' : ''

  return (
    <div className="w-full font-sans antialiased text-slate-600">
      <div className="overflow-hidden border border-gray-300 rounded-lg bg-white">
        <div className="m-3 mt-3">
          <table className="w-full table-fixed">
            <thead className="bg-emerald-800 text-white h-10 text-base font-semibold">
              <tr>
                {tableColumns.map((column, idx) => (
                  <th
                    key={column.label}
                    className={`${idx === 0 ? 'text-left pl-4' : 'text-center'} ${idx === tableColumns.length - 1 ? 'pr-4' : ''}`}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm">
              {paginatedData.length > 0 ? (
                paginatedData.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`${index === paginatedData.length - 1 ? '' : 'border-b'} border-gray-300 h-[45px]`}
                  >
                    {tableColumns.map((column, idx) => (
                      <td
                        key={`${row.id}-${column.label}`}
                        className={`${idx === 0 ? 'text-left pl-4' : 'text-center'} ${idx === tableColumns.length - 1 ? 'pr-4' : ''} py-2 align-middle`}
                      >
                        {column.render(row, index)}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={tableColumns.length} className="h-24 text-center text-sm text-slate-500">
                    No matching records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal.isOpen && createPortal(
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative w-full max-w-3xl rounded-xl bg-white shadow-xl max-h-[85vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-[#1A1A1A]">
                {isViewModal ? `View ${activeTab} Details` : `${modal.type === 'add' ? 'Add New' : 'Edit'} ${activeTab}`}
              </h3>
              <button onClick={closeModal} className="p-1 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-5 overflow-y-auto">
              {isViewModal ? (
                <div className="border border-slate-200 rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {viewDetails.map((field) => (
                    <div key={field.label}>
                      <label className="text-sm font-bold text-emerald-800">{field.label}</label>
                      <div className="mt-2 h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 flex items-center text-sm font-medium text-slate-700">
                        {field.value || '-'}
                      </div>
                    </div>
                  ))}

                  <div className="md:col-span-2">
                    <label className="text-sm font-bold text-emerald-800">Status</label>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${modal.data?.status ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                        {modal.data?.status ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {showCountryField && (
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">Country <span className="text-rose-500">*</span></label>
                      <CustomDropdown
                        value={String(formData.countryId || '')}
                        onChange={handleCountryChange}
                        placeholder="Select Country"
                        items={data.Country.map((country) => ({ label: country.name, value: String(country.id) }))}
                        className="w-full"
                        triggerClassName="h-12 px-4 rounded-xl text-sm"
                      />
                    </div>
                  )}

                  {showStateField && (
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">State <span className="text-rose-500">*</span></label>
                      <CustomDropdown
                        value={String(formData.stateId || '')}
                        onChange={handleStateChange}
                        placeholder="Select State"
                        items={availableStates.map((state) => ({ label: state.name, value: String(state.id) }))}
                        className="w-full"
                        triggerClassName="h-12 px-4 rounded-xl text-sm"
                      />
                    </div>
                  )}

                  {showCityField && (
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">City <span className="text-rose-500">*</span></label>
                      <CustomDropdown
                        value={String(formData.cityId || '')}
                        onChange={handleCityChange}
                        placeholder="Select City"
                        items={availableCities.map((city) => ({ label: city.name, value: String(city.id) }))}
                        className="w-full"
                        triggerClassName="h-12 px-4 rounded-xl text-sm"
                      />
                    </div>
                  )}

                  {showAreaField && (
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">Area <span className="text-rose-500">*</span></label>
                      <CustomDropdown
                        value={String(formData.areaId || '')}
                        onChange={(value) => setFormData((prev) => ({ ...prev, areaId: Number(value) }))}
                        placeholder="Select Area"
                        items={availableAreas.map((area) => ({ label: area.name, value: String(area.id) }))}
                        className="w-full"
                        triggerClassName="h-12 px-4 rounded-xl text-sm"
                      />
                    </div>
                  )}

                  {showNameField && (
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">{nameLabel} <span className="text-rose-500">*</span></label>
                      <input
                        value={formData.name || ''}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder={`Enter ${nameLabel}`}
                        className={inputClassName}
                      />
                    </div>
                  )}

                  {hasCodeField && (
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">{activeTab === 'Country' ? 'Country Code' : 'State Code'} <span className="text-rose-500">*</span></label>
                      <input
                        value={formData.code || ''}
                        onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                        placeholder={`Enter ${activeTab === 'Country' ? 'Country Code' : 'State Code'}`}
                        className={`${inputClassName} uppercase`}
                      />
                    </div>
                  )}

                  {activeTab === 'Pincode' && (
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">Pincode <span className="text-rose-500">*</span></label>
                      <input
                        value={formData.code || ''}
                        onChange={(e) => {
                          const nextValue = e.target.value.replace(/[^0-9]/g, '').slice(0, 6)
                          setFormData((prev) => ({ ...prev, code: nextValue, name: nextValue }))
                        }}
                        placeholder="Enter Pincode"
                        inputMode="numeric"
                        className={inputClassName}
                      />
                    </div>
                  )}

                  <div className={`${statusColumnClass} space-y-1.5`}>
                    <label className="text-sm font-semibold text-slate-700">Status</label>
                    <div className="h-12 px-4 border border-slate-200 rounded-xl flex items-center justify-between bg-white">
                      <span className="text-sm font-medium text-slate-700">{formData.status ? 'Active' : 'Inactive'}</span>
                      <StatusToggle status={formData.status} onToggle={() => setFormData((prev) => ({ ...prev, status: !prev.status }))} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!isViewModal && (
              <div className="px-6 py-3 border-t border-slate-200 bg-white flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 w-36 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 w-36 rounded-lg text-white bg-emerald-700 hover:bg-emerald-800 text-base"
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>,
        document.body,
      )}

      {deleteConfirm.show && createPortal(
        <div className="fixed inset-0 z-[1350] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative w-full max-w-xs rounded-xl p-6 text-center bg-white shadow-xl">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} strokeWidth={2.5} />
            </div>
            <h3 className="font-bold text-slate-800 text-sm mb-1">Confirm Delete?</h3>
            <p className="text-xs text-slate-500">This action cannot be undone.</p>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setDeleteConfirm({ show: false, id: null })}
                className="flex-1 h-9 px-4 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all"
              >
                No
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 h-9 px-4 text-xs font-bold text-white bg-rose-600 border border-rose-600 hover:bg-rose-700 rounded-lg transition-all"
              >
                Yes
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  )
})

export default LocationTable
