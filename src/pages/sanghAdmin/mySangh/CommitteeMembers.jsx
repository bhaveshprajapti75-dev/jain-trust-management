import { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Users,
  UserCheck,
  UserMinus,
  UserPlus,
  Eye,
  Edit,
  Trash2,
  Search,
  Plus,
  Phone,
  Mail,
  Shield,
  MapPin,
  Cake,
  Droplets,
  Dna,
  Map,
  Calendar,
  ChevronDown,
  Contact,
} from "lucide-react";
import CommonPageLayout from "../../../components/common/CommonPageLayout";
import Table from "../../../components/common/Table";
import ConfirmModal from "../../../components/common/ConfirmModal";
import FilterButton from "../../../components/common/FilterButton";
import Modal from "../../../components/common/Modal";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import Pagination from "../../../components/common/Pagination";
import DatePicker from "../../../components/common/DatePicker";
import { useToast } from "../../../components/common/Toast";

const INITIAL_FORM = {
  name: "",
  role: "",
  phone: "",
  email: "",
  gender: "",
  birthDate: "",
  bloodGroup: "",
  city: "",
  address: "",
  status: "Active",
};

export default function CommitteeMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ status: "", role: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [modal, setModal] = useState({ type: null, data: null });
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const showToast = useToast();

  useEffect(() => {
    const stored = localStorage.getItem("sangh_committee_members");
    if (stored) {
      setMembers(JSON.parse(stored));
      setLoading(false);
    } else {
      setTimeout(() => {
        const defaultData = [
          {
            id: 1,
            name: "Rajesh Shah",
            role: "President",
            phone: "9876543210",
            email: "rajesh.shah@example.com",
            status: "Active",
            addedAt: "2024-01-15",
            gender: "Male",
            birthDate: "12/05/1980",
            bloodGroup: "O+",
            city: "Mumbai",
            address: "123, Jain Society, Borivali West",
          },
          {
            id: 2,
            name: "Suresh Mehta",
            role: "Secretary",
            phone: "9825011223",
            email: "suresh.m@example.com",
            status: "Active",
            addedAt: "2024-02-10",
            gender: "Male",
            birthDate: "22/08/1985",
            bloodGroup: "A+",
            city: "Ahmedabad",
            address: "45, Adarsh Nagar, Satellite",
          },
          {
            id: 3,
            name: "Amit Jain",
            role: "Treasurer",
            phone: "9988776655",
            email: "amit.jain@example.com",
            status: "Active",
            addedAt: "2024-03-05",
            gender: "Male",
            birthDate: "05/12/1990",
            bloodGroup: "B+",
            city: "Indore",
            address: "12, Mahaveer Marg",
          },
        ];
        setMembers(defaultData);
        localStorage.setItem(
          "sangh_committee_members",
          JSON.stringify(defaultData),
        );
        setLoading(false);
      }, 300);
    }
  }, []);

  const filteredMembers = useMemo(
    () =>
      members.filter(
        (m) =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (!filters.status || m.status === filters.status) &&
          (!filters.role || m.role === filters.role),
      ),
    [members, searchQuery, filters],
  );

  const paginatedMembers = useMemo(() => {
    const s = (currentPage - 1) * recordsPerPage;
    return filteredMembers.slice(s, s + recordsPerPage);
  }, [filteredMembers, currentPage, recordsPerPage]);

  const stats = [
    {
      title: "Total Member",
      value: members.length,
      icon: Users,
      color: "teal",
    },
    {
      title: "Active Member",
      value: members.filter((m) => m.status === "Active").length,
      icon: UserCheck,
      color: "emerald",
    },
    {
      title: "Inactive Member",
      value: members.filter((m) => m.status === "Inactive").length,
      icon: UserMinus,
      color: "rose",
    },
    {
      title: "Last Added",
      value: members.length
        ? members[members.length - 1].name.split(" ")[0]
        : "None",
      icon: UserPlus,
      color: "sky",
    },
  ];

  const updateMembers = (updated) => {
    setMembers(updated);
    localStorage.setItem("sangh_committee_members", JSON.stringify(updated));
  };

  const handleDelete = () => {
    updateMembers(members.filter((m) => m.id !== modal.data.id));
    setModal({ type: null, data: null });
    showToast("Member deleted successfully!", "delete");
  };

  const openModal = (type, data = null) => {
    setModal({ type, data });
    setFormData(data || INITIAL_FORM);
    setErrors({});
  };

  const handleSave = async () => {
    const newErrors = {};
    if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone must be a 10-digit number";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email address";

    if (Object.keys(newErrors).length) return setErrors(newErrors);

    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    const isEdit = modal.type === "edit";
    const updated = isEdit
      ? members.map((m) => (m.id === modal.data.id ? { ...m, ...formData } : m))
      : [
          ...members,
          {
            ...formData,
            id: Date.now(),
            addedAt: new Date().toISOString().split("T")[0],
          },
        ];
    updateMembers(updated);
    setModal({ type: null, data: null });
    setSaving(false);
    setFormData(INITIAL_FORM);
    showToast(isEdit ? "Member updated successfully!" : "Member added successfully!", "success");
  };

  const columns = [
    {
      key: "sr_no",
      label: "Sr. No",
      render: (_, __, i) => (
        <span className="text-slate-500 font-semibold">
          {(currentPage - 1) * recordsPerPage + i + 1}
        </span>
      ),
    },
    {
      key: "name",
      label: "Member Name",
      render: (n) => <span className="font-bold text-teal-700">{n}</span>,
    },
    { key: "role", label: "Position" },
    { key: "phone", label: "Phone" },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: (s, row) => (
        <button
          onClick={() => {
            const nextStatus = s === "Active" ? "Inactive" : "Active";
            updateMembers(
              members.map((m) =>
                m.id === row.id ? { ...m, status: nextStatus } : m,
              ),
            );
            showToast(`Status set to ${nextStatus} successfully!`, "success");
          }}
          className={`relative inline-flex h-5 w-9 items-center rounded-xl px-[3px] transition-colors focus:ring-2 focus:ring-offset-1 focus:ring-teal-500/20 ${s === "Active" ? "bg-emerald-500" : "bg-slate-300"}`}
        >
          <span
            className={`h-3.5 w-3.5 rounded-xl bg-white shadow-sm transition-all duration-300 ${s === "Active" ? "translate-x-[16px]" : "translate-x-0"}`}
          />
        </button>
      ),
    },
    {
      key: "actions",
      label: "Action",
      align: "center",
      render: (_, r) => {
        const btnStyles = {
          teal: "bg-teal-50 text-teal-600 hover:bg-teal-600 hover:text-white",
          sky: "bg-sky-50 text-sky-600 hover:bg-sky-600 hover:text-white",
          rose: "bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white",
        };

        return (
          <div className="flex gap-2 justify-center">
            {[
              { icon: Eye, color: "teal", t: "view" },
              { icon: Edit, color: "sky", t: "edit" },
              { icon: Trash2, color: "rose", t: "delete" },
            ].map((a) => (
              <button
                key={a.t}
                onClick={() => openModal(a.t, r)}
                className={`p-1.5 rounded-xl transition-all duration-200 ${btnStyles[a.color]}`}
                title={a.t.charAt(0).toUpperCase() + a.t.slice(1)}
              >
                <a.icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        );
      },
    },
  ];

  return (
    <CommonPageLayout title="Committee Members" stats={stats}>
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="p-4 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:max-w-sm relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name..."
              className="w-full h-[36px] pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50/30 text-[13px] outline-none focus:ring-2 focus:ring-teal-50 focus:border-teal-500 transition-all font-medium"
            />
          </div>
          <div className="flex gap-2">
            <FilterButton
              dataCount={filteredMembers.length}
              filters={filters}
              options={[
                {
                  key: "status",
                  placeholder: "Status",
                  items: [
                    { label: "Active", value: "Active" },
                    { label: "Inactive", value: "Inactive" },
                  ],
                },
                {
                  key: "role",
                  placeholder: "Position",
                  items: [...new Set(members.map((m) => m.role))].map((r) => ({
                    label: r,
                    value: r,
                  })),
                },
              ]}
              onChange={(k, v) => setFilters((f) => ({ ...f, [k]: v }))}
              onClear={() => setFilters({ status: "", role: "" })}
            />
            <button
              onClick={() => setModal({ type: "add", data: null })}
              className="h-[36px] flex items-center gap-2 bg-teal-600 text-white px-4 rounded-xl text-[13px] font-bold hover:bg-teal-700 transition-all shadow-md shadow-teal-50"
            >
              <Plus className="w-4 h-4" />
              <span>Add Member</span>
            </button>
          </div>
        </div>

        <Table
          columns={columns}
          data={paginatedMembers}
          loading={loading}
          skipCard
          emptyMessage="No members found"
        />
        <Pagination
          currentPage={currentPage}
          totalRecords={filteredMembers.length}
          recordsPerPage={recordsPerPage}
          onPageChange={setCurrentPage}
          onRecordsPerPageChange={setRecordsPerPage}
        />
      </div>

      {/* Unified Add/Edit Modal */}
      <Modal
        isOpen={modal.type === "add" || modal.type === "edit"}
        onClose={() => setModal({ type: null, data: null })}
        size="xl"
        title={`${modal.type === "edit" ? "Edit" : "Add"} Member`}
        footer={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setModal({ type: null, data: null })}
            >
              Cancel
            </Button>
            <Button loading={saving} onClick={handleSave}>
              {modal.type === "edit" ? "Update" : "Add"} Member
            </Button>
          </div>
        }
      >
        <div className="space-y-8 px-1 pb-2">
          <Section title="Basic Info" icon={Users} color="teal">
            <div className="grid md:grid-cols-3 gap-6">
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                icon={Users}
                placeholder="Enter Your Full Name"
                containerClass="md:col-span-2"
                className="h-[36px]"
                required
              />
              <Input
                label="Position"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                icon={Shield}
                placeholder="Enter Your Position"
                className="h-[36px]"
                required
              />
            </div>
          </Section>
          <Section title="Contact & Identity" icon={Contact} color="sky">
            <div className="grid md:grid-cols-3 gap-6">
              <Input
                label="Phone"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  setErrors({ ...errors, phone: null });
                }}
                icon={Phone}
                placeholder="Enter Your Phone Number"
                className="h-[36px]"
                error={errors.phone}
                required
              />
              <Input
                label="Email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  setErrors({ ...errors, email: null });
                }}
                icon={Mail}
                placeholder="Enter Your Email Address"
                containerClass="md:col-span-2"
                className="h-[36px]"
                error={errors.email}
              />
              <DatePicker
                label="Birth Date"
                value={formData.birthDate}
                onChange={(e) =>
                  setFormData({ ...formData, birthDate: e.target.value })
                }
                icon={Calendar}
                placeholder="Select Date"
              />
              <CustomSelect
                label="Gender"
                value={formData.gender}
                options={["Male", "Female", "Other"]}
                onChange={(v) => setFormData({ ...formData, gender: v })}
                icon={Dna}
                placeholder="Select Gender"
              />
              <CustomSelect
                label="Blood Group"
                value={formData.bloodGroup}
                options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
                onChange={(v) => setFormData({ ...formData, bloodGroup: v })}
                icon={Droplets}
                placeholder="Select Blood Group"
              />
            </div>
          </Section>
          <Section title="Location" icon={MapPin} color="amber">
            <div className="grid md:grid-cols-3 gap-6">
              <Input
                label="City"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                icon={Map}
                placeholder="Enter City"
                className="h-[36px]"
              />
              <div className="md:col-span-2">
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5 ml-1">
                  Full Address
                </label>
                <input
                  type="text"
                  className="w-full h-[36px] px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:ring-4 focus:ring-teal-50 focus:border-teal-500 transition-all shadow-sm"
                  placeholder="Enter complete address details..."
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>
            </div>
          </Section>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={modal.type === "view"}
        onClose={() => setModal({ type: null, data: null })}
        title="Member Details"
        size="xl"
      >
        {modal.data && (
          <div className="space-y-8">
            <Section title="Basic Info" icon={Users} color="teal">
              <div className="grid md:grid-cols-3 gap-4">
                <DetailField
                  label="Name"
                  value={modal.data.name}
                  icon={Users}
                />
                <DetailField
                  label="Role"
                  value={modal.data.role}
                  icon={Shield}
                />
                <DetailField
                  label="Added On"
                  value={modal.data.addedAt}
                  icon={Calendar}
                />
              </div>
            </Section>
            <Section title="Contact & Identity" icon={Contact} color="sky">
              <div className="grid md:grid-cols-3 gap-4">
                <DetailField
                  label="Phone"
                  value={modal.data.phone}
                  icon={Phone}
                />
                <DetailField
                  label="Email"
                  value={modal.data.email}
                  icon={Mail}
                />
                <DetailField
                  label="Gender"
                  value={modal.data.gender}
                  icon={Dna}
                />
                <DetailField
                  label="Birth Date"
                  value={modal.data.birthDate}
                  icon={Calendar}
                />
                <DetailField
                  label="Blood Group"
                  value={modal.data.bloodGroup}
                  icon={Droplets}
                />
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">
                    Status
                  </p>
                  <span
                    className={`px-3 py-1 rounded-xl text-[11px] font-bold ${modal.data.status === "Active" ? "bg-emerald-100/50 text-emerald-700" : "bg-slate-200 text-slate-600"}`}
                  >
                    {modal.data.status}
                  </span>
                </div>
              </div>
            </Section>
            <Section title="Location" icon={MapPin} color="amber">
              <div className="grid md:grid-cols-3 gap-4">
                <DetailField label="City" value={modal.data.city} icon={Map} />
                <div className="md:col-span-2 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 mb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      Address
                    </p>
                  </div>
                  <p className="text-[13px] font-semibold text-slate-800">
                    {modal.data.address || "N/A"}
                  </p>
                </div>
              </div>
            </Section>
          </div>
        )}
      </Modal>

      <ConfirmModal
        isOpen={modal.type === "delete"}
        onClose={() => setModal({ type: null, data: null })}
        onConfirm={handleDelete}
        title="Remove Member"
        variant="danger"
      />
    </CommonPageLayout>
  );
}

