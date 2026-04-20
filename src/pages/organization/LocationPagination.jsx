import React from 'react'
import CustomDropdown from '../../components/ui/CustomDropdown'

export default function LocationPagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onRecordsPerPageChange,
  rowsPerPageOptions = [30, 50, 100],
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startRecord = (currentPage - 1) * itemsPerPage + 1
  const endRecord = Math.min(currentPage * itemsPerPage, totalItems)

  if (totalItems === 0) return null

  const handlePageChange = (page) => {
    onPageChange(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getPageNumbers = () => {
    const pages = []
    const nums = new Set([1, totalPages])

    for (let i = 1; i <= 4; i += 1) {
      if (i <= totalPages) nums.add(i)
    }

    if (currentPage > 1 && currentPage < totalPages) {
      nums.add(currentPage - 1)
      nums.add(currentPage)
      nums.add(currentPage + 1)
    }

    const sorted = Array.from(nums)
      .sort((a, b) => a - b)
      .filter((n) => n > 0 && n <= totalPages)

    let prev = null
    for (const num of sorted) {
      if (prev !== null && num - prev > 1) {
        pages.push('...')
      }
      pages.push(num)
      prev = num
    }

    return pages
  }

  return (
    <div className="flex flex-wrap justify-between items-center gap-4 pt-2 text-[13px] text-slate-500 w-full">
      <div className="flex items-center gap-2">
        <span className="whitespace-nowrap">Showing</span>
        <CustomDropdown
          value={itemsPerPage}
          onChange={(value) => {
            onRecordsPerPageChange(Number(value))
            handlePageChange(1)
          }}
          placeholder="Rows"
          items={rowsPerPageOptions.map((option) => ({ label: String(option), value: option }))}
          className="w-16"
          triggerClassName="h-8 px-1.5 rounded-lg text-[12px]"
          showSearch={false}
        />
      </div>

      <div className="flex-1 text-center font-medium text-slate-400">
        Showing {startRecord} to {endRecord} out of {totalItems} records
      </div>

      <div className="flex items-center gap-1">
        <button
          className="p-1.5 hover:bg-slate-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all text-slate-600"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          title="Previous Page"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={`${page}-${index}`}>
              {page === '...' ? (
                <span className="px-2 text-slate-400">...</span>
              ) : (
                <button
                  className={`min-w-[32px] h-8 px-2 flex items-center justify-center rounded-lg transition-all ${
                    currentPage === page
                      ? 'bg-emerald-50 text-emerald-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        <button
          className="p-1.5 hover:bg-slate-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all text-slate-600"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          title="Next Page"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
