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
  ChevronRight,
  ArrowLeft,
  X,
} from "lucide-react";
import CommonPageLayout from "../../../components/ui/CommonPageLayout";
import Table from "../../../components/ui/Table";
import Pagination from "../../../components/ui/Pagination";
import FilterButton from "../../../components/ui/FilterButton";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import DatePicker from "../../../components/ui/DatePicker";
import StatusToggle from "../../../components/ui/StatusToggle";
import { useToast } from "../../../components/ui/Toast";
import ActionButtons from "../../../components/ui/ActionButtons";
import { memberService } from "../../../services/memberService";

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
  area: "",
  city: "",
  pincode: "",
  status: "Active",
  is_volunteer: false,
  is_family_head: false,
};

// ── Seed members removed - now using Postgres via memberService ──

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
  disabled
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, openUp: false });
  const containerRef = useRef(null);
  const portalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        containerRef.current && 
        !containerRef.current.contains(e.target) &&
        (!portalRef.current || !portalRef.current.contains(e.target))
      )
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (disabled) return;
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      // Max height of dropdown is ~220px, check if we have enough space
      const shouldOpenUp = spaceBelow < 250 && rect.top > 250;
      setCoords({
        top: shouldOpenUp ? rect.top : rect.bottom,
        left: rect.left,
        width: rect.width,
        openUp: shouldOpenUp
      });
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
        disabled={disabled}
        onClick={handleToggle}
        className={`w-full h-[36px] px-4 rounded-xl border flex items-center justify-between text-sm transition-all focus:ring-4 focus:ring-teal-50 ${error
          ? "border-rose-300 bg-rose-50/30"
          : "border-slate-200 bg-slate-50/50 hover:bg-white hover:border-teal-300"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span className={value ? "text-slate-700 font-medium" : "text-slate-400"}>
          {value || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && createPortal(
        <div 
          ref={portalRef}
          className={`fixed z-[10000] bg-white rounded-xl border border-slate-100 shadow-[0_15px_40px_-12px_rgba(0,0,0,0.15)] py-1.5 overflow-hidden animate-in zoom-in-95 duration-200 ${coords.openUp ? "mb-1.5" : "mt-1.5"}`}
          style={{
            top: coords.openUp ? "auto" : coords.top,
            bottom: coords.openUp ? window.innerHeight - coords.top : "auto",
            left: coords.left,
            width: coords.width
          }}
        >
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
        </div>,
        document.body
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
  const [activeTab, setActiveTab] = useState("Family");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [familyCategories, setFamilyCategories] = useState([
    { id: 1, category: "General", status: "Active" },
    { id: 2, category: "Life Member", status: "Active" },
    { id: 3, category: "Niyat", status: "Active" },
    { id: 4, category: "Other", status: "Active" }
  ]);
  const [newCategory, setNewCategory] = useState("");
  const [filters, setFilters] = useState({ status: "", family_category: "", is_volunteer: "", role: "" });
  const [loading, setLoading] = useState(true);
  const [individualMembers, setIndividualMembers] = useState([]);
  const [viewingFamilyMember, setViewingFamilyMember] = useState(null);
  const familyDetailRef = useRef(null);

  const MEMBER_TABS = ['Personal Information', 'Family Member', 'Location'];
  const [activeModalTab, setActiveModalTab] = useState(0);

  useEffect(() => {
    setFilters({ status: "", family_category: "", is_volunteer: "", role: "" });
    setCurrentPage(1);
  }, [activeTab]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const data = await memberService.getMembers();
      setIndividualMembers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch members:", error);
      showToast("Could not load members from server", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    if (viewingFamilyMember && familyDetailRef.current) {
      setTimeout(() => {
        familyDetailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [viewingFamilyMember]);

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
    address: "", area: "", city: "", pincode: "",
    is_family_head: false, is_volunteer: false, role: "",
    family_category: "", gender: "Male"
  });
  const [membersList, setMembersList] = useState([]);

  const openModal = (type, data = null) => {
    setModal({ type, data });
    setErrors({});
    setActiveModalTab(0);
    if (type === "addCategory") {
      setNewCategory("");
    } else if (type === "add") {
      setMembersList([]);
      setFormData(INITIAL_MEMBER);
    } else if (type === "edit" || type === "view" || type === "editCategory" || type === "viewCategory") {
      setMembersList([]);
      setFormData(data || INITIAL_MEMBER);
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      const newId = familyCategories.length > 0 ? Math.max(...familyCategories.map(c => c.id)) + 1 : 1;
      setFamilyCategories([...familyCategories, { id: newId, category: newCategory.trim(), status: "Active" }]);
      setNewCategory("");
      setModal({ type: null, data: null });
      showToast("Category added successfully!", "success");
    }
  };

  const handleSave = async () => {
    const newErrors = {};

    if (modal.type === "add") {
      if (!formData.name?.trim()) newErrors.name = "Name required";
      if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) newErrors.mobile = "Must be 10 digits";
      let hasError = Object.keys(newErrors).length > 0;
      membersList.forEach((m, i) => {
        if (!m.name.trim()) { newErrors[`name_${i}`] = "Name required"; hasError = true; }
        if (m.mobile && !/^\d{10}$/.test(m.mobile)) { newErrors[`mobile_${i}`] = "Must be 10 digits"; hasError = true; }
      });
      if (hasError) return setErrors(newErrors);

      setSaving(true);
      try {
        const primary = await memberService.createMember({ ...formData, status: "Active" });
        for (const m of membersList) {
          await memberService.createMember({ ...m, status: "Active", familyId: primary.id });
        }
        showToast("Member(s) registered successfully!", "success");
        fetchMembers();
      } catch (error) {
        showToast("Failed to save member", "error");
      }
    } else {
      if (!formData.name?.trim()) newErrors.name = "Name required";
      if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) newErrors.mobile = "Must be 10 digits";
      if (Object.keys(newErrors).length) return setErrors(newErrors);

      setSaving(true);
      try {
        await memberService.updateMember(modal.data.id, formData);
        if (membersList.length > 0) {
          for (const m of membersList) {
            await memberService.createMember({ ...m, status: "Active", familyId: formData.familyId });
          }
        }
        showToast("Member updated successfully!", "success");
        fetchMembers();
      } catch (error) {
        showToast("Update failed", "error");
      }
    }

    setModal({ type: null, data: null });
    setSaving(false);
  };

  const handleDelete = async () => {
    try {
      await memberService.deleteMember(modal.data.id);
      showToast(`Member removed from database!`, "delete");
      fetchMembers();
    } catch (error) {
      showToast("Delete failed", "error");
    }
    setModal({ type: null, data: null });
  };

  const updateStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === "Active" ? "Inactive" : "Active";
    try {
      await memberService.updateMember(id, { status: nextStatus });
      showToast(`Status updated to ${nextStatus}`, "success");
      fetchMembers();
    } catch (error) {
      showToast("Failed to update status", "error");
    }
  };

  const updateVolunteerStatus = async (id, currentVal) => {
    const nextVal = !currentVal;
    try {
      await memberService.updateMember(id, { is_volunteer: nextVal });
      showToast(nextVal ? "Added to volunteers!" : "Removed from volunteers", "success");
      fetchMembers();
    } catch (error) {
      showToast("Action failed", "error");
    }
  };

  const filteredData = useMemo(() => {
    let data = individualMembers;
    if (activeTab === "Family") {
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
    } else if (activeTab === "Volunteers") {
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
    <ActionButtons
      onView={() => openModal("view", r)}
      onEdit={() => openModal("edit", r)}
      onDelete={() => openModal("delete", r)}
      row={r}
    />
  );

  const statusRender = (s, row) => (
    <StatusToggle status={s === "Active"} onToggle={() => updateStatus(row.id, s)} />
  );

  const columns = [
    { key: "sr_no", label: "Sr. No", align: "left", render: (_, __, i) => <span className="text-[12.5px] text-[#1A1A1A]">{(currentPage - 1) * recordsPerPage + i + 1}</span> },
    { key: "name", label: "Name", align: "center", render: (v) => <span className="text-[12.5px] text-[#1A1A1A]">{v}</span> },
    { key: "family_category", label: "Category", align: "center" },
    { key: "role", label: "Relationship", align: "center", render: (v, r) => <span className="text-[12.5px] text-[#1A1A1A]">{r?.is_family_head ? "Head" : v}</span> },
    { key: "mobile", label: "Mobile", align: "center" },
    ...(activeTab === "Member" ? [{
      key: "is_volunteer",
      label: "Volunteer Status",
      align: "center",
      render: (v, r) => (
        <div className="flex justify-center">
          <StatusToggle status={v} onToggle={() => updateVolunteerStatus(r?.id, v)} />
        </div>
      )
    }] : []),
    { key: "status", label: "Status", align: "center", render: statusRender },
    { key: "actions", label: "Action", align: "center", render: actionRender },
  ];

  const familyColumns = [
    { key: "sr_no", label: "Sr. No", align: "left", render: (_, __, i) => <span className="text-[12.5px] text-[#1A1A1A]">{(currentPage - 1) * recordsPerPage + i + 1}</span> },
    { key: "category", label: "Family Category Name", align: "center", render: (v) => <span className="text-[12.5px] text-[#1A1A1A]">{v}</span> },
    { 
      key: "status", 
      label: "Status", 
      align: "center", 
      render: (v, r) => (
        <div className="flex justify-center">
          <StatusToggle 
            status={r.status === "Active"} 
            onToggle={() => {
              const next = r.status === "Active" ? "Inactive" : "Active";
              setFamilyCategories(prev => prev.map(c => c.id === r.id ? { ...c, status: next } : c));
              showToast(`Category marked as ${next}`, "success");
            }} 
          />
        </div>
      )
    },
    { 
      key: "actions", 
      label: "Action", 
      align: "center", 
      render: (_, r) => (
        <ActionButtons
          onView={() => openModal("viewCategory", r)}
          onEdit={() => openModal("editCategory", r)}
          onDelete={() => setModal({ type: 'deleteCategory', data: r })}
          row={r}
        />
      ) 
    },
  ];

  const field = (key) => ({
    value: formData?.[key] ?? "",
    onChange: (e) => setFormData((p) => ({ ...p, [key]: e.target.value })),
  });

  return (
    <CommonPageLayout title="Member Management" stats={stats}>
      {/* Tab Switcher */}
      <div className="bg-white rounded-xl border border-slate-100 p-1.5 mb-5 flex gap-1.5">
        {["Family", "Member", "Volunteers"].map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
            className={`flex-1 py-2 rounded-md text-sm transition-all font-medium ${
              activeTab === tab 
                ? "bg-emerald-50/90 text-emerald-800 shadow-sm" 
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="w-full relative bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div className="w-full sm:max-w-sm relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#10b981] transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search members...`}
              className="w-full h-10 pl-11 pr-4 rounded-lg border border-gray-300 bg-white text-[13px] outline-none focus:ring-2 focus:ring-emerald-50 focus:border-emerald-500 transition-all font-medium text-slate-700 shadow-sm"
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
                    label: cat.category,
                    value: cat.category,
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
              ].filter(opt => {
                if (activeTab === "Volunteers") return opt.key === "status";
                if (activeTab === "Family" || activeTab === "Member") {
                  return opt.key === "status" || opt.key === "family_category";
                }
                return true;
              })}
              onChange={(k, v) => {
                setFilters((f) => ({ ...f, [k]: v }));
                setCurrentPage(1);
              }}
              onClear={() => {
                setFilters({ status: "", family_category: "", is_volunteer: "", role: "" });
                setCurrentPage(1);
              }}
              className="h-10 rounded-lg border-gray-300"
            />
            {activeTab === "Family" && (
              <Button variant="emerald" icon={Plus} onClick={() => openModal("addCategory")} className="h-10 text-[13px] font-bold shadow-lg shadow-emerald-900/10">FAMILY CATEGORY</Button>
            )}
            {activeTab === "Member" && (
              <Button variant="emerald" icon={Plus} onClick={() => openModal("add")} className="h-10 text-[13px] font-bold shadow-lg shadow-emerald-900/10">ADD MEMBER</Button>
            )}
          </div>
        </div>

        <div className="overflow-hidden border border-gray-300 bg-white mb-2 rounded-2xl">
          <div className="m-3 mt-3">
            <Table 
              variant="emerald" 
              columns={activeTab === "Family" ? familyColumns : columns} 
              data={activeTab === "Family" ? familyCategories : paginatedData} 
              loading={activeTab === "Family" ? false : loading} 
              skipCard 
            />
          </div>
        </div>

        <div className="mt-0">
          <Pagination 
            currentPage={currentPage} 
            totalRecords={activeTab === "Family" ? familyCategories.length : filteredData.length} 
            recordsPerPage={recordsPerPage} 
            onPageChange={setCurrentPage} 
            onRecordsPerPageChange={setRecordsPerPage} 
          />
        </div>
      </div>

      {/* ═══ Add/Edit/View Category Modal ═══ */}
      <Modal isOpen={modal.type === "addCategory" || modal.type === "editCategory" || modal.type === "viewCategory"} onClose={() => setModal({ type: null, data: null })} title={modal.type === "viewCategory" ? "View Family Category" : modal.type === "editCategory" ? "Edit Family Category" : "Add Family Category"} size="sm">
        <div className="space-y-4">
          <Input 
            label="Category Name" 
            value={modal.type === "addCategory" ? newCategory : formData.category || ""} 
            onChange={(e) => {
              if (modal.type === "addCategory") setNewCategory(e.target.value);
              else setFormData({...formData, category: e.target.value});
            }} 
            placeholder="e.g. Life Member" 
            autoFocus 
            disabled={modal.type === "viewCategory"}
          />
          {modal.type !== "viewCategory" ? (
            <Button 
              variant="emerald"
              className="w-full text-[14px] font-bold shadow-lg shadow-emerald-900/10" 
              onClick={() => {
                if (modal.type === "addCategory") handleAddCategory();
                else {
                  setFamilyCategories(prev => prev.map(c => c.id === modal.data.id ? { ...c, category: formData.category } : c));
                  setModal({ type: null, data: null });
                  showToast("Category updated successfully!", "success");
                }
              }}
            >
              {modal.type === "editCategory" ? "Save Changes" : "Add Category"}
            </Button>
          ) : (
            <Button variant="secondary" className="w-full font-bold" onClick={() => setModal({ type: null, data: null })}>Close</Button>
          )}
        </div>
      </Modal>

      {/* ═══ Add / Edit / View Modal ═══════════════════════════════════════════════════ */}
      <Modal
        isOpen={modal.type === "add" || modal.type === "edit" || modal.type === "view"}
        onClose={() => setModal({ type: null, data: null })}
        size="xl"
        title={
          <div className="flex flex-col gap-5 -mb-2">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setModal({ type: null, data: null })} 
                className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-slate-100 text-slate-500 transition-all active:scale-95 border border-transparent hover:border-slate-200"
              >
                <ArrowLeft size={18} strokeWidth={2.5} />
              </button>
              <div>
                <h2 className="text-[17px] font-bold text-slate-800 tracking-tight">
                  {modal.type === "view" ? "View Member Details" : modal.type === "edit" ? "Edit Member" : "Add Member"}
                </h2>
              </div>
            </div>

            <div className="flex gap-1.5 p-1 bg-slate-50/80 rounded-2xl border border-slate-100 w-fit">
              {MEMBER_TABS.map((tab, i) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveModalTab(i)}
                  className={`px-5 py-2 text-[12px] font-bold rounded-xl transition-all duration-300 ${
                    activeModalTab === i
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-100 ring-1 ring-emerald-500/20"
                      : "text-slate-400 hover:text-slate-600 hover:bg-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        }
        footer={
           <div className="flex items-center gap-3">
             <Button
               variant={modal.type === 'view' ? 'emerald' : 'secondary'}
               onClick={() => setModal({ type: null, data: null })}
               className="w-32 h-10 text-[13px] font-bold rounded-xl border-slate-200"
             >
               {modal.type === 'view' ? 'Close' : 'Cancel'}
             </Button>
             {modal.type !== "view" && (
               <>
                 {activeModalTab < MEMBER_TABS.length - 1 ? (
                    <Button
                      variant="emerald"
                      className="w-32 h-10 text-[13px] font-bold shadow-lg shadow-emerald-900/10 rounded-xl"
                      onClick={() => setActiveModalTab(t => t + 1)}
                    >
                      Next Step
                    </Button>
                 ) : (
                    <Button
                      variant="emerald"
                      onClick={handleSave}
                      disabled={saving}
                      className="w-32 h-10 text-[13px] font-bold shadow-lg shadow-emerald-900/10 rounded-xl"
                    >
                      {saving ? "Saving..." : (modal.type === "add" ? "Submit" : "Update")}
                    </Button>
                 )}
               </>
             )}
           </div>
        }
      >
        <div className="px-1 sm:px-2 py-4 overflow-x-hidden">
            {/* Tab 0: Personal Information */}
            {activeModalTab === 0 && (
              <div className="animate-in fade-in duration-300">
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input label="Full Name" {...field("name")} icon={Users} error={errors.name} required disabled={modal.type === 'view'} placeholder="Enter full name..." />
                    <Input label="Mobile" {...field("mobile")} icon={Phone} error={errors.mobile} disabled={modal.type === 'view'} placeholder="10-digit mobile number..." />
                    <Input label="Email" {...field("email")} icon={Mail} disabled={modal.type === 'view'} placeholder="member@example.com" />
                    <DatePicker label="Birth Date" value={formData?.birthDate} onChange={v => setFormData(p => ({ ...p, birthDate: v.target.value }))} icon={Calendar} disabled={modal.type === 'view'} />
                    <CustomSelect label="Relationship" value={formData.role} options={["Head", "Husband", "Wife", "Son", "Daughter", "Father", "Mother", "Other"]} onChange={v => setFormData(p => ({ ...p, role: v }))} placeholder="Select relationship" disabled={modal.type === 'view'} />
                    <CustomSelect label="Family Category" value={formData.family_category} options={familyCategories.map(c => c.category)} onChange={v => setFormData(p => ({ ...p, family_category: v }))} placeholder="Select Family Category" disabled={modal.type === 'view'} />
                    <CustomSelect label="Gender" value={formData.gender} options={["Male", "Female", "Other"]} onChange={v => setFormData(p => ({ ...p, gender: v }))} placeholder="Select Gender" disabled={modal.type === 'view'} />
                    <CustomSelect label="Blood Group" value={formData.blood_group} options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]} onChange={v => setFormData(p => ({ ...p, blood_group: v }))} placeholder="Select Blood Group" disabled={modal.type === 'view'} />
                  </div>
                  <div className="mt-6 flex gap-6 p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={formData.is_family_head} onChange={e => setFormData(p => ({ ...p, is_family_head: e.target.checked }))} disabled={modal.type === 'view'} className="w-4 h-4 rounded text-teal-600" /> <span className="text-[12px] font-bold text-slate-700 underline underline-offset-4 decoration-teal-200">Family Head?</span></label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={formData.is_volunteer} onChange={e => setFormData(p => ({ ...p, is_volunteer: e.target.checked }))} disabled={modal.type === 'view'} className="w-4 h-4 rounded text-emerald-600" /> <span className="text-[12px] font-bold text-slate-700 underline underline-offset-4 decoration-emerald-200">Volunteer?</span></label>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 1: Family Member */}
            {activeModalTab === 1 && (
              <div className="animate-in fade-in duration-300">
                <div className="space-y-6">
                  {/* Existing Family Members */}
                  {modal.type !== 'add' && individualMembers.filter(m => m.familyId === formData.familyId && m.id !== formData.id).map((m, i) => (
                    <div key={`existing-${i}`} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 relative group/entry animate-in slide-in-from-right duration-300">
                      <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-500 flex items-center justify-center text-[11px] font-bold">{i + 1}</div>
                            <h4 className="text-[13px] font-bold text-slate-700">Existing Family Member</h4>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-[10px] font-bold ${m.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                            {m.status}
                          </div>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                              <Users className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-[14px] font-bold text-slate-800">{m.name}</p>
                              <p className="text-[12px] font-medium text-slate-500">{m.role} • {m.mobile || 'No Mobile'}</p>
                            </div>
                          </div>
                        </div>
                    </div>
                  ))}

                  {/* New Family Members to be added */}
                  {membersList.map((m, i) => (
                    <div key={`new-${i}`} className="p-5 rounded-2xl border border-teal-100 bg-teal-50/30 relative group/entry animate-in slide-in-from-right duration-300">
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center text-[11px] font-bold">{i + 1}</div>
                          <h4 className="text-[13px] font-bold text-teal-700">New Family Entry</h4>
                        </div>
                        <button type="button" onClick={() => setMembersList(prev => prev.filter((_, idx) => idx !== i))} className="p-1 px-3 rounded-lg text-[11px] font-bold text-rose-500 hover:bg-rose-50 transition-colors">Remove</button>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <Input label="Name" value={m.name} onChange={e => { const list = [...membersList]; list[i].name = e.target.value; setMembersList(list); }} placeholder="Full Name" />
                        <Input label="Mobile" value={m.mobile} onChange={e => { const list = [...membersList]; list[i].mobile = e.target.value; setMembersList(list); }} placeholder="Mobile Number" />
                        <CustomSelect label="Relationship" value={m.role} options={["Husband", "Wife", "Son", "Daughter", "Father", "Mother", "Other"]} onChange={v => { const list = [...membersList]; list[i].role = v; setMembersList(list); }} placeholder="Select relationship" />
                        <CustomSelect label="Gender" value={m.gender} options={["Male", "Female", "Other"]} onChange={v => { const list = [...membersList]; list[i].gender = v; setMembersList(list); }} placeholder="Select Gender" />
                      </div>
                    </div>
                  ))}

                  {modal.type !== "view" && (
                    <button type="button" onClick={() => setMembersList([...membersList, BLANK_MEMBER_ENTRY()])} className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-teal-300 hover:text-teal-600 hover:bg-teal-50/30 transition-all font-bold text-[13px] flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Add Another Family Member</button>
                  )}
                  
                  {modal.type !== "add" && membersList.length === 0 && individualMembers.filter(m => m.familyId === formData.familyId && m.id !== formData.id).length === 0 && (
                    <div className="py-12 flex flex-col items-center justify-center text-center px-6 rounded-2xl border-2 border-dashed border-slate-100">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 mb-3">
                        <Users className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Independent Entry</p>
                      <p className="text-xs text-slate-400 mt-1">This member does not have other family members linked.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Location */}
            {activeModalTab === 2 && (
              <div className="animate-in fade-in duration-300">
                <div className="space-y-4">
                  <Input label="Complete Address" {...field("address")} icon={MapIcon} placeholder="House/Flat No, Apartment, Street..." disabled={modal.type === 'view'} />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Area" {...field("area")} icon={MapPin} placeholder="e.g. Navrangpura" disabled={modal.type === 'view'} />
                    <Input label="City" {...field("city")} icon={MapPin} placeholder="e.g. Ahmedabad" disabled={modal.type === 'view'} />
                    <Input label="Pincode" {...field("pincode")} icon={MapPin} placeholder="6-digit pincode" disabled={modal.type === 'view'} />
                  </div>
                  <p className="text-xs text-slate-400 mt-2 ml-1">Provide detailed address information for the member or family unit.</p>
                </div>
              </div>
            )}
          </div>
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

      <ConfirmModal
        isOpen={modal.type === "deleteCategory"}
        onClose={() => setModal({ type: null, data: null })}
        onConfirm={() => {
          setFamilyCategories(prev => prev.filter(c => c.id !== modal.data.id));
          showToast("Category deleted successfully!", "success");
          setModal({ type: null, data: null });
        }}
        title="Delete Family Category"
        message={`Are you sure you want to delete the category "${modal.data?.category}"?`}
        variant="danger"
      />
    </CommonPageLayout>
  );
}

