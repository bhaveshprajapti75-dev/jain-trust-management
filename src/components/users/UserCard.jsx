import { Building2, Users } from "lucide-react";
import StatusBadge from "../common/StatusBadge";

export default function UserCard({
  user,
  role,
  trust,
  sangh,
  status,
  onView,
  index = 0,
}) {
  const initials = String(user?.name || "User")
    .split(" ")
    .map(function (part) {
      return part[0] || "";
    })
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      onClick={onView}
      className="group cursor-pointer rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-[0_22px_40px_-24px_rgba(13,148,136,0.32)]"
      style={{ animation: `cardIn 0.3s ease-out ${index * 0.04}s both` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shadow-sm shadow-emerald-600/20">
            {initials}
          </div>
          <div className="min-w-0">
            <h3 className="text-[16px] font-bold text-slate-800 truncate group-hover:text-teal-700">
              {user.name}
            </h3>
            <p className="text-[12px] font-semibold text-teal-700 truncate mt-1">
              {role?.name || "No role assigned"}
            </p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <span className="inline-flex min-w-0 items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
          <Building2 className="w-3.5 h-3.5" />
          <span className="truncate">{trust?.name || "-"}</span>
        </span>
        <span className="inline-flex min-w-0 items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
          <Users className="w-3.5 h-3.5" />
          <span className="truncate">{sangh?.name || "-"}</span>
        </span>
      </div>

      <p className="mt-4 min-h-[40px] text-[13px] leading-5 text-slate-500">
        {user.notes ||
          "User profile connected with the current trust and sangh structure."}
      </p>
    </div>
  );
}
