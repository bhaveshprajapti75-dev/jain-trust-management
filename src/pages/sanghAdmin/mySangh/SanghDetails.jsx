import { useState, useEffect } from "react";
import {
  Building2,
  MapPin,
  Calendar,
  Info,
  Phone,
  Mail,
  User,
  ShieldCheck,
  Globe,
  Clock,
  Edit,
  Landmark,
  BookOpen,
} from "lucide-react";
import Button from "../../../components/common/Button";
import Skeleton from "../../../components/common/Skeleton";
import Modal from "../../../components/common/Modal";
import Input from "../../../components/common/Input";
import DatePicker from "../../../components/common/DatePicker";

export default function SanghDetails() {
  const defaultData = {
    id: 1,
    name: "Sathandji Kalyanji Sangh",
    date: "26 January 1992",
    type: "Main Sangh",
    address:
      "123, Jain Layout, Near Mahaveer Temple, Palitana, Bhavnagar, Gujarat - 364270",
    totalFamilies: "1,240",
    totalMembers: "4,850",
    head: "Arvindbhai Mehta",
    totalTrusts: "05",
    contactPhone: "9825012345",
    email: "sathandjikalyanji@gmail.com",
    website: "www.sathandjisangh.org",
    status: "Active",
    city: "Palitana",
    state: "Gujarat",
    area: "Sathandji Area",
    code: "SKS-001",
  };

  const [sangh, setSangh] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState(defaultData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchSanghDetails = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 150)); // Ultra-fast shimmer
        const stored = localStorage.getItem("sangh_data");
        if (stored) {
          const data = JSON.parse(stored);
          setSangh(data);
          setFormData(data);
        }
      } catch (error) {
        console.error("Failed to fetch sangh details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSanghDetails();
  }, []);

  const validate = () => {
    let newErrors = {};
    if (!formData.name?.trim()) newErrors.name = "Sangh name is required";
    if (!formData.head?.trim()) newErrors.head = "Admin head is required";
    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!formData.contactPhone) {
      newErrors.contactPhone = "Phone number is required";
    } else if (!phoneRegex.test(formData.contactPhone)) {
      newErrors.contactPhone = "Invalid 10-digit number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const toggleStatus = async (newStatus) => {
    try {
      const updatedSangh = { ...sangh, status: newStatus };
      localStorage.setItem("sangh_data", JSON.stringify(updatedSangh));
      setSangh(updatedSangh);
      setFormData(updatedSangh);
    } catch (err) {
      console.error("Failed to toggle status", err);
    }
  };

  const handleUpdate = async () => {
    if (!validate()) return;
    try {
      setSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      localStorage.setItem("sangh_data", JSON.stringify(formData));
      setSangh(formData);
      setIsEditModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <div className="space-y-3 w-full">
      <div className="bg-white rounded-3xl overflow-hidden relative border-none shadow-xl ring-1 ring-slate-100">
        {/* Main Header Profile */}
        <div className="px-4 pt-4 pb-3 border-b border-slate-50 relative">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 border-[3px] border-white shadow-lg flex items-center justify-center text-teal-600 shrink-0">
              <Building2 className="w-8 h-8" />
            </div>

            <div className="flex-1 text-center md:text-left space-y-3">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  {sangh.name}
                </h1>
                <p className="text-sm font-medium text-slate-400 mt-1 uppercase tracking-widest">
                  {sangh.type}
                </p>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
                {/* Status Pill Badge */}
                <span
                  className={`px-2.5 py-0.5 rounded-xl text-[11px] font-bold w-[65px] text-center inline-block ${
                    sangh.status === "Active"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {sangh.status}
                </span>

                {/* Interactive Toggle Switch */}
                <button
                  onClick={() =>
                    toggleStatus(
                      sangh.status === "Active" ? "Inactive" : "Active",
                    )
                  }
                  className="flex items-center gap-1.5 focus:outline-none"
                >
                  <div
                    className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors px-[3px] ${
                      sangh.status === "Active"
                        ? "bg-emerald-500"
                        : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                        sangh.status === "Active"
                          ? "translate-x-[16px]"
                          : "translate-x-0"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-[12px] font-medium w-14 text-left ${sangh.status === "Active" ? "text-slate-600" : "text-slate-500"}`}
                  >
                    {sangh.status}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 absolute top-3 right-4 md:static">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="w-9 h-9 rounded-xl bg-slate-50 text-slate-400 hover:bg-teal-50 hover:text-teal-600 flex items-center justify-center border border-slate-100 transition-all shadow-sm"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="px-4 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatSmall
              label="Sangh Admin"
              value={sangh.head}
              icon={User}
              color="text-teal-600"
              bg="bg-teal-50/40"
            />
            <StatSmall
              label="Total Trust"
              value={sangh.totalTrusts}
              icon={ShieldCheck}
              color="text-sky-600"
              bg="bg-sky-50/40"
            />
          </div>
        </div>

        {/* Tab switcher - Enhanced Pill Style */}
        <div className="mx-4 mt-1 mb-1">
          <div className="flex items-center gap-1 p-1 bg-slate-50 border border-slate-100/50 rounded-xl w-full">
            {["Overview", "Finance", "Institutions"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 text-[12px] font-bold rounded-xl transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-white text-teal-600 shadow-sm border border-slate-100"
                    : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Detail Content - Premium Cards */}
        <div className="px-4 pt-2 pb-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton variant="text" width="60px" height="10px" />
                  <Skeleton variant="text" width="150px" height="16px" />
                </div>
              ))}
            </div>
          ) : (
            activeTab === "Overview" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <DetailBox
                  label="OFFICIAL EMAIL"
                  value={sangh.email}
                  icon={Mail}
                />
                <DetailBox
                  label="CONTACT PHONE"
                  value={sangh.contactPhone}
                  icon={Phone}
                />
                <DetailBox
                  label="ESTABLISHED DATE"
                  value={sangh.date}
                  icon={Calendar}
                />
                <DetailBox label="SANGH TYPE" value={sangh.type} icon={Info} />
                <DetailBox
                  label="CITY / TOWN"
                  value={sangh.city}
                  icon={Globe}
                />
                <DetailBox
                  label="LOCATION AREA"
                  value={sangh.area}
                  icon={MapPin}
                />
                <div className="md:col-span-2">
                  <DetailBox
                    label="FULL REGISTERED ADDRESS"
                    value={sangh.address}
                    icon={MapPin}
                  />
                </div>
              </div>
            )
          )}
          {!loading && activeTab === "Finance" && (
            <div className="h-48 flex flex-col items-center justify-center bg-slate-50/50 border border-dashed border-slate-200 rounded-[32px] animate-in zoom-in-95 duration-300">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm mb-3">
                <Clock className="w-6 h-6 text-slate-300" />
              </div>
              <p className="text-[13px] text-slate-400 font-bold tracking-tight uppercase">
                Records Coming Soon
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Financial summaries are being generated.
              </p>
            </div>
          )}
          {activeTab === "Institutions" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in slide-in-from-right-4 duration-500">
              <InstitutionCard
                icon={Landmark}
                title="Derasar Units"
                count="2"
              />
              <InstitutionCard
                icon={BookOpen}
                title="Pathshala units"
                count="1"
              />
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal mirroring the Design */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Sangh Profile"
        subtitle="Update the core details of your Sangh organization"
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button loading={saving} onClick={handleUpdate}>
              Save Changes
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Sangh Official Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              icon={Building2}
              required
            />
            <Input
              label="Admin / Head Name"
              name="head"
              value={formData.head}
              onChange={handleChange}
              error={errors.head}
              icon={User}
              required
            />
            <Input
              label="Total Trusts"
              name="totalTrusts"
              value={formData.totalTrusts}
              onChange={handleChange}
              icon={ShieldCheck}
            />
            <Input
              label="Sangh Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              icon={Info}
            />
            <DatePicker
              label="Establishment Date"
              value={formData.date}
              onChange={handleChange}
            />

            <Input
              label="Official Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={Mail}
              required
            />
            <Input
              label="Contact Phone"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              error={errors.contactPhone}
              icon={Phone}
              required
            />
          </div>

          <div className="pt-4 border-t border-slate-100">
            <div className="grid grid-cols-2 gap-5 mb-4">
              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                icon={Globe}
              />
              <Input
                label="Area"
                name="area"
                value={formData.area}
                onChange={handleChange}
                icon={MapPin}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-slate-600">
                Full Registered Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full h-[36px] rounded-xl border border-slate-200 px-4 bg-white text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-50 outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ── Internal Presentation Components ──

function StatSmall({ label, value, icon: Icon, color, bg }) {
  return (
    <div
      className={`p-4 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-teal-100 hover:shadow-sm transition-all duration-300 ${bg}`}
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
        <Icon className="w-[18px] h-[18px]" />
      </div>
    </div>
  );
}

function DetailBox({ label, value, icon: Icon }) {
  return (
    <div className="space-y-1.5 group">
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-slate-400" />
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          {label}
        </p>
      </div>
      <p className="text-[14px] font-bold text-slate-700 pl-[22px] leading-relaxed group-hover:text-teal-600 transition-colors">
        {value || "-"}
      </p>
    </div>
  );
}

function InstitutionCard({ icon: Icon, title, count }) {
  return (
    <div className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow cursor-default group">
      <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-all">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[13px] font-bold text-slate-800">{title}</p>
        <p className="text-[11px] font-medium text-slate-400 mt-0.5">
          {count} Registered Units
        </p>
      </div>
    </div>
  );
}
