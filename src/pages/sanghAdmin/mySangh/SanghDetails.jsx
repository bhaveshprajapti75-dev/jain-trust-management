import { useState, useEffect } from "react";
import {
  Building2,
  MapPin,
  Calendar,
  Info,
  Globe,
  Users,
} from "lucide-react";
import Skeleton from "../../../components/ui/Skeleton";
import { 
  sanghService, 
  authService 
} from "../../../services/apiService";
import CommonPageLayout from "../../../components/ui/CommonPageLayout";

export default function SanghDetails() {
  const defaultData = {
    id: "",
    name: "",
    date: "",
    type: "",
    address: "",
    totalFamilies: "0",
    totalMembers: "0",
    head: "",
    totalTrusts: "0",
    contactPhone: "",
    email: "",
    website: "",
    status: "Active",
    city: "",
    state: "",
    area: "",
    code: "",
  };

  const [sangh, setSangh] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [errors, setErrors] = useState({});
  
  const fetchSanghDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Step 1: Fetch Profile from Backend to get assigned Sangh ID
      const profile = await authService.getProfile();
      
      // Try multiple potential backend field names for the assigned Sangh ID
      const scopeId = 
        profile?.user?.scope_id || 
        profile?.scope_id || 
        profile?.user?.sangh_id || 
        profile?.sangh_id ||
        profile?.sangh || 
        profile?.user?.sangh;
      
      if (!scopeId) {
        console.warn("No scopeId found in Backend Profile response:", profile);
        setError("Your account is not yet assigned to a specific Sangh. Please contact Super Admin.");
        return;
      }
      
      const data = await sanghService.getDetails(scopeId);
      if (data) {
        // Map backend fields to frontend names
        const mappedData = {
          ...defaultData,
          ...data,
          type: data.sangh_type ? data.sangh_type.replace(/_/g, " ") : "SADHU SANGH",
          date: data.established_date || data.established_year?.toString(),
          name: data.organization_name || `Sangh #${data.id}`,
          sangh_type: data.sangh_type ? data.sangh_type.replace(/_/g, " ") : "SADHU SANGH"
        };
        setSangh(mappedData);
      } else {
        setError("Sangh details not found.");
      }
    } catch (error) {
      console.error("Failed to fetch sangh details from Postgres", error);
      setError("Failed to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSanghDetails();
  }, []);

  return (
    <CommonPageLayout title="Sangh Details">
      <div className="space-y-3 w-full">
        <div className="bg-white rounded-3xl overflow-hidden relative border-none shadow-xl ring-1 ring-slate-100">
          {/* Main Header Profile */}
          <div className="px-4 pt-4 pb-3 border-b border-slate-50 relative">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border-[3px] border-white shadow-lg flex items-center justify-center text-emerald-600 shrink-0">
                <Building2 className="w-8 h-8" />
              </div>

              <div className="flex-1 text-center md:text-left space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                      {loading ? "Loading..." : (sangh.name || "Sangh Details")}
                    </h1>
                    <p className="text-[13px] font-bold text-emerald-600 uppercase tracking-[0.15em]">
                      {loading ? "Fetching information..." : (sangh.type || "Organization Profile")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="px-4 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatSmall
                label="Established Year"
                value={loading ? "..." : (sangh.date || sangh.established_year)}
                icon={Calendar}
                color="text-emerald-600"
                bg="bg-emerald-50/40"
              />
              <StatSmall
                label="Location"
                value={loading ? "..." : (sangh.address || "N/A")}
                icon={MapPin}
                color="text-sky-600"
                bg="bg-sky-50/40"
              />
            </div>
          </div>

          {/* Detail Content - Direct Overview */}
          <div className="px-4 pt-2 pb-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton variant="text" width="60px" height="10px" />
                    <Skeleton variant="text" width="150px" height="16px" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

                <DetailBox label="SANGH TYPE" value={sangh.sangh_type} icon={Info} />
                <DetailBox
                  label="STATUS"
                  value={sangh.status}
                  icon={Globe}
                  valueClass={
                    sangh.status?.toLowerCase() === "active"
                      ? "text-emerald-600"
                      : "text-rose-600"
                  }
                />
                <DetailBox label="TOTAL FAMILIES" value={sangh.totalFamilies} icon={Users} />
                <DetailBox label="TOTAL MEMBERS" value={sangh.totalMembers} icon={Users} />
                <DetailBox label="LINKED TRUSTS" value={sangh.totalTrusts} icon={Building2} />
                <DetailBox label="PHONE" value={sangh.contactPhone} icon={Info} />
                <DetailBox label="EMAIL" value={sangh.email} icon={Globe} />
                <DetailBox label="WEBSITE" value={sangh.website} icon={Globe} />
                
                <div className="md:col-span-2">
                  <DetailBox
                    label="FULL REGISTERED ADDRESS"
                    value={sangh.address}
                    icon={MapPin}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </CommonPageLayout>

  );
}

// ── Internal Presentation Components ──

function StatSmall({ label, value, icon: Icon, color, bg }) {
  return (
    <div
      className={`p-4 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-emerald-100 hover:shadow-sm transition-all duration-300 ${bg}`}
    >
      <div className="space-y-0.5">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {label}
        </p>
        <p className="text-[14px] font-bold text-slate-700 truncate max-w-[150px]">
          {value || "-"}
        </p>
      </div>
      <div
        className={`w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}
      >
        <Icon className="w-4.5 h-4.5" />
      </div>
    </div>
  );
}

function DetailBox({ label, value, icon: Icon, valueClass }) {
  return (
    <div className="space-y-1.5 group">
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-slate-400" />
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          {label}
        </p>
      </div>
      <p
        className={`text-[14px] font-bold pl-5.5 leading-relaxed transition-colors ${
          valueClass || "text-slate-700 group-hover:text-emerald-600"
        }`}
      >
        {value || "-"}
      </p>
    </div>
  );
}


