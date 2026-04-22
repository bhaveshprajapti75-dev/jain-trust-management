import React, { useState, useRef, useEffect } from "react";
import { SlidersHorizontal, ChevronDown, Check } from "lucide-react";

export default function FilterButton({ filters, options, onChange, onClear, dataCount, className }) {
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
    <div className={`relative ${className || ""}`} ref={dropdownRef}>
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
        className={`flex items-center gap-2 px-4 h-10 rounded-lg border text-[13px] font-medium transition-colors ${
          hasActive 
            ? "bg-emerald-50 border-emerald-500 text-emerald-700 hover:bg-emerald-100" 
            : "bg-white border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50"
        }`}
      >
        <SlidersHorizontal className={`w-4 h-4 ${hasActive ? "text-emerald-600" : "text-slate-500"}`} />
        <span>Filter</span>
      </button>

      {isOpen && (
        <div className={`absolute right-0 w-72 bg-white rounded-lg border border-slate-200 shadow-lg z-[100] p-5 origin-top-right ${openUp ? "bottom-full mb-2" : "top-full mt-2"}`}>
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h3 className="text-sm font-medium text-slate-800">Filter By</h3>
            {hasActive && (
              <button
                onClick={() => {
                  onClear();
                  setIsOpen(false);
                }}
                className="text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:underline transition-all uppercase tracking-wider"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="space-y-4">
            {(options || []).map((opt) => (
              <div key={opt.key} className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider pl-1">
                  {opt.placeholder}
                </label>
                <CustomSelect
                  value={localFilters[opt.key] || ""}
                  placeholder={opt.placeholder}
                  options={[
                    { label: `All ${opt.placeholder}`, value: "" },
                    ...opt.items,
                  ]}
                  onChange={(val) => handleLocalChange(opt.key, val)}
                />
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-2.5">
            <button
              onClick={() => {
                onClear();
                setIsOpen(false);
              }}
              className="flex-1 h-9 bg-slate-50 text-slate-600 text-sm font-medium rounded-md border border-slate-200 hover:bg-slate-100 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="flex-1 h-9 bg-emerald-700 text-white text-sm font-medium rounded-md hover:bg-emerald-800 transition-colors"
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
function CustomSelect({ value, options, onChange, placeholder }) {
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

  const isAnythingSelected = value !== "" && value !== "All" && value !== undefined;

  useEffect(() => {
    function handleClickOutside(event) {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={selectRef}>
      <button
        type="button"
        onClick={() => {
          if (!isOpen && selectRef.current) {
            const rect = selectRef.current.getBoundingClientRect();
            setOpenUp(window.innerHeight - rect.bottom < 250);
          }
          setIsOpen(!isOpen);
        }}
        className={`
          w-full flex items-center justify-between
          px-3 py-2 rounded-md border
          text-sm font-medium transition-colors
          ${isOpen ? "border-emerald-500 text-emerald-700 bg-white" : 
            isAnythingSelected 
              ? "border-emerald-300 bg-emerald-50/50 text-emerald-700 hover:border-emerald-400 hover:bg-emerald-50" 
              : "border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50"}
        `}
      >
        <span className="truncate">
          {selectedLabel || `Select ${placeholder}`}
        </span>

        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180 text-emerald-600" : isAnythingSelected ? "text-emerald-500" : "text-slate-400"
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`
            absolute left-0 right-0 z-[110] py-1.5 rounded-md shadow-lg
            bg-white border border-slate-200 overflow-hidden
            ${openUp ? "bottom-full mb-1.5" : "top-full mt-1.5"}
          `}
        >
          <div className="max-h-60 overflow-y-auto px-1.5 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            {options.map((opt, i) => {
              const val = typeof opt === "string" ? opt : opt.value;
              const label = typeof opt === "string" ? opt : opt.label;
              const isSelected = val === value || (val === "" && (value === "All" || !value));

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    onChange(val);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between px-3 py-2 my-0.5 rounded-md text-sm font-medium transition-colors
                    ${isSelected
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                    }
                  `}
                >
                  <span className="truncate">{label}</span>
                  {isSelected && <Check className="w-4 h-4 text-white" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}