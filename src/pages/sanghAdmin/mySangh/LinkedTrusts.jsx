import { useState, useEffect, useMemo } from "react";
import { Landmark, Eye, Trash2, CheckCircle2, Search } from "lucide-react";
import CommonPageLayout from "../../../components/common/CommonPageLayout";
import Table from "../../../components/common/Table";
import ConfirmModal from "../../../components/common/ConfirmModal";
import FilterButton from "../../../components/common/FilterButton";
import Modal from "../../../components/common/Modal";
import Pagination from "../../../components/common/Pagination";

export default function LinkedTrusts() {
  const [trusts, setTrusts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ status: "", category: "" });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [viewModal, setViewModal] = useState({ open: false, data: null });

  useEffect(() => {
    const fetchLinkedTrusts = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 150)); // Ultra-fast shimmer
        const stored = localStorage.getItem("linked_trusts_data");
        const defaultData = [
          {
            id: 1,
            name: "Anandji Kalyanji Trust",
            category: "General",
            phone: "9876543210",
            status: "Active",
          },
          {
            id: 2,
            name: "Palitana Teerth Trust",
            category: "Religious",
            phone: "9825011223",
            status: "Active",
          },
          {
            id: 3,
            name: "Jain Education Fund",
            category: "Education",
            phone: "9988776655",
            status: "Inactive",
          },
          {
            id: 4,
            name: "Mahavir Seva Trust",
            category: "Welfare",
            phone: "9554433221",
            status: "Active",
          },
          {
            id: 5,
            name: "Shantinath Charitable Trust",
            category: "Welfare",
            phone: "9443322110",
            status: "Inactive",
          },
        ];
        const data = stored ? JSON.parse(stored) : defaultData;
        setTrusts(data);
        if (!stored)
          localStorage.setItem(
            "linked_trusts_data",
            JSON.stringify(defaultData),
          );
      } catch (error) {
        console.error("Failed to fetch trusts", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLinkedTrusts();
  }, []);

  const filteredTrusts = useMemo(() => {
    return trusts.filter((t) => {
      const matchesSearch = t.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus = !filters.status || t.status === filters.status;
      const matchesCategory =
        !filters.category || t.category === filters.category;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [trusts, searchQuery, filters]);

  // Paginated Data
  const paginatedTrusts = useMemo(() => {
    const start = (currentPage - 1) * recordsPerPage;
    return filteredTrusts.slice(start, start + recordsPerPage);
  }, [filteredTrusts, currentPage, recordsPerPage]);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters, recordsPerPage]);

  const stats = [
    {
      title: "Total Trust",
      value: trusts.length,
      icon: Landmark,
      color: "teal",
    },
    {
      title: "Active Trust",
      value: trusts.filter((t) => t.status === "Active").length,
      icon: CheckCircle2,
      color: "emerald",
    },
  ];

  const handleToggleStatus = (id) => {
    const updated = trusts.map((t) =>
      t.id === id
        ? { ...t, status: t.status === "Active" ? "Inactive" : "Active" }
        : t,
    );
    setTrusts(updated);
    localStorage.setItem("linked_trusts_data", JSON.stringify(updated));
  };

  const handleDelete = () => {
    const updated = trusts.filter((t) => t.id !== deleteModal.id);
    setTrusts(updated);
    localStorage.setItem("linked_trusts_data", JSON.stringify(updated));
    setDeleteModal({ open: false, id: null });
  };

  const columns = [
    {
      key: "sr_no",
      label: "Sr. No",
      render: (_, __, i) => (
        <span className="text-slate-500 font-semibold">{i + 1}</span>
      ),
    },
    {
      key: "name",
      label: "Trust Name",
      render: (name) => <span className="font-bold text-teal-700">{name}</span>,
    },
    { key: "category", label: "Category" },
    { key: "phone", label: "Phone" },
    {
      key: "status",
      label: "Status",
      render: (status, row) => (
        <div className="flex items-center min-w-[60px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleStatus(row.id);
            }}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-xl transition-colors duration-200 ease-in-out focus:outline-none px-[3px] ${status === "Active" ? "bg-emerald-500" : "bg-slate-300"}`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-xl bg-white shadow-sm transition-all duration-200 ease-in-out ${status === "Active" ? "translate-x-[16px]" : "translate-x-0"}`}
            />
          </button>
        </div>
      ),
    },
    {
      key: "actions",
      label: "Action",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            className="p-1.5 rounded-xl bg-teal-50 text-teal-600 hover:bg-teal-600 hover:text-white transition-all shadow-sm"
            title="View Details"
            onClick={() => setViewModal({ open: true, data: row })}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
            title="Remove Trust"
            onClick={() => setDeleteModal({ open: true, id: row.id })}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const categories = [...new Set(trusts.map((t) => t.category))];

  const filterOptions = [
    {
      key: "status",
      placeholder: "Trust Status",
      items: [
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" },
      ],
    },
    {
      key: "category",
      placeholder: "Trust Category",
      items: categories.map((c) => ({ label: c, value: c })),
    },
  ];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ status: "", category: "" });
  };

  return (
    <CommonPageLayout title="Linked Trusts" stats={stats}>
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="p-4 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="w-full sm:max-w-sm">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by trust name..."
                className="w-full h-[36px] pl-11 pr-10 rounded-xl border border-slate-200 bg-slate-50/30 text-[13px] font-medium text-slate-700 placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-50 outline-none transition-all duration-200"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FilterButton
              dataCount={filteredTrusts.length}
              filters={filters}
              options={filterOptions}
              onChange={handleFilterChange}
              onClear={clearFilters}
            />
          </div>
        </div>

        <Table
          columns={columns}
          data={paginatedTrusts}
          loading={loading}
          skipCard
          emptyMessage="No linked trusts found"
          emptyDescription="Try adjusting your search or add new trusts."
        />

        <Pagination
          currentPage={currentPage}
          totalRecords={filteredTrusts.length}
          recordsPerPage={recordsPerPage}
          onPageChange={setCurrentPage}
          onRecordsPerPageChange={setRecordsPerPage}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Remove Linked Trust"
        message="Are you sure you want to remove this trust from your Sangh?"
        variant="danger"
      />

      {/* View Trust Details Modal */}
      <Modal
        isOpen={viewModal.open}
        onClose={() => setViewModal({ open: false, data: null })}
        title="Trust Details"
      >
        {viewModal.data && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-5">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Trust Name
                </p>
                <p className="text-[14px] font-semibold text-slate-800">
                  {viewModal.data.name}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Category
                </p>
                <p className="text-[14px] font-semibold text-slate-800">
                  {viewModal.data.category}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Phone
                </p>
                <p className="text-[14px] font-semibold text-slate-800">
                  {viewModal.data.phone}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Status
                </p>
                <div>
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-xl text-[11px] font-bold ${viewModal.data.status === "Active" ? "bg-emerald-100/50 text-emerald-700" : "bg-slate-200 text-slate-600"}`}
                  >
                    {viewModal.data.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewModal({ open: false, data: null })}
                className="px-6 py-2.5 bg-teal-600 text-white text-sm font-bold rounded-xl hover:bg-teal-700 transition-colors shadow-md shadow-teal-100"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </CommonPageLayout>
  );
}
