import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-[#10b981] text-white hover:bg-[#059669] shadow-sm shadow-[#10b981]/20",
  secondary:
    "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
  danger:
    "bg-rose-600 text-white hover:bg-rose-500 shadow-sm shadow-rose-600/20",
  ghost: "text-slate-500 hover:bg-slate-100 hover:text-slate-700",
  emerald: 
    "bg-gradient-to-r from-emerald-900 to-emerald-500 text-white hover:from-emerald-950 hover:to-emerald-600 shadow-sm shadow-emerald-900/20",
};

const sizes = {
  sm: "px-3 h-8 text-xs rounded-lg gap-1.5",
  md: "px-4 h-[34px] text-sm rounded-lg gap-2",
  lg: "px-6 h-12 text-base rounded-lg gap-2.5",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon,
  className = "",
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center font-medium transition-all duration-200 ease-out ${variants[variant]} ${sizes[size]} ${disabled || loading ? "opacity-40 cursor-not-allowed pointer-events-none" : "cursor-pointer active:scale-[0.97]"} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
}

// button.jsx