const Section = ({ title, icon: Icon, color, children }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
      <div
        className={`p-1.5 rounded-xl ${color === "teal" ? "bg-teal-50 text-teal-600" : color === "sky" ? "bg-sky-50 text-sky-600" : "bg-amber-50 text-amber-600"}`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">
        {title}
      </h3>
    </div>
    {children}
  </div>
);

function DetailField({ label, value, icon: Icon }) {
  return (
    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-3.5 h-3.5 text-slate-400" />
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {label}
        </p>
      </div>
      <p className="text-[13px] font-semibold text-slate-800 truncate">
        {value || "N/A"}
      </p>
    </div>
  );
}

function CustomSelect({
  label,
  value,
  options,
  onChange,
  icon: Icon,
  placeholder = "Select option",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
    width: 0,
    openUp: false,
  });
  const ref = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handle = (e) => {
      if (
        ref.current &&
        !ref.current.contains(e.target) &&
        (!dropdownRef.current || !dropdownRef.current.contains(e.target))
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const toggle = () => {
    if (!isOpen && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const shouldOpenUp = spaceBelow < 200 && rect.top > 200;
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
    <div className="relative" ref={ref}>
      {label && (
        <label className="block text-[13px] font-medium text-slate-700 mb-1.5 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        <button
          type="button"
          onClick={toggle}
          className="w-full h-[36px] flex items-center justify-between px-4 bg-slate-50/50 border border-slate-200 rounded-xl transition-all outline-none group hover:border-teal-500 hover:bg-white focus:ring-4 focus:ring-teal-50"
        >
          <span
            className={`text-sm truncate ${value ? "text-slate-700 font-medium" : "text-slate-400"}`}
          >
            {value || placeholder}
          </span>
          <div className="flex items-center gap-1.5">
            {Icon && (
              <Icon className="w-4 h-4 text-slate-400 group-hover:text-teal-500 transition-colors" />
            )}
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-300 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </div>
        </button>

        {isOpen &&
          createPortal(
            <div
              ref={dropdownRef}
              className={`fixed z-[9999] bg-white border border-slate-100 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] py-1 animate-in fade-in zoom-in-95 duration-200 ${coords.openUp ? "mb-2" : "mt-2"}`}
              style={{
                top: coords.openUp ? "auto" : coords.top,
                bottom: coords.openUp
                  ? window.innerHeight - coords.top
                  : "auto",
                left: coords.left,
                width: coords.width,
              }}
            >
              <div
                className="overflow-y-auto"
                style={{ maxHeight: `${Math.min(options.length, 6) * 40}px` }}
              >
                {options.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      onChange(opt);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-[13px] hover:bg-slate-50 hover:text-teal-600 transition-colors ${opt === value ? "bg-teal-50 text-teal-700 font-bold border-l-4 border-teal-500" : "text-slate-600"}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>,
            document.body,
          )}
      </div>
    </div>
  );
}
