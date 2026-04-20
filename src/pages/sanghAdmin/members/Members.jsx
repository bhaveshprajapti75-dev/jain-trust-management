import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Users,
  UserCheck,
  HandHeart,
  Shield,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Dna,
  Droplets,
  Map as MapIcon,
  Contact,
  Star,
  Clock,
  Zap,
  Heart,
  ChevronDown,
  X,
} from "lucide-react";
import CommonPageLayout from "../../../components/common/CommonPageLayout";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/common/Pagination";
import FilterButton from "../../../components/common/FilterButton";
import Modal from "../../../components/common/Modal";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import ConfirmModal from "../../../components/common/ConfirmModal";
import DatePicker from "../../../components/common/DatePicker";
import { useToast } from "../../../components/common/Toast";

// ── Initial State Constants ──────────────────────────────────────────────────
const INITIAL_MEMBER = {
  name: "",
  family_category: "",
  role: "",
  gender: "",
  blood_group: "",
  mobile: "",
  email: "",
  birthDate: "",
  address: "",
  status: "Active",
  is_volunteer: false,
  is_family_head: false,
};

const SEED_MEMBERS = [
  {
    id: 1,
    name: "Rajesh Shah",
    familyId: 100,
    family_category: "General",
    role: "Head",
    mobile: "9876543210",
    email: "rajesh.shah@example.com",
    birthDate: "12/05/1980",
    gender: "Male",
    blood_group: "O+",
    address: "123, Jain Society, Borivali West",
    status: "Active",
    is_family_head: true,
    is_volunteer: false,
  },
  {
    id: 101,
    name: "Anik Shah",
    familyId: 100,
    family_category: "General",
    role: "Son",
    mobile: "9876543211",
    email: "anik.shah@example.com",
    birthDate: "10/03/2000",
    gender: "Male",
    blood_group: "O+",
    address: "123, Jain Society, Borivali West",
    status: "Active",
    is_family_head: false,
    is_volunteer: true,
  },
  {
    id: 102,
    name: "Megha Shah",
    familyId: 100,
    family_category: "General",
    role: "Daughter",
    mobile: "9876543212",
    email: "megha.shah@example.com",
    birthDate: "14/07/2003",
    gender: "Female",
    blood_group: "A+",
    address: "123, Jain Society, Borivali West",
    status: "Active",
    is_family_head: false,
    is_volunteer: false,
  },
];

