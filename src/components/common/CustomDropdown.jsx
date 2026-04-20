import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function CustomDropdown({
  value,
  onChange,
  placeholder,
  items,
  className = "",
  triggerClassName = "",
  searchPlaceholder = "Search...",
  showSearch = true,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
    width: 0,
    openUp: false,
  });
  const triggerRef = useRef(null);
  const portalRef = useRef(null);

  const filteredItems = showSearch
    ? items.filter((item) => {
        const label = typeof item === "string" ? item : item.label;
        return label.toLowerCase().includes(search.toLowerCase());
      })
    : items;

  const selectedLabel = items.find((item) => {
    const itemValue = typeof item === "string" ? item : item.value;
    return String(itemValue) === String(value);
  });

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
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const shouldOpenUp = spaceBelow < 250 && rect.top > 250;
      setCoords({
        top: shouldOpenUp ? rect.top : rect.bottom,
        left: rect.left,
        width: rect.width,
        openUp: shouldOpenUp,
      });
    }
    setIsOpen(!isOpen);
  };

  return (
  <div className={`relative ${className}`} ref={triggerRef}>
    <div
      className={`px-3 py-2 bg-white border rounded-lg text-[13px] text-slate-700 font-medium transition-all cursor-pointer flex items-center justify-between group ${
        isOpen
          ? "border-emerald-500"
          : "border-slate-200 hover:border-emerald-500"
      } ${triggerClassName}`}
      onClick={toggle}
    >
      <span className="truncate">
        {selectedLabel
          ? typeof selectedLabel === "string"
            ? selectedLabel
            : selectedLabel.label
          : placeholder}
      </span>

      {isOpen ? (
        <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
      ) : (
        <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
      )}
    </div>

    {isOpen &&
      createPortal(
        <div
          ref={portalRef}
          className="fixed z-[11000] bg-white border border-emerald-500 rounded-lg shadow-xl overflow-hidden"
          style={{
            top: coords.openUp ? "auto" : coords.top,
            bottom: coords.openUp
              ? window.innerHeight - coords.top
              : "auto",
            left: coords.left,
            width: coords.width,
          }}
        >
          {showSearch && (
            <div className="p-2 border-b border-emerald-100 bg-white">
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-1.5 text-[12px] border border-emerald-500 rounded-lg focus:outline-none focus:border-emerald-500 text-slate-700"
                autoFocus
              />
            </div>
          )}

          <ul className="py-1 max-h-60 overflow-y-auto">
            {filteredItems.length === 0 ? (
              <li className="px-4 py-2 text-[12px] text-slate-500 italic">
                No options found
              </li>
            ) : (
              filteredItems.map((item, index) => {
                const itemValue =
                  typeof item === "string" ? item : item.value;
                const itemLabel =
                  typeof item === "string" ? item : item.label;

                const selected =
                  String(itemValue) === String(value);

                return (
                  <li
                    key={`${itemValue}-${index}`}
                    className={`px-3 py-2 text-[13px] font-medium cursor-pointer transition-all ${
                      selected
                        ? "bg-emerald-50 text-emerald-600"
                        : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-600"
                    }`}
                    onClick={() => {
                      onChange(itemValue);
                      setIsOpen(false);
                      setSearch("");
                    }}
                  >
                    <span className="truncate">{itemLabel}</span>
                  </li>
                );
              })
            )}
          </ul>
        </div>,
        document.body
      )}
  </div>
);
}