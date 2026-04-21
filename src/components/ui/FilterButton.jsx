import React, { useState, useRef, useEffect } from "react";
import { SlidersHorizontal, ChevronDown, Check } from "lucide-react";

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
        className={`flex items-center gap-1.5 px-4 h-10 rounded-xl border transition-all duration-300 text-[13px] font-bold shadow-sm ${
          hasActive 
            ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-emerald-100 hover:bg-emerald-100 hover:border-emerald-300 active:scale-95" 
            : "bg-white border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-slate-50 active:scale-95"
        }`}
      >
        <SlidersHorizontal className={`w-4 h-4 transition-colors ${hasActive ? "text-emerald-600" : "text-slate-400"}`} />
        <span>Filter</span>
        <ChevronDown className={`w-4 h-4 transition-all duration-300 ${isOpen ? "rotate-180" : ""} ${hasActive ? "text-emerald-500" : "text-slate-400"}`} />
      </button>

      {isOpen && (
        <div className={`absolute right-0 w-72 bg-white rounded-2xl border border-slate-100 shadow-2xl z-[100] p-5 animate-in fade-in zoom-in-95 duration-200 origin-top-right ${openUp ? "bottom-full mb-3" : "top-full mt-3"}`}>
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-50">
            <h3 className="text-[14px] font-bold text-slate-800">Filter By</h3>
            {hasActive && (
              <button
                onClick={() => {
                  onClear();
                  setIsOpen(false);
                }}
                className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-all uppercase tracking-wider"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="space-y-5">
            {(options || []).map((opt) => (
              <div key={opt.key} className="space-y-2">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-widest pl-1">
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

          <div className="mt-7 flex items-center gap-3">
            <button
              onClick={() => {
                onClear();
                setIsOpen(false);
              }}
              className="flex-1 h-[42px] bg-slate-50 text-slate-600 text-[13px] font-bold rounded-xl transition-all hover:bg-slate-100 active:scale-95"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="flex-1 h-[42px] bg-emerald-600 text-white text-[13px] font-bold rounded-xl transition-all hover:bg-emerald-700 shadow-lg shadow-emerald-200 active:scale-95"
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
          px-4 py-2.5 rounded-xl border transition-all duration-300
          text-[13px] font-bold
          ${isOpen ? "border-emerald-500 ring-4 ring-emerald-50 text-emerald-700 bg-white" : 
            isAnythingSelected 
              ? "border-emerald-200 bg-emerald-50/50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50" 
              : "border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:bg-slate-50"}
        `}
      >
        <span className="truncate">
          {selectedLabel || `Select ${placeholder}`}
        </span>

        <ChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-emerald-600" : isAnythingSelected ? "text-emerald-500" : "text-slate-300"
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`
            absolute left-0 right-0 z-[110] py-1.5 rounded-xl shadow-2xl
            bg-white border border-slate-100 overflow-hidden
            animate-in fade-in zoom-in-95 duration-200
            ${openUp ? "bottom-full mb-2" : "top-full mt-2"}
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
                    w-full flex items-center justify-between px-3 py-2.5 my-0.5 rounded-lg text-[13px] font-bold transition-all duration-200
                    ${isSelected
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-200 scale-[1.02] hover:bg-emerald-700"
                      : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 hover:pl-4"
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

