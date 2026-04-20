import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

export default function Pagination({
  currentPage,
  totalRecords,
  recordsPerPage,
  onPageChange,
  onRecordsPerPageChange,
}) {
  const [isLimitOpen, setIsLimitOpen] = useState(false);
  const dropdownRef = useRef(null);

  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const startRecord = (currentPage - 1) * recordsPerPage + 1;
  const endRecord = Math.min(currentPage * recordsPerPage, totalRecords);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const limitOptions = [5, 10, 15, 20];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsLimitOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="px-4 py-3 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <span className="text-[13px] text-slate-500">Show</span>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsLimitOpen(!isLimitOpen)}
            className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-3 h-[34px] text-[13px] font-medium text-slate-600 transition-all cursor-pointer min-w-[55px] justify-between"
            style={{ backgroundColor: 'white' }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#10b981'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
          >
            <span>{recordsPerPage}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isLimitOpen && (
            <div className="absolute bottom-full left-0 mb-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden">
              {limitOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    onRecordsPerPageChange(opt);
                    setIsLimitOpen(false);
                  }}
                  className="w-full text-center py-2 text-[13px] font-medium transition-all text-slate-600"
                  style={recordsPerPage === opt ? { backgroundColor: '#10b981', color: 'white' } : {}}
                  onMouseEnter={(e) => {
                    if (recordsPerPage !== opt) {
                      e.currentTarget.style.backgroundColor = '#ecfdf5';
                      e.currentTarget.style.color = '#059669';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (recordsPerPage !== opt) {
                      e.currentTarget.style.backgroundColor = '';
                      e.currentTarget.style.color = '#475569';
                    }
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
        <span className="text-[13px] text-slate-500">entries</span>
      </div>

      <div className="text-[13px] text-slate-500 font-medium order-3 sm:order-2">
        {totalRecords > 0 ? (
          <>Showing {startRecord} to {endRecord} out of {totalRecords} records</>
        ) : (
          "No records found"
        )}
      </div>

      <div className="flex items-center gap-1 order-2 sm:order-3">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-[32px] h-[32px] flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 border border-slate-200 disabled:opacity-30 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className="w-[32px] h-[32px] flex items-center justify-center rounded-lg text-[13px] font-medium transition-all border border-slate-200"
            style={currentPage === num ? { backgroundColor: '#10b981', color: 'white' } : { color: '#475569' }}
            onMouseEnter={(e) => {
              if (currentPage !== num) {
                e.currentTarget.style.backgroundColor = '#ecfdf5';
                e.currentTarget.style.color = '#059669';
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== num) {
                e.currentTarget.style.backgroundColor = '';
                e.currentTarget.style.color = '#475569';
              }
            }}
          >
            {num}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-[32px] h-[32px] flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 border border-slate-200 disabled:opacity-30 transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}