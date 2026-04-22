import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

export default function DatePicker({ label, value, onChange, icon: Icon = Calendar, placeholder = "Select date", disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, openUp: false });
  const containerRef = useRef(null);
  const portalRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current && 
        !containerRef.current.contains(event.target) &&
        (!portalRef.current || !portalRef.current.contains(event.target))
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (disabled) return;
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const shouldOpenUp = spaceBelow < 340 && rect.top > 340; // 340px for calendar height + margin
      
      setCoords({
        top: shouldOpenUp ? rect.top : rect.bottom,
        left: rect.left,
        width: rect.width,
        openUp: shouldOpenUp
      });
    }
    setIsOpen(!isOpen);
  };

  const handleSelect = (day, monthIndex, year) => {
    const monthDigit = String(monthIndex + 1).padStart(2, '0');
    const dayDigit = String(day).padStart(2, '0');
    const formattedDate = `${dayDigit}/${monthDigit}/${year}`;
    onChange({ target: { name: "date", value: formattedDate } }); 
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      {label && <label className="block text-[13px] font-medium text-slate-700 mb-1.5 ml-1">{label}</label>}
      <button 
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        className={`w-full h-[36px] bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-left flex items-center justify-between group transition-all outline-none 
          ${disabled ? 'cursor-not-allowed opacity-60' : 'hover:border-emerald-600 hover:bg-white focus:ring-4 focus:ring-emerald-50'}`}
      >
        <span className={value ? "text-slate-700 font-medium" : "text-slate-400"}>
          {value || placeholder}
        </span>
        <Icon className="w-[18px] h-[18px] text-slate-400 group-hover:text-emerald-600 transition-colors" />
      </button>

      {isOpen && createPortal(
        <div 
          ref={portalRef}
          className={`fixed z-[10000] w-72 bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-100 p-4 animate-in fade-in zoom-in-95 duration-200 ${coords.openUp ? "mb-2" : "mt-2"}`}
          style={{
            top: coords.openUp ? "auto" : coords.top,
            bottom: coords.openUp ? window.innerHeight - coords.top : "auto",
            left: Math.min(coords.left, window.innerWidth - 300), // Ensure it doesnt go off screen right
          }}
        >
           <CalendarGrid onSelect={handleSelect} initialValue={value} />
        </div>,
        document.body
      )}
    </div>
  );
}

// ── Internal Calendar Component ──

function CalendarGrid({ onSelect, initialValue }) {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentYearNow = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYearNow - i);
  
  const [viewState, setViewState] = useState("days"); 
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    if (initialValue && typeof initialValue === 'string') {
       // Parse DD/MM/YYYY
       if (initialValue.includes('/')) {
         const parts = initialValue.split('/');
         if (parts.length === 3) {
            setSelectedDay(parseInt(parts[0]));
            setCurrentMonth(parseInt(parts[1]) - 1);
            setCurrentYear(parseInt(parts[2]));
         }
       } else {
         // Fallback for old space-separated month name format
         const parts = initialValue.split(' ');
         if (parts.length >= 3) {
           setSelectedDay(parseInt(parts[0]));
           const mIdx = months.indexOf(parts[1]);
           if (mIdx !== -1) setCurrentMonth(mIdx);
           const yVal = parseInt(parts[2]);
           if (!isNaN(yVal)) setCurrentYear(yVal);
         }
       }
    }
  }, [initialValue]);

  const getDaysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (m, y) => new Date(y, m, 1).getDay();

  const days = Array.from({ length: getDaysInMonth(currentMonth, currentYear) }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: getFirstDayOfMonth(currentMonth, currentYear) }, (_, i) => i);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-50 pb-3">
        <div className="flex items-center gap-1.5">
            <button 
                onClick={() => setViewState(viewState === "months" ? "days" : "months")}
                className="text-[13px] font-bold text-slate-700 hover:text-emerald-700 px-2 py-1 rounded-lg hover:bg-slate-50 transition-all"
            >
                {months[currentMonth]}
            </button>
            <button 
                onClick={() => setViewState(viewState === "years" ? "days" : "years")}
                className="text-[13px] font-bold text-slate-700 hover:text-emerald-700 px-2 py-1 rounded-lg hover:bg-slate-50 transition-all"
            >
                {currentYear}
            </button>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => {
              if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear(prev => prev - 1);
              } else {
                setCurrentMonth(prev => prev - 1);
              }
            }} 
            className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          </button>
          <button 
            onClick={() => {
              if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear(prev => prev + 1);
              } else {
                setCurrentMonth(prev => prev + 1);
              }
            }} 
            className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {viewState === "days" && (
        <div className="grid grid-cols-7 gap-1 animate-in fade-in duration-300">
          {["S", "m", "t", "w", "t", "f", "s"].map(d => (
            <div key={d} className="text-[10px] font-bold text-slate-300 text-center py-2 uppercase">{d}</div>
          ))}
          {emptyDays.map(i => <div key={`e-${i}`} />)}
          {days.map(d => (
            <button
              key={d}
              onClick={() => onSelect(d, currentMonth, currentYear)}
              className={`w-[34px] h-[34px] rounded-lg text-xs font-bold transition-all ${
                selectedDay === d 
                ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-700/20' 
                : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      )}

      {viewState === "months" && (
        <div className="py-2 animate-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-3 gap-2 overflow-y-auto" style={{ maxHeight: "96px" }}>
            {months.map((m, i) => (
              <button
                key={m}
                onClick={() => { setCurrentMonth(i); setViewState("days"); }}
                className={`text-[11px] font-bold py-2.5 rounded-lg border transition-all ${currentMonth === i ? 'bg-emerald-700 text-white border-emerald-700 shadow-md shadow-emerald-700/20' : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-emerald-200 hover:text-emerald-700'}`}
              >
                {m.substring(0, 3)}
              </button>
            ))}
          </div>
        </div>
      )}

      {viewState === "years" && (
        <div className="py-2 animate-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-4 gap-2 overflow-y-auto" style={{ maxHeight: "96px" }}>
            {years.map(y => (
              <button
                key={y}
                onClick={() => { setCurrentYear(y); setViewState("days"); }}
                className={`text-[11px] font-bold py-2.5 rounded-lg border transition-all ${currentYear === y ? 'bg-emerald-700 text-white border-emerald-700 shadow-md shadow-emerald-700/20' : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-emerald-200 hover:text-emerald-700'}`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
