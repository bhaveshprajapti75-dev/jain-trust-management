import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, Trash2, X } from "lucide-react";

// ── Context ──────────────────────────────────────────────────────────────────
const ToastContext = createContext(null);

let _toastId = 0;

// ── Provider ─────────────────────────────────────────────────────────────────
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, type = "success") => {
    const id = ++_toastId;
    setToasts((prev) => [...prev, { id, message, type, visible: true }]);

    // Auto-dismiss after 3 s
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, visible: false } : t))
      );
      // Remove from DOM after fade-out
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 400);
    }, 3000);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, visible: false } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 400);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      {createPortal(
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2.5 pointer-events-none">
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

// ── Individual Toast ─────────────────────────────────────────────────────────
function ToastItem({ toast, onDismiss }) {
  const isDelete = toast.type === "delete";

  const containerClass = isDelete
    ? "bg-white border border-rose-100 shadow-[0_8px_30px_rgba(244,63,94,0.12)]"
    : "bg-white border border-teal-100 shadow-[0_8px_30px_rgba(20,184,166,0.12)]";

  const iconBgClass = isDelete ? "bg-rose-50" : "bg-teal-50";
  const iconClass = isDelete ? "text-rose-500" : "text-teal-600";
  const progressClass = isDelete ? "bg-rose-400" : "bg-teal-500";
  const Icon = isDelete ? Trash2 : CheckCircle2;

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 px-4 py-3.5 rounded-2xl min-w-[280px] max-w-[340px] relative overflow-hidden
        transition-all duration-400 ease-out
        ${toast.visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}
        ${containerClass}`}
      style={{
        transition: "opacity 0.35s ease, transform 0.35s ease",
        transform: toast.visible ? "translateX(0)" : "translateX(2rem)",
      }}
    >
      {/* Icon */}
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBgClass}`}>
        <Icon className={`w-[18px] h-[18px] ${iconClass}`} strokeWidth={2.5} />
      </div>

      {/* Message */}
      <div className="flex-1 min-w-0 pt-0.5">
        <p className="text-[13px] font-bold text-slate-800 leading-snug">
          {toast.message}
        </p>
      </div>

      {/* Close button */}
      <button
        onClick={onDismiss}
        className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors mt-0.5"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-100 rounded-b-2xl">
        <div
          className={`h-full rounded-b-2xl ${progressClass}`}
          style={{
            animation: "toast-progress 3s linear forwards",
          }}
        />
      </div>

      {/* Inline keyframes via style tag */}
      <style>{`
        @keyframes toast-progress {
          from { width: 100%; }
          to   { width: 0%;   }
        }
      `}</style>
    </div>
  );
}

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
