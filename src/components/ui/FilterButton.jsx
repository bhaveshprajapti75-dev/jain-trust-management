import React, { useState, useRef, useEffect } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";

export default function FilterButton({ filters, options, onChange, onClear, dataCount }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const [localFilters, setLocalFilters] = useState({ ...filters });
  const dropdownRef = useRef(null);

  const hasActive = Object.values(filters || {}).some(
    (v) => v && v !== "All" && v !== "",
  );

  useEffect(() => {
    if (isOpen) setLocalFilters({ ...filters });
  }, [isOpen, filters]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleApply = () => {
    Object.keys(localFilters).forEach((key) => {
      onChange(key, localFilters[key]);
    });
    setIsOpen(false);
  };

  const handleLocalChange = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          if (!isOpen && dropdownRef.current) {
            const rect = dropdownRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            
            const isLessData = dataCount !== undefined && dataCount <= 3;
            if (isLessData || spaceBelow < 380) {
              setOpenUp(spaceAbove > spaceBelow);
            } else {
              setOpenUp(false);
            }
          }
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-1.5 px-3 h-[34px] rounded-lg border transition-all duration-200 text-[13px] font-medium shadow-sm"
        style={hasActive ? { backgroundColor: '#ecfdf5', borderColor: '#10b981', color: '#059669' } : { backgroundColor: 'white', borderColor: '#e2e8f0', color: '#475569' }}
        onMouseEnter={(e) => {
          if (!hasActive) {
            e.currentTarget.style.borderColor = '#10b981';
          }
        }}
        onMouseLeave={(e) => {
          if (!hasActive) {
            e.currentTarget.style.borderColor = '#e2e8f0';
          }
        }}
      >
        <SlidersHorizontal className="w-3.5 h-3.5" style={hasActive ? { color: '#059669' } : { color: '#94a3b8' }} />
        <span>Filter</span>
        <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </button>

      {isOpen && (
        <div className={`absolute right-0 w-72 bg-white rounded-xl border border-slate-200 shadow-xl z-50 p-4 ${openUp ? "bottom-full mb-2" : "top-full mt-2"}`}>
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h3 className="text-[13px] font-bold text-slate-700">Filter By</h3>
            {hasActive && (
              <button
                onClick={() => {
                  onClear();
                  setIsOpen(false);
                }}
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{ color: '#059669' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#047857'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#059669'}
              >
                Clear All
              </button>
            )}
          </div>

          <div className="space-y-4">
            {(options || []).map((opt) => (
              <div key={opt.key} className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1">
                  {opt.placeholder}
                </label>
                <CustomSelect
                  value={localFilters[opt.key] || ""}
                  options={[
                    { label: `All ${opt.placeholder}`, value: "" },
                    ...opt.items,
                  ]}
                  onChange={(val) => handleLocalChange(opt.key, val)}
                />
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-2">
            <button
              onClick={() => {
                onClear();
                setIsOpen(false);
              }}
              className="flex-1 px-3 py-2 bg-white border border-slate-200 text-slate-600 text-[12px] font-medium rounded-lg transition-colors hover:bg-slate-50"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-3 py-2 text-white text-[12px] font-medium rounded-lg transition-colors shadow-sm"
              style={{ backgroundColor: '#10b981' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Custom Select Sub-Component
function CustomSelect({ value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const selectRef = useRef(null);

  const selectedOption = options.find(
    (opt) => (typeof opt === "string" ? opt : opt.value) === value
  );

  const selectedLabel =
    typeof selectedOption === "string"
      ? selectedOption
      : selectedOption?.label;

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={selectRef}>
      {/* Select Button */}
      <button
        onClick={() => {
          if (!isOpen && selectRef.current) {
            const rect = selectRef.current.getBoundingClientRect();
            setOpenUp(window.innerHeight - rect.bottom < 200);
          }

          setIsOpen(!isOpen);
        }}
        className="
          w-full flex items-center justify-between
          px-3 py-2 rounded-lg border-2
          border-emerald-600 bg-white
          text-[13px] font-medium text-emerald-600
          hover:bg-emerald-50 hover:border-emerald-700
          transition-all duration-200
        "
      >
        <span className="truncate">
          {selectedLabel || "Select option"}
        </span>

        <ChevronDown
          className={`w-4 h-4 text-emerald-600 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <div
          className={`
            absolute left-0 right-0 z-[60] py-1 rounded-lg shadow-xl
            bg-white border-2 border-emerald-600
            max-h-48 overflow-y-auto
            ${openUp ? "bottom-full mb-1" : "top-full mt-1"}
          `}
        >
          {options.map((opt, i) => {
            const val =
              typeof opt === "string" ? opt : opt.value;
            const label =
              typeof opt === "string" ? opt : opt.label;

            const isSelected = val === value;

            return (
              <button
                key={i}
                onClick={() => {
                  onChange(val);
                  setIsOpen(false);
                }}
                className={`
                  w-full text-left px-3 py-2 text-[13px] font-medium transition-all duration-150
                  ${
                    isSelected
                      ? "bg-emerald-500 text-white border-l-4 border-emerald-700"
                      : "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                  }
                `}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}