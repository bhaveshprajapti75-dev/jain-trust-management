import { useState, useRef, useEffect } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";

export default function FilterBar({
  filters,
  options,
  onChange,
  onClear,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const hasActive = Object.values(filters || {}).some(
    (v) => v && v !== "All" && v !== "",
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center gap-2 px-4 h-[40px] rounded-lg text-[13.5px] font-bold transition-all border ${
          isOpen || hasActive
            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
            : "bg-white border-slate-200 text-slate-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700"
        }`}
      >
        <SlidersHorizontal className="w-4 h-4 text-emerald-700" strokeWidth={2.5} />
        FILTERS {hasActive && <span className="ml-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-72 rounded-2xl z-[100] p-5 shadow-xl border border-slate-200 bg-white animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-4">
            {(options || []).map((opt) => (
              <div key={opt.key} className="space-y-2">
                <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">{opt.placeholder}</label>
                <div className="relative">
                  <select
                    value={filters?.[opt.key] || ""}
                    onChange={(e) => onChange(opt.key, e.target.value)}
                    className="w-full pl-3 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] font-semibold text-slate-700 outline-none appearance-none hover:border-emerald-500 focus:border-emerald-600 focus:bg-emerald-50/20 transition-all cursor-pointer shadow-sm"
                  >
                    <option value="">All</option>
                    {(opt.items || []).map((item) => {
                      const val = typeof item === "string" ? item : item.value;
                      const label = typeof item === "string" ? item : item.label;
                      return (
                        <option key={val} value={val}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" strokeWidth={3} />
                </div>
              </div>
            ))}

            <div className="flex gap-2 pt-3 mt-4 border-t border-slate-100">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white border border-emerald-700 bg-emerald-700 hover:bg-emerald-800 transition-all shadow-sm"
              >
                Apply
              </button>
              {hasActive && (
                <button
                  onClick={() => { onClear(); setIsOpen(false); }}
                  className="px-4 py-2.5 border border-slate-200 bg-slate-50 text-slate-600 text-[13px] font-bold rounded-xl hover:bg-slate-100 transition-all shadow-sm"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
