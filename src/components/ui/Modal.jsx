import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = "md",
  footer,
}) {
  const scrollRef = useRef(null);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Reset scroll to top every time the modal opens
  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  if (!isOpen) return null;
  if (typeof document === "undefined") return null;

  const sizeMap = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-3xl",
    xxl: "max-w-5xl",
  };

  const content = (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm">
      {/* Remove onClose from backdrop to prevent outside click close */}
      <div className="absolute inset-0 bg-slate-900/60 transition-opacity" />

      <div
        className={`relative w-full ${sizeMap[size]} max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-4rem)] flex flex-col overflow-hidden rounded-[20px] bg-white shadow-2xl ring-1 ring-slate-900/5 animate-in fade-in zoom-in-95 duration-200`}
      >
        <div
          className={`flex items-start justify-between px-6 py-5 ${title || subtitle ? "border-b border-slate-100" : "absolute top-0 right-0 z-10 p-4"}`}
        >
          <div>
            {title && <h2 className="text-lg font-semibold text-slate-800 tracking-tight">{title}</h2>}
            {subtitle && <p className="text-[13px] text-slate-500 mt-1 leading-relaxed">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all duration-200"
          >
            <X className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>

        <div ref={scrollRef} className="px-6 py-6 overflow-y-auto flex-1 bg-white">
          {children}
        </div>

        {footer && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