// ── Helper Components ───────────────────────────────────────────────────────
const Section = ({ title, icon: Icon, color = "teal", children }) => {
  const colors = {
    teal: "text-teal-600 bg-teal-50 border-teal-100",
    sky: "text-sky-600 bg-sky-50 border-sky-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    orange: "text-orange-600 bg-orange-50 border-orange-100",
  };
  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center gap-2.5 px-1">
        <div className={`p-1.5 rounded-lg border ${colors[color]}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        <h3 className="text-[13px] font-bold text-slate-700 uppercase tracking-wider">
          {title}
        </h3>
      </div>
      <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm relative overflow-hidden group/sec">
        <div
          className={`absolute top-0 left-0 w-1 h-full bg-${color}-500 opacity-0 group-hover/sec:opacity-100 transition-opacity`}
        />
        {children}
      </div>
    </div>
  );
};

const DetailField = ({ label, value, icon: Icon, containerClass = "" }) => (
  <div
    className={`p-3.5 rounded-xl bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:border-teal-100 group/field ${containerClass}`}
  >
    <div className="flex items-center gap-2 mb-1.5">
      <Icon className="w-3.5 h-3.5 text-slate-400 group-hover/field:text-teal-500 transition-colors" />
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
        {label}
      </p>
    </div>
    <p className="text-[13px] font-bold text-slate-700">
      {value || "Not Provided"}
    </p>
  </div>
);

const CustomSelect = ({
  label,
  value,
  options,
  onChange,
  icon: Icon,
  placeholder,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      // Max height of dropdown is ~220px, check if we have enough space
      setOpenUp(spaceBelow < 220 && rect.top > spaceBelow);
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-[13px] font-medium text-slate-700 mb-1.5 ml-1 flex items-center gap-2">
        {Icon && <Icon className="w-3.5 h-3.5 text-slate-400" />}
        {label}
      </label>
      <button
        type="button"
        onClick={handleToggle}
        className={`w-full h-[36px] px-4 rounded-xl border flex items-center justify-between text-sm transition-all focus:ring-4 focus:ring-teal-50 ${error
          ? "border-rose-300 bg-rose-50/30"
          : "border-slate-200 bg-slate-50/50 hover:bg-white hover:border-teal-300"
          }`}
      >
        <span className={value ? "text-slate-700 font-medium" : "text-slate-400"}>
          {value || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className={`absolute z-[60] w-full bg-white rounded-xl border border-slate-100 shadow-[0_15px_40px_-12px_rgba(0,0,0,0.15)] py-1.5 overflow-hidden animate-in zoom-in-95 duration-200 ${openUp ? "bottom-full mb-1.5" : "top-full mt-1.5"}`}>
          <div className="max-h-[220px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-[13px] font-medium transition-colors hover:bg-teal-50 hover:text-teal-700 ${value === opt ? "bg-teal-50 text-teal-700" : "text-slate-600"}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
      {error && (
        <p className="mt-1.5 ml-1 text-[11px] font-bold text-rose-500 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Members() {
  const showToast = useToast();
  const [activeTab, setActiveTab] = useState("Member");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ status: "", family_category: "", is_volunteer: "", role: "" });
  const [loading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [familyCategories, setFamilyCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [viewingFamilyMember, setViewingFamilyMember] = useState(null);
  const familyDetailRef = useRef(null);

  useEffect(() => {
    if (viewingFamilyMember && familyDetailRef.current) {
      setTimeout(() => {
        familyDetailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [viewingFamilyMember]);

  const [individualMembers, setIndividualMembers] = useState(SEED_MEMBERS);

  const stats = useMemo(
    () => [
      {
        title: "Total Members",
        value: individualMembers.length,
        icon: UserCheck,
        color: "teal",
      },
      {
        title: "Volunteers",
        value: individualMembers.filter((m) => m.is_volunteer).length,
        icon: HandHeart,
        color: "sky",
      },
      {
        title: "Active Volunteers",
        value: individualMembers.filter((m) => m.is_volunteer && m.status === "Active").length,
        icon: Shield,
        color: "amber",
      },
    ],
    [individualMembers],
  );

  const [modal, setModal] = useState({ type: null, data: null });
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const BLANK_MEMBER_ENTRY = () => ({
    name: "", email: "", mobile: "", blood_group: "", birthDate: "",
    address: "", is_family_head: false, is_volunteer: false, role: "",
    family_category: "", gender: "Male",
  });
  const [membersList, setMembersList] = useState([BLANK_MEMBER_ENTRY()]);

  const openModal = (type, data = null) => {
    setModal({ type, data });
    setErrors({});
    if (type === "addCategory") {
      setNewCategory("");
    } else if (type === "add") {
      setMembersList([BLANK_MEMBER_ENTRY()]);
      setFormData({});
    } else if (type === "edit" || type === "view") {
      setFormData(data || INITIAL_MEMBER);
    }
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      showToast("Please enter a category name", "error");
      return;
    }
    if (familyCategories.includes(newCategory.trim())) {
      showToast("Category already exists", "error");
      return;
    }
    setFamilyCategories((prev) => [...prev, newCategory.trim()]);
    setNewCategory("");
    setModal({ type: null, data: null });
    showToast("Category added successfully!", "success");
  };

  const handleSave = async () => {
    const newErrors = {};

    if (modal.type === "add") {
      let hasError = false;
      membersList.forEach((m, i) => {
        if (!m.name.trim()) { newErrors[`name_${i}`] = "Name required"; hasError = true; }
        if (m.mobile && !/^\d{10}$/.test(m.mobile)) { newErrors[`mobile_${i}`] = "Must be 10 digits"; hasError = true; }
      });
      if (hasError) return setErrors(newErrors);

      const batchId = Date.now();
      const newRecords = membersList.map((m, i) => ({
        ...m,
        id: batchId + i,
        familyId: batchId,
        status: "Active",
      }));
      setIndividualMembers((prev) => [...prev, ...newRecords]);
    } else {
      if (!formData.name?.trim()) newErrors.name = "Name required";
      if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) newErrors.mobile = "Must be 10 digits";
      if (Object.keys(newErrors).length) return setErrors(newErrors);

      setSaving(true);
      await new Promise((r) => setTimeout(r, 600));
      setIndividualMembers((prev) =>
        prev.map((m) => m.id === modal.data.id ? { ...m, ...formData } : m)
      );
    }

    setModal({ type: null, data: null });
    setSaving(false);
    showToast(modal.type === "edit" ? "Member updated successfully!" : "Member(s) added successfully!", "success");
  };

  const handleDelete = () => {
    setIndividualMembers((prev) => prev.filter((m) => m.id !== modal.data.id));
    setModal({ type: null, data: null });
    showToast(`Member deleted successfully!`, "delete");
  };

  const updateStatus = (id) => {
    const flip = (s) => (s === "Active" ? "Inactive" : "Active");
    let nextStatus = "";
    setIndividualMembers((prev) => {
      const updated = prev.map((m) =>
        m.id === id ? { ...m, status: flip(m.status) } : m
      );
      nextStatus = updated.find((m) => m.id === id)?.status ?? "";
      return updated;
    });
    setTimeout(() => {
      showToast(`Status set to ${nextStatus} successfully!`, "success");
    }, 0);
  };

  const updateVolunteerStatus = (id) => {
    let nextVal = false;
    setIndividualMembers((prev) => {
      return prev.map((m) => {
        if (m.id === id) {
          nextVal = !m.is_volunteer;
          return { ...m, is_volunteer: nextVal };
        }
        return m;
      });
    });
    setTimeout(() => {
      showToast(nextVal ? "Member added to volunteers list!" : "Member removed from volunteers list!", "success");
    }, 0);
  };

  const filteredData = useMemo(() => {
    let data = individualMembers;
    if (activeTab === "Member") {
      const seenFamilies = new Set();
      data = data.filter(m => {
        if (!m.familyId) return true;
        if (m.is_family_head) {
          seenFamilies.add(m.familyId);
          return true;
        }
        return false;
      });
      individualMembers.forEach(m => {
        if (m.familyId && !seenFamilies.has(m.familyId)) {
          const firstInFamily = individualMembers.find(fm => fm.familyId === m.familyId);
          if (firstInFamily && firstInFamily.id === m.id) {
            seenFamilies.add(m.familyId);
            data.push(m);
          }
        }
      });
      data = Array.from(new Map(data.map(item => [item.id, item])).values());
    } else {
      data = data.filter((m) => m.is_volunteer);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter((item) => item.name.toLowerCase().includes(q) || item.mobile?.includes(q));
    }
    if (filters.status) data = data.filter((item) => item.status === filters.status);
    if (filters.family_category) data = data.filter((item) => item.family_category === filters.family_category);
    if (filters.role) data = data.filter((item) => item.role === filters.role);
    if (filters.is_volunteer) {
      const isVol = filters.is_volunteer === "Yes";
      data = data.filter((item) => item.is_volunteer === isVol);
    }

    return data;
  }, [activeTab, searchQuery, filters, individualMembers]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    return filteredData.slice(startIndex, startIndex + recordsPerPage);
  }, [filteredData, currentPage, recordsPerPage]);

  const actionRender = (_, r) => (
    <div className="flex gap-2 justify-center">
      <button onClick={() => openModal("view", r)} className="p-1.5 rounded-xl bg-teal-50 text-teal-600 hover:bg-teal-600 hover:text-white transition-all"><Eye className="w-4 h-4" /></button>
      <button onClick={() => openModal("edit", r)} className="p-1.5 rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-600 hover:text-white transition-all"><Edit className="w-4 h-4" /></button>
      <button onClick={() => openModal("delete", r)} className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
    </div>
  );

  const statusRender = (s, row) => (
    <button
      onClick={() => updateStatus(row.id)}
      className={`relative inline-flex h-5 w-9 items-center rounded-xl px-[3px] transition-colors ${s === "Active" ? "bg-emerald-500" : "bg-slate-300"}`}
    >
      <span className={`h-3.5 w-3.5 rounded-xl bg-white transition-all duration-300 ${s === "Active" ? "translate-x-[16px]" : "translate-x-0"}`} />
    </button>
  );

  const columns = [
    { key: "sr_no", label: "Sr. No", align: "center", render: (_, __, i) => <span className="text-slate-500 font-semibold">{(currentPage - 1) * recordsPerPage + i + 1}</span> },
    { key: "name", label: "Name", align: "center", render: (v) => <span className="font-bold text-teal-700">{v}</span> },
    { key: "family_category", label: "Category", align: "center" },
    { key: "role", label: "Relationship", align: "center", render: (v, r) => r?.is_family_head ? <span className="text-teal-600 font-bold">Head</span> : v },
    { key: "mobile", label: "Mobile", align: "center" },
    ...(activeTab === "Member" ? [{
      key: "is_volunteer",
      label: "Volunteer Status",
      align: "center",
      render: (v, r) => (
        <button onClick={() => updateVolunteerStatus(r?.id)} className={`relative inline-flex h-5 w-9 items-center rounded-xl px-[3px] transition-colors ${v ? "bg-emerald-500" : "bg-slate-300"}`}><span className={`h-3.5 w-3.5 rounded-xl bg-white transition-all duration-300 ${v ? "translate-x-[16px]" : "translate-x-0"}`} /></button>
      )
    }] : []),
    { key: "status", label: "Account Status", align: "center", render: statusRender },
    { key: "actions", label: "Action", align: "center", render: actionRender },
  ];

  const field = (key) => ({
    value: formData?.[key] ?? "",
    onChange: (e) => setFormData((p) => ({ ...p, [key]: e.target.value })),
  });

  return (
    <CommonPageLayout title="Member Management" stats={stats}>
      {/* Tab Switcher */}
      <div className="bg-white rounded-xl border border-slate-100 p-1 mb-5 flex gap-1">
        {["Member", "Volunteers"].map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
            className={`flex-1 py-2.5 rounded-xl text-[13px] font-bold transition-all ${activeTab === tab ? "bg-teal-50 text-teal-700 shadow-sm" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50/50"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-500">
        <div className="p-4 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:max-w-sm relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search members...`}
              className="w-full h-[36px] pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50/30 text-[13px] outline-none focus:ring-2 focus:ring-teal-50 focus:border-teal-500 transition-all font-medium"
            />
          </div>
          <div className="flex gap-2">
            <FilterButton
              dataCount={filteredData.length}
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
                  key: "family_category",
                  placeholder: "Family Category",
                  items: familyCategories.map((cat) => ({
                    label: cat,
                    value: cat,
                  })),
                },
                {
                  key: "role",
                  placeholder: "Position",
                  items: [...new Set(individualMembers.map(m => m.role).filter(Boolean))].map(r => ({ label: r, value: r })),
                },
                {
                  key: "is_volunteer",
                  placeholder: "Volunteer",
                  items: [
                    { label: "Yes", value: "Yes" },
                    { label: "No", value: "No" },
                  ],
                },
              ]}
              onChange={(k, v) => {
                setFilters((f) => ({ ...f, [k]: v }));
                setCurrentPage(1);
              }}
              onClear={() => {
                setFilters({ status: "", family_category: "", is_volunteer: "", role: "" });
                setCurrentPage(1);
              }}
            />
            {activeTab === "Member" && (
              <button onClick={() => openModal("addCategory")} className="h-[36px] flex items-center gap-2 bg-teal-600 text-white px-4 rounded-xl text-[13px] font-bold hover:bg-teal-700 transition-all shadow-md shadow-teal-50"><Plus className="w-4 h-4" /> Family Category</button>
            )}
            {activeTab === "Member" && (
              <button onClick={() => openModal("add")} className="h-[36px] flex items-center gap-2 bg-teal-600 text-white px-4 rounded-xl text-[13px] font-bold hover:bg-teal-700 transition-all shadow-md shadow-teal-50"><Plus className="w-4 h-4" /> Add Member</button>
            )}
          </div>
        </div>

        <Table columns={columns} data={paginatedData} loading={loading} skipCard />
        <Pagination currentPage={currentPage} totalRecords={filteredData.length} recordsPerPage={recordsPerPage} onPageChange={setCurrentPage} onRecordsPerPageChange={setRecordsPerPage} />
      </div>

      {/* ═══ Add Category Modal ═══ */}
      <Modal isOpen={modal.type === "addCategory"} onClose={() => setModal({ type: null, data: null })} title="Add Family Category" size="sm">
        <div className="space-y-4">
          <Input label="Category Name" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="e.g. Life Member" autoFocus />
          <Button className="w-full" onClick={handleAddCategory}>Add Category</Button>
        </div>
      </Modal>

      {/* ═══ Add / Edit Modal ═══════════════════════════════════════════════════ */}
      <Modal
        isOpen={modal.type === "add" || modal.type === "edit"}
        onClose={() => setModal({ type: null, data: null })}
        size="xl"
        title={modal.type === "edit" ? "Edit Member Details" : "Add New Members"}
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setModal({ type: null, data: null })}>Cancel</Button>
            <Button loading={saving} onClick={handleSave}>{modal.type === "edit" ? "Update" : "Register Batch"}</Button>
          </div>
        }
      >
        <div className="space-y-8 pb-3">
          {modal.type === "add" ? (
            <div className="space-y-6">
              {membersList.map((m, i) => (
                <div key={i} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 relative group/entry animate-in slide-in-from-right duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center text-[11px] font-bold">{i + 1}</div>
                      <h4 className="text-[13px] font-bold text-slate-700">Member Entry</h4>
                    </div>
                    {membersList.length > 1 && (
                      <button onClick={() => setMembersList(prev => prev.filter((_, idx) => idx !== i))} className="p-1 px-3 rounded-lg text-[11px] font-bold text-rose-500 hover:bg-rose-50 transition-colors">Remove</button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input label="Name" value={m.name} onChange={e => { const list = [...membersList]; list[i].name = e.target.value; setMembersList(list); }} />
                    <Input label="Mobile" value={m.mobile} onChange={e => { const list = [...membersList]; list[i].mobile = e.target.value; setMembersList(list); }} />
                    <CustomSelect label="Relationship" value={m.role} options={["Husband", "Wife", "Son", "Daughter", "Father", "Mother", "Other"]} onChange={v => { const list = [...membersList]; list[i].role = v; setMembersList(list); }} placeholder="Select relationship" />
                    <CustomSelect label="Gender" value={m.gender} options={["Male", "Female", "Other"]} onChange={v => { const list = [...membersList]; list[i].gender = v; setMembersList(list); }} placeholder="Select Gender" />
                    <DatePicker label="Birth Date" value={m.birthDate} onChange={e => { const list = [...membersList]; list[i].birthDate = e.target.value; setMembersList(list); }} icon={Calendar} />
                    <CustomSelect label="Blood Group" value={m.blood_group} options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]} onChange={v => { const list = [...membersList]; list[i].blood_group = v; setMembersList(list); }} placeholder="Select Blood Group" />
                    <CustomSelect label="Family Category" value={m.family_category} options={familyCategories} onChange={v => { const list = [...membersList]; list[i].family_category = v; setMembersList(list); }} placeholder="Select Family Category" />
                    <div className="flex items-center gap-6 mt-4 md:col-span-2">
                      <label className="flex items-center gap-2 cursor-pointer group"><input type="checkbox" checked={m.is_family_head} onChange={e => { const list = [...membersList]; list[i].is_family_head = e.target.checked; setMembersList(list); }} className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" /> <span className="text-[12px] font-bold text-slate-600 group-hover:text-teal-600 transition-colors">Family Head?</span></label>
                      <label className="flex items-center gap-2 cursor-pointer group"><input type="checkbox" checked={m.is_volunteer} onChange={e => { const list = [...membersList]; list[i].is_volunteer = e.target.checked; setMembersList(list); }} className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" /> <span className="text-[12px] font-bold text-slate-600 group-hover:text-teal-600 transition-colors">Register as Volunteer?</span></label>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={() => setMembersList([...membersList, BLANK_MEMBER_ENTRY()])} className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-teal-300 hover:text-teal-600 hover:bg-teal-50/30 transition-all font-bold text-[13px] flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Add Another Family Member</button>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
              <Section title="Primary Details" icon={Contact} color="sky">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input label="Full Name" {...field("name")} icon={Users} error={errors.name} required />
                  <Input label="Mobile" {...field("mobile")} icon={Phone} error={errors.mobile} />
                  <Input label="Email" {...field("email")} icon={Mail} />
                  <DatePicker label="Birth Date" value={formData?.birthDate} onChange={v => setFormData(p => ({ ...p, birthDate: v.target.value }))} icon={Calendar} />
                  <CustomSelect label="Relationship" value={formData.role} options={["Head", "Husband", "Wife", "Son", "Daughter", "Father", "Mother", "Other"]} onChange={v => setFormData(p => ({ ...p, role: v }))} placeholder="Select relationship" />
                  <CustomSelect label="Family Category" value={formData.family_category} options={familyCategories} onChange={v => setFormData(p => ({ ...p, family_category: v }))} placeholder="Select Family Category" />
                  <CustomSelect label="Gender" value={formData.gender} options={["Male", "Female", "Other"]} onChange={v => setFormData(p => ({ ...p, gender: v }))} placeholder="Select Gender" />
                  <CustomSelect label="Blood Group" value={formData.blood_group} options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]} onChange={v => setFormData(p => ({ ...p, blood_group: v }))} placeholder="Select Blood Group" />
                </div>
                <div className="mt-6 flex gap-6 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={formData.is_family_head} onChange={e => setFormData(p => ({ ...p, is_family_head: e.target.checked }))} className="w-4 h-4 rounded text-teal-600" /> <span className="text-[12px] font-bold text-slate-700 underline underline-offset-4 decoration-teal-200">Family Head?</span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={formData.is_volunteer} onChange={e => setFormData(p => ({ ...p, is_volunteer: e.target.checked }))} className="w-4 h-4 rounded text-emerald-600" /> <span className="text-[12px] font-bold text-slate-700 underline underline-offset-4 decoration-emerald-200">Volunteer?</span></label>
                </div>
              </Section>
              <Section title="Location" icon={MapPin} color="amber">
                <Input label="Complete Address" {...field("address")} icon={MapIcon} placeholder="Residential address..." />
              </Section>

              {/* Family Members Section in Edit Mode */}
              {formData.familyId && individualMembers.filter(m => m.familyId === formData.familyId && m.id !== formData.id).length > 0 && (
                <Section title="Family Unit" icon={Users} color="orange">
                  <div className="space-y-3">
                    {individualMembers.filter(m => m.familyId === formData.familyId && m.id !== formData.id).map((fm, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 group/fm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center text-[11px] font-extrabold">{idx + 1}</div>
                          <div>
                            <p className="text-[13px] font-bold text-slate-700">{fm.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{fm.is_family_head ? "Head" : fm.role || "Member"}</p>
                          </div>
                        </div>
                        <button onClick={() => { setModal({ type: "edit", data: fm }); setFormData(fm); }} className="px-4 py-1.5 rounded-xl bg-white border border-slate-200 text-teal-600 text-[11px] font-bold hover:bg-teal-600 hover:text-white hover:border-teal-600 transition-all shadow-sm">Quick Edit</button>
                      </div>
                    ))}
                  </div>
                </Section>
              )}
            </div>
          )}
        </div>
      </Modal>

      {/* ═══ View Modal ═══════════════════════════════════════════════════════════ */}
      <Modal isOpen={modal.type === "view"} onClose={() => { setModal({ type: null, data: null }); setViewingFamilyMember(null); }} title="Member Information" size="xl">
        {modal.data && (
          <div className="relative -mx-1">
            <div className="space-y-8 pb-4">
              <Section title="Basic Info" icon={Users} color="teal">
                <div className="grid md:grid-cols-4 gap-4">
                  <DetailField label="Name" value={modal.data.name} icon={Users} />
                  <DetailField label="Category" value={modal.data.family_category} icon={Star} />
                  <DetailField label="Relationship" value={modal.data.is_family_head ? "Head" : modal.data.role} icon={Heart} />
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Volunteer</p>
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-lg w-fit ${modal.data.is_volunteer ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"}`}>{modal.data.is_volunteer ? "Active Volunteer" : "No"}</span>
                  </div>
                </div>
              </Section>

              <Section title="Contact & Identity" icon={Contact} color="sky">
                <div className="grid md:grid-cols-3 gap-4">
                  <DetailField label="Mobile" value={modal.data.mobile} icon={Phone} />
                  <DetailField label="Email" value={modal.data.email} icon={Mail} containerClass="md:col-span-2" />
                  <DetailField label="Birthday" value={modal.data.birthDate} icon={Calendar} />
                  <DetailField label="Gender" value={modal.data.gender} icon={Dna} />
                  <DetailField label="Blood Group" value={modal.data.blood_group} icon={Droplets} />
                </div>
              </Section>

              <Section title="Location" icon={MapPin} color="amber">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-2"><MapPin className="w-3 h-3" /> Residential Address</p>
                  <p className="text-[13px] font-bold text-slate-700 leading-relaxed">{modal.data.address || "No address on file"}</p>
                </div>
              </Section>

              {modal.data.familyId && (
                <div className="space-y-8">
                  <Section title="Full Family Details" icon={Users} color="orange">
                    <div className="space-y-3">
                      {individualMembers.filter(m => m.familyId === modal.data.familyId).map((fm, idx) => (
                        <div
                          key={idx}
                          onClick={() => setViewingFamilyMember(fm)}
                          className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${viewingFamilyMember?.id === fm.id ? "bg-teal-50 border-teal-500 shadow-md ring-1 ring-teal-500/20" : fm.id === modal.data.id ? "bg-teal-50/30 border-teal-100" : "bg-white border-slate-100 hover:border-slate-200 hover:shadow-md"}`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-[13px] ${fm.id === modal.data.id ? "bg-teal-600 text-white shadow-lg shadow-teal-600/20" : "bg-slate-100 text-slate-400"}`}>{idx + 1}</div>
                            <div>
                              <p className="text-[14px] font-bold text-slate-700">{fm.name} {fm.id === modal.data.id && <span className="text-[10px] bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded ml-2 uppercase tracking-tighter">Current</span>}</p>
                              <div className="flex items-center gap-3">
                                <span className="text-[11px] font-bold text-slate-400 uppercase">{fm.is_family_head ? "Family Head" : fm.role || "Member"}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-200" />
                                <span className="text-[11px] font-bold text-slate-400">{fm.gender || "N/A"}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[13px] font-bold text-slate-600">{fm.mobile || "No Mobile"}</p>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${fm.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100"}`}>{fm.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Section>

                  {/* Inline Family Member Details */}
                  {viewingFamilyMember && (
                    <div ref={familyDetailRef} className="animate-in slide-in-from-top-4 duration-500 pb-10">
                      <div className="flex items-center justify-between mb-6 pt-8 border-t border-dashed border-teal-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-200">
                            <Users className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-[16px] font-bold text-slate-800 leading-tight">{viewingFamilyMember.name}'s Details</h3>
                            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">Extended Member Profile</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setViewingFamilyMember(null)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 text-rose-600 font-bold text-[11px] hover:bg-rose-100 transition-all border border-rose-100"
                        >
                          <X className="w-3.5 h-3.5" /> Close Details
                        </button>
                      </div>

                      <div className="space-y-8">
                        <Section title="Basic Info" icon={Users} color="teal">
                          <div className="grid md:grid-cols-4 gap-4">
                            <DetailField label="Name" value={viewingFamilyMember.name} icon={Users} />
                            <DetailField label="Category" value={viewingFamilyMember.family_category} icon={Star} />
                            <DetailField label="Relationship" value={viewingFamilyMember.is_family_head ? "Head" : viewingFamilyMember.role} icon={Heart} />
                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-center">
                              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Volunteer</p>
                              <span className={`text-[11px] font-bold px-3 py-1 rounded-lg w-fit ${viewingFamilyMember.is_volunteer ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"}`}>{viewingFamilyMember.is_volunteer ? "Active Volunteer" : "No"}</span>
                            </div>
                          </div>
                        </Section>

                        <Section title="Contact & Identity" icon={Contact} color="sky">
                          <div className="grid md:grid-cols-3 gap-4">
                            <DetailField label="Mobile" value={viewingFamilyMember.mobile} icon={Phone} />
                            <DetailField label="Email" value={viewingFamilyMember.email} icon={Mail} containerClass="md:col-span-2" />
                            <DetailField label="Birthday" value={viewingFamilyMember.birthDate} icon={Calendar} />
                            <DetailField label="Gender" value={viewingFamilyMember.gender} icon={Dna} />
                            <DetailField label="Blood Group" value={viewingFamilyMember.blood_group} icon={Droplets} />
                          </div>
                        </Section>

                        <Section title="Location" icon={MapPin} color="amber">
                          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-2"><MapPin className="w-3 h-3" /> Residential Address</p>
                            <p className="text-[13px] font-bold text-slate-700 leading-relaxed">{viewingFamilyMember.address || "No address on file"}</p>
                          </div>
                        </Section>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={modal.type === "delete"}
        onClose={() => setModal({ type: null, data: null })}
        onConfirm={handleDelete}
        title="Delete Member"
        message={`Are you sure you want to delete ${modal.data?.name}? This action cannot be undone.`}
        variant="danger"
      />
    </CommonPageLayout>
  );
}
