import React, { useState } from "react";
import Input from "../common/Input"; // તમારી પાસે ઓલરેડી છે

export default function UserForm({ user, roles, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    roleId: user?.roleId || "",
    trustId: user?.trustId || "",
    status: user?.status || "Active",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let err = {};
    if (!form.name) err.name = "Name is required";
    if (!form.phone) err.phone = "Phone is required";
    if (!form.roleId) err.roleId = "Role is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(form);
    }
  };

  const inputCls =
    "w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 transition-all font-medium";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="text-[11px] font-bold text-slate-500 uppercase mb-1 block">
            Full Name
          </label>
          <Input
            placeholder="John Doe"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          {errors.name && (
            <p className="text-red-500 text-[11px] mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-500 uppercase mb-1 block">
            Phone Number
          </label>
          <Input
            placeholder="+91 9876543210"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          {errors.phone && (
            <p className="text-red-500 text-[11px] mt-1">{errors.phone}</p>
          )}
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-500 uppercase mb-1 block">
            Email (Optional)
          </label>
          <Input
            placeholder="email@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-500 uppercase mb-1 block">
            Select Role
          </label>
          <select
            value={form.roleId}
            onChange={(e) => setForm({ ...form, roleId: e.target.value })}
            className={inputCls}
          >
            <option value="">Choose a role</option>
            {roles?.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
          {errors.roleId && (
            <p className="text-red-500 text-[11px] mt-1">{errors.roleId}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 text-[13px] font-bold rounded-xl hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 bg-teal-600 text-white text-[13px] font-bold rounded-xl hover:bg-teal-700 transition-colors"
        >
          {user ? "Save Changes" : "Create User"}
        </button>
      </div>
    </form>
  );
}
