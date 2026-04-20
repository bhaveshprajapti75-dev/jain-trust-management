import { useState, useRef, useEffect } from "react";
import {
  Menu,
  Bell,
  ChevronLeft,
  User,
  LogOut,
  ChevronDown,
  Fingerprint,
} from "lucide-react";
import SearchBar from "../common/SearchBar";

export default function Navbar({ onMenuClick, sidebarOpen, onToggleSidebar }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-20 bg-white border-b border-slate-200">
      <div className="flex items-center justify-between h-14 px-4 lg:px-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 mr-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-sm shadow-emerald-500/20">
              <Fingerprint className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <div className="hidden xl:block">
              <p className="text-[14px] font-bold text-slate-800 leading-none tracking-tight">JAIN SANGH</p>
              <p className="text-[11px] text-emerald-600 mt-0.5 leading-none">Trust Management</p>
            </div>
          </div>

          <button
            onClick={onMenuClick}
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 active:scale-95 transition-all"
          >
            <Menu className="w-[18px] h-[18px]" strokeWidth={1.9} />
          </button>

          <button
            onClick={onToggleSidebar}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 active:scale-95 transition-colors"
            title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-[18px] h-[18px]" strokeWidth={2} />
            ) : (
              <Menu className="w-[18px] h-[18px]" strokeWidth={2} />
            )}
          </button>

          <div className="hidden sm:block w-72">
            <SearchBar placeholder="Search" value="" onChange={() => {}} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors">
            <Bell className="w-[18px] h-[18px]" strokeWidth={1.9} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
          </button>

          <div className="h-6 w-px bg-slate-200 mx-1"></div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center gap-2.5 pl-1 pr-2.5 py-1 rounded-xl transition-all duration-200 cursor-pointer border ${
                isDropdownOpen
                  ? "bg-slate-50 border-slate-200"
                  : "bg-white border-transparent hover:border-slate-200 hover:bg-slate-50"
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shrink-0">
                <span className="text-[13px] font-bold text-white">ND</span>
              </div>

              <div className="hidden lg:block text-left">
                <p className="text-[14px] font-semibold text-slate-800 leading-none">
                  Naman Doshi
                </p>
                <p className="text-[11px] text-emerald-600 mt-0.5 uppercase tracking-wide">
                  {localStorage.getItem('userRole') === 'sanghAdmin' ? 'Sangh Admin' : 'Super Admin'}
                </p>
              </div>

              <ChevronDown
                className={`w-4 h-4 text-slate-400 hidden lg:block transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180 text-slate-600" : ""
                }`}
                strokeWidth={2}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border border-slate-200 shadow-lg p-1.5 z-30">
                <button
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[14px] text-slate-600 hover:bg-slate-100 hover:text-slate-800 rounded-xl transition-colors"
                >
                  <User className="w-4 h-4" strokeWidth={2} />
                  <span className="font-medium">My Profile</span>
                </button>

                <div className="h-px bg-slate-200 my-1"></div>

                <button
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[14px] text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" strokeWidth={2} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
