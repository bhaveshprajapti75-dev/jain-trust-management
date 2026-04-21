import React from 'react'
import CustomDropdown from './CustomDropdown'

export default function Pagination({
  currentPage,
  totalRecords,
  recordsPerPage,
  onPageChange,
  onRecordsPerPageChange,
  rowsPerPageOptions = [10, 20, 30, 50, 100],
}) {
  const totalPages = Math.ceil(totalRecords / recordsPerPage)
  const startRecord = (currentPage - 1) * recordsPerPage + 1
  const endRecord = Math.min(currentPage * recordsPerPage, totalRecords)

  if (totalRecords === 0) return null

  const handlePageChange = (page) => {
    onPageChange(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getPageNumbers = () => {
    const pages = []
    const nums = new Set([1, totalPages])

    // Show first few pages
    for (let i = 1; i <= 3; i += 1) {
      if (i <= totalPages) nums.add(i)
    }

    // Show pages around current page
    if (currentPage > 1 && currentPage < totalPages) {
      nums.add(currentPage - 1)
      nums.add(currentPage)
      nums.add(currentPage + 1)
    }

    // Show last few pages
    for (let i = totalPages - 2; i <= totalPages; i += 1) {
      if (i > 0) nums.add(i)
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
    <div className="flex items-center justify-between py-2 px-2 w-full">
      {/* Left side: Records per page */}
      <div className="flex-1 flex items-center gap-2">
        <span className="text-[13px] text-slate-400 font-medium whitespace-nowrap">Showing</span>
        <CustomDropdown
          value={recordsPerPage}
          onChange={(value) => {
            onRecordsPerPageChange(Number(value))
            handlePageChange(1)
          }}
          items={rowsPerPageOptions.map((option) => ({ label: String(option), value: option }))}
          className="w-16"
          triggerClassName="h-8 px-2 rounded-lg text-[13px] bg-slate-50/50 border-slate-200"
          showSearch={false}
        />
      </div>

      {/* Center: Record Summary */}
      <div className="flex-1 text-center text-[13px] text-slate-400 font-medium">
        Showing {startRecord} to {endRecord} out of {totalRecords} records
      </div>

      {/* Right side: Pagination controls */}
      <div className="flex-1 flex justify-end items-center gap-1">
        <button
          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-emerald-600 disabled:opacity-20 disabled:hover:text-slate-400 transition-colors"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          title="Previous Page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-0.5">
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={`${page}-${index}`}>
              {page === '...' ? (
                <span className="w-8 h-8 flex items-center justify-center text-slate-400 text-[13px]">...</span>
              ) : (
                <button
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all text-[13px] font-semibold ${
                    currentPage === page
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
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
          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-emerald-600 disabled:opacity-20 disabled:hover:text-slate-400 transition-colors"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          title="Next Page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}