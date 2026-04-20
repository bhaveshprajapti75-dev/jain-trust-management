import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Bell,
  ChevronLeft,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import SearchBar from "../ui/SearchBar";
import { ROLES } from "../../config/roles";


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

  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userName');
    setIsDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-20 bg-white border-b border-slate-50 shadow-sm shadow-slate-100/50">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        
        {/* ── Left Side: Brand -> Toggle -> Search ── */}
        <div className="flex items-center gap-4">
          
          {/* 1. Jain Sangh Brand - Attractive Diamond Logo */}
          <div className="flex items-center gap-3 pr-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/10 shrink-0 transform rotate-45">
              <svg
                viewBox="0 0 32 32"
                className="w-5.5 h-5.5 transform -rotate-45"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 2L28 16L16 30L4 16L16 2Z"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                <circle cx="16" cy="16" r="2.5" fill="white" />
              </svg>
            </div>
            <div className="hidden md:block">
              <p className="text-[15px] font-extrabold text-slate-700 leading-tight tracking-tight">
                Jain Sangh
              </p>
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">
                Trust Management
              </p>
            </div>
          </div>

          {/* 2. Mobile Hamburger */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl hover:bg-slate-50 text-slate-400 active:scale-95 transition-all"
          >
            <Menu className="w-5.5 h-5.5" strokeWidth={2} />
          </button>

          {/* 3. Desktop Sidebar Toggle */}
          <button
            onClick={onToggleSidebar}
            className="hidden lg:flex p-2 rounded-xl hover:bg-emerald-50/50 text-slate-400 hover:text-emerald-500 active:scale-95 transition-all duration-200 items-center justify-center"
            title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
            ) : (
              <Menu className="w-5 h-5" strokeWidth={2.5} />
            )}
          </button>

          {/* 4. Search Bar - Added ml-6 to push it slightly to the right */}
          <div className="hidden sm:block w-72 ml-1">
            <SearchBar placeholder="Search" value="" onChange={() => {}} />
          </div>
        </div>

        {/* ── Right Side: Bell + Profile Dropdown ── */}
        <div className="flex items-center gap-4">
          
          {/* Notifications Bell */}
          <button className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-50/30 text-slate-500 hover:bg-emerald-50/60 hover:text-emerald-500 active:scale-95 transition-all">
            <Bell className="w-[22px] h-[22px]" strokeWidth={2} />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
          </button>

          {/* Profile Section with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            
            {/* Profile Button */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center gap-3 pl-1.5 pr-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer ${
                isDropdownOpen
                  ? "bg-emerald-50/60"
                  : "bg-emerald-50/30 hover:bg-emerald-50/60"
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-md shadow-teal-500/10 ring-2 ring-white shrink-0">
                <span className="text-[13px] font-bold text-white">
                  {(sessionStorage.getItem('userName') || 'User').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </span>
              </div>

              <div className="hidden lg:block text-left">
                <p className="text-[14px] font-bold text-slate-700 leading-tight">
                  {sessionStorage.getItem('userName') || 'User'}
                </p>
                <p className="text-[11px] text-emerald-500 font-semibold uppercase">
                  {sessionStorage.getItem('userRole') === ROLES.SANGH_ADMIN ? 'Sangh Admin' : 'Super Admin'}
                </p>
              </div>

              {/* Little Arrow for dropdown */}
              <ChevronDown
                className={`w-4 h-4 text-slate-400 hidden lg:block transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180 text-emerald-500" : ""
                }`}
                strokeWidth={2.5}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2.5 w-48 bg-white rounded-2xl border border-slate-50 shadow-xl shadow-slate-200/30 p-1.5 z-30 transform origin-top-right transition-all duration-200 scale-100 opacity-100">
                
                {/* Profile Link */}
                <button
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 hover:bg-emerald-50/50 hover:text-emerald-600 rounded-xl transition-colors"
                >
                  <User className="w-4 h-4" strokeWidth={2} />
                  <span className="font-medium">My Profile</span>
                </button>

                {/* Proper gap of 0.5rem (mb-2) between both buttons */}
                <div className="mb-2"></div>

                {/* Logout Link */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-500 hover:bg-rose-50/60 rounded-xl transition-colors"
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
