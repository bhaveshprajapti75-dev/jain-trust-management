import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Clock, ChevronUp, ChevronDown } from "lucide-react";

/**
 * Premium Custom TimePicker Component
 * Replicates the "spinner/wheel" style with up/down arrows as requested.
 */
export default function TimePicker({
  value,
  onChange,
  disabled = false,
  placeholder = "Select Time",
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, openUp: false });
  const [stagingHour, setStagingHour] = useState(12);
  const [stagingMinute, setStagingMinute] = useState(0);
  const [stagingPeriod, setStagingPeriod] = useState("AM");
  
  const [hourDir, setHourDir] = useState(null);
  const [minDir, setMinDir] = useState(null);
  const [periodDir, setPeriodDir] = useState(null);
  
  const triggerRef = useRef(null);
  const portalRef = useRef(null);

  // Parse internal 24h format (HH:mm) to display parts
  const getTimeParts = (val) => {
    if (!val) return { hour: 7, minute: 0, period: "AM" };
    const [h, m] = val.split(":").map(Number);
    const p = h >= 12 ? "PM" : "AM";
    const displayH = h % 12 || 12;
    return { hour: displayH, minute: m || 0, period: p };
  };

  const { hour, minute, period } = getTimeParts(value);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target) &&
        (!portalRef.current || !portalRef.current.contains(event.target))
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggle = () => {
    if (disabled) return;
    if (!isOpen && triggerRef.current) {
      const parts = getTimeParts(value);
      setStagingHour(parts.hour);
      setStagingMinute(parts.minute);
      setStagingPeriod(parts.period);
      setHourDir(null);
      setMinDir(null);
      setPeriodDir(null);

      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const shouldOpenUp = spaceBelow < 320 && rect.top > 320;
      setCoords({
        top: shouldOpenUp ? rect.top : rect.bottom,
        left: rect.left,
        width: 180,
        openUp: shouldOpenUp,
      });
    }
    setIsOpen(!isOpen);
  };

  const handleDone = () => {
    let h = stagingHour;
    if (stagingPeriod === "PM" && h < 12) h += 12;
    if (stagingPeriod === "AM" && h === 12) h = 0;
    const formatted = `${String(h).padStart(2, "0")}:${String(stagingMinute).padStart(2, "0")}`;
    onChange({ target: { value: formatted } });
    setIsOpen(false);
  };

  const adjust = (type, direction) => {
    if (type === "h") {
      setHourDir(direction);
      setStagingHour(prev => direction === "up" ? (prev === 1 ? 12 : prev - 1) : (prev === 12 ? 1 : prev + 1));
    } else if (type === "m") {
      setMinDir(direction);
      setStagingMinute(prev => direction === "up" ? (prev === 0 ? 59 : prev - 1) : (prev === 59 ? 0 : prev + 1));
    } else if (type === "p") {
      setPeriodDir(direction);
      setStagingPeriod(prev => prev === "AM" ? "PM" : "AM");
    }
  };

  return (
    <div className={`relative min-w-[140px] ${className}`} ref={triggerRef}>
      <div
        className={`px-4 py-2.5 h-[44px] bg-white border rounded-xl text-[13px] transition-all duration-200 cursor-pointer flex items-center justify-between group shadow-sm
          ${disabled ? "opacity-50 cursor-not-allowed border-slate-100 bg-slate-50" : "border-slate-200 hover:border-teal-400 focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-50"}
        `}
        onClick={toggle}
      >
        <div className="flex items-center gap-2.5">
          <Clock size={16} className={`${isOpen ? "text-teal-500" : "text-slate-400"}`} />
          <span className={`font-bold ${value ? "text-slate-700" : "text-slate-400"}`}>
            {value ? `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${period}` : placeholder}
          </span>
        </div>
        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-teal-500" : ""}`} />
      </div>

      {isOpen &&
        createPortal(
          <div
            ref={portalRef}
            className={`fixed z-[11000] bg-white border border-slate-100 rounded-[20px] shadow-2xl flex flex-col p-4 animate-in fade-in zoom-in-95 duration-200 ${coords.openUp ? "mb-2" : "mt-2"}`}
            style={{
              top: coords.openUp ? "auto" : coords.top,
              bottom: coords.openUp ? window.innerHeight - coords.top : "auto",
              left: coords.left,
              width: 180,
            }}
          >
            <div className="text-center mb-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Select Time</span>
            </div>

            <div className="flex items-center justify-center gap-1.5 overflow-hidden">
              {/* Hours */}
              <div 
                className="flex flex-col items-center gap-0.5 w-[42px]"
                onWheel={(e) => {
                  if (e.deltaY > 0) adjust("h", "down");
                  else adjust("h", "up");
                }}
              >
                <button onClick={() => adjust("h", "up")} className="p-0.5 hover:bg-teal-50 rounded text-slate-300 hover:text-teal-500 transition-all"><ChevronUp size={16} /></button>
                <div className="h-[20px] flex items-center justify-center pointer-events-none">
                  <span className="text-slate-200 font-bold text-[12px] opacity-40">{String(stagingHour === 1 ? 12 : stagingHour - 1).padStart(2, "0")}</span>
                </div>
                <div className="h-[28px] flex items-center justify-center pointer-events-none">
                  <span 
                    key={`h-${stagingHour}`}
                    className={`text-slate-800 font-black text-[18px] py-0.5 ${hourDir === 'up' ? 'animate-tp-wheel-down' : hourDir === 'down' ? 'animate-tp-wheel-up' : ''}`}
                  >
                    {String(stagingHour).padStart(2, "0")}
                  </span>
                </div>
                <div className="h-[20px] flex items-center justify-center pointer-events-none">
                  <span className="text-slate-200 font-bold text-[12px] opacity-40">{String(stagingHour === 12 ? 1 : stagingHour + 1).padStart(2, "0")}</span>
                </div>
                <button onClick={() => adjust("h", "down")} className="p-0.5 hover:bg-teal-50 rounded text-slate-300 hover:text-teal-500 transition-all"><ChevronDown size={16} /></button>
              </div>

              <div className="text-slate-800 font-black text-[18px] mb-1 px-0.5 flex items-center h-[72px]">:</div>

              {/* Minutes */}
              <div 
                className="flex flex-col items-center gap-0.5 w-[42px]"
                onWheel={(e) => {
                  if (e.deltaY > 0) adjust("m", "down");
                  else adjust("m", "up");
                }}
              >
                <button onClick={() => adjust("m", "up")} className="p-0.5 hover:bg-teal-50 rounded text-slate-300 hover:text-teal-500 transition-all"><ChevronUp size={16} /></button>
                <div className="h-[20px] flex items-center justify-center pointer-events-none">
                  <span className="text-slate-200 font-bold text-[12px] opacity-40">{String(stagingMinute === 0 ? 59 : stagingMinute - 1).padStart(2, "0")}</span>
                </div>
                <div className="h-[28px] flex items-center justify-center pointer-events-none">
                  <span 
                    key={`m-${stagingMinute}`}
                    className={`text-slate-800 font-black text-[18px] py-0.5 ${minDir === 'up' ? 'animate-tp-wheel-down' : minDir === 'down' ? 'animate-tp-wheel-up' : ''}`}
                  >
                    {String(stagingMinute).padStart(2, "0")}
                  </span>
                </div>
                <div className="h-[20px] flex items-center justify-center pointer-events-none">
                  <span className="text-slate-200 font-bold text-[12px] opacity-40">{String(stagingMinute === 59 ? 0 : stagingMinute + 1).padStart(2, "0")}</span>
                </div>
                <button onClick={() => adjust("m", "down")} className="p-0.5 hover:bg-teal-50 rounded text-slate-300 hover:text-teal-500 transition-all"><ChevronDown size={16} /></button>
              </div>

              <div className="w-1"></div>

              {/* Period */}
              <div 
                className="flex flex-col items-center gap-0.5 w-[42px]"
                onWheel={(e) => {
                  adjust("p", e.deltaY > 0 ? "down" : "up");
                }}
              >
                <button onClick={() => adjust("p", "up")} className="p-0.5 hover:bg-teal-50 rounded text-slate-300 hover:text-teal-500 transition-all"><ChevronUp size={16} /></button>
                <div className="h-[20px] flex items-center justify-center pointer-events-none">
                  <span className="text-slate-200 font-bold text-[12px] opacity-40">
                    {stagingPeriod === "PM" ? "AM" : ""}
                  </span>
                </div>
                <div className="h-[28px] flex items-center justify-center pointer-events-none">
                  <span 
                    key={`p-${stagingPeriod}`}
                    className={`text-teal-600 font-black text-[16px] py-0.5 ${periodDir === 'up' ? 'animate-tp-wheel-down' : periodDir === 'down' ? 'animate-tp-wheel-up' : ''}`}
                  >
                    {stagingPeriod}
                  </span>
                </div>
                <div className="h-[20px] flex items-center justify-center pointer-events-none">
                  <span className="text-slate-200 font-bold text-[12px] opacity-40">
                    {stagingPeriod === "AM" ? "PM" : ""}
                  </span>
                </div>
                <button onClick={() => adjust("p", "down")} className="p-0.5 hover:bg-teal-50 rounded text-slate-300 hover:text-teal-500 transition-all"><ChevronDown size={16} /></button>
              </div>
            </div>

            <button 
              onClick={handleDone}
              className="mt-4 w-full py-2 bg-teal-600 text-white rounded-xl font-bold text-[12px] hover:bg-teal-700 shadow-md shadow-teal-100 active:scale-95 transition-all"
            >
              Done
            </button>
          </div>,
          document.body
        )}
    </div>
  );
}
