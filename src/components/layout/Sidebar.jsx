import { useState, useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, Landmark, ChevronDown, X, PlusCircle, Shield,
  UserCog, Building2, HardHat, HandHeart, BookOpen, BarChart3, Bell,
  ClipboardList, MapPin, Receipt, Settings, Users2, Hotel, CalendarDays, FileText
} from 'lucide-react'
import { ROLES } from '../../config/roles'
import { sanghAdminDropdownSections, sanghAdminTopFlatItems, sanghAdminBottomFlatItems } from '../../config/sanghAdminnav'

const dropdownSections = [
  {
    trigger: { icon: Building2, label: 'Organization' },
    children: [
      { to: '/organization', icon: LayoutDashboard, label: 'Overview' },
      { to: '/organization/trust', icon: Landmark, label: 'Trust' },
      { to: '/organization/sangh', icon: Users, label: 'Sangh' },
      { to: '/organization/departments', icon: Building2, label: 'Departments' },
      { to: '/locations', icon: MapPin, label: 'Location' },
    ],
  },
  {
    trigger: { icon: UserCog, label: 'Users' },
    children: [
      { to: '/users', icon: Users, label: 'All Users' },
      { to: '/roles', icon: Shield, label: 'Roles & Permissions' },
      { to: '/committee', icon: Users, label: 'Committee' },
    ],
  },
  {
    trigger: { icon: HardHat, label: 'Staff' },
    children: [
      { to: '/staff/managers', icon: UserCog, label: 'Managers' },
      { to: '/staff/accountants', icon: UserCog, label: 'Accountants' },
      { to: '/staff/helpers', icon: UserCog, label: 'Helpers' },
      { to: '/staff/volunteers', icon: UserCog, label: 'Volunteers' },
    ],
  },
  {
    trigger: { icon: Receipt, label: 'Accounts' },
    children: [
      { to: '/accounts', icon: Receipt, label: 'Accounts List' },
      { to: '/accounts/income', icon: BarChart3, label: 'Income' },
      { to: '/accounts/expense', icon: ClipboardList, label: 'Expense' },
    ],
  },
  {
    trigger: { icon: HandHeart, label: 'Donations' },
    children: [
      { to: '/donations', icon: ClipboardList, label: 'Donation List' },
      { to: '/donations/add', icon: PlusCircle, label: 'Add Donation' },
    ],
  },
  {
    trigger: { icon: Building2, label: 'Derasar' },
    children: [
      { to: '/derasar', icon: Landmark, label: 'Derasar List' },
      { to: '/derasar/salgirah', icon: ClipboardList, label: 'Salgirah' },
      { to: '/derasar/poojari', icon: Users, label: 'Poojari' },
      { to: '/derasar/pratima', icon: Landmark, label: 'Pratima' },
    ],
  },
  {
    trigger: { icon: BookOpen, label: 'Pathshala' },
    children: [
      { to: '/pathshala/students', icon: Users, label: 'Students' },
      { to: '/pathshala/teachers', icon: UserCog, label: 'Teachers' },
      { to: '/pathshala/exams', icon: ClipboardList, label: 'Exams' },
      { to: '/pathshala/results', icon: BarChart3, label: 'Results' },
    ],
  },
  {
    trigger: { icon: BarChart3, label: 'Reports' },
    children: [
      { to: '/reports/analytics', icon: BarChart3, label: 'Analytics' },
      { to: '/reports/donations', icon: ClipboardList, label: 'Donation Reports' },
      { to: '/reports/expenses', icon: ClipboardList, label: 'Expense Reports' },
    ],
  },
  {
    trigger: { icon: Settings, label: 'Settings' },
    children: [
      { to: '/settings', icon: Settings, label: 'General Settings' },
      { to: '/settings/profile', icon: UserCog, label: 'Profile' },
    ],
  },
]

const flatItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
]

function isRouteActive(pathname, to) {
  if (to === '/' || to === '/sangh-admin') return pathname === to || pathname === to + '/'
  return pathname === to || pathname.startsWith(to + '/')
}

export default function Sidebar({ isOpen: isSidebarOpen, onClose, isMobile }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [openSection, setOpenSection] = useState(null)
  const showLabels = isMobile || isSidebarOpen
  const userRole = sessionStorage.getItem('userRole') || ROLES.SUPER_ADMIN
  const isSanghAdmin = userRole === ROLES.SANGH_ADMIN

  const currentDropdownSections = isSanghAdmin ? sanghAdminDropdownSections : dropdownSections
  const topFlatItems = isSanghAdmin ? sanghAdminTopFlatItems : flatItems

  useEffect(() => {
    let hasActive = false;
    currentDropdownSections.forEach(section => {
      const isActive = section.children?.some(child => isRouteActive(pathname, child.to))
      if (isActive) {
        setOpenSection(section.trigger.label)
        hasActive = true;
      }
    });
    if (!hasActive) {
      setOpenSection(null);
    }
  }, [pathname, currentDropdownSections])

  const handleSectionClick = (section) => {
    if (!isSidebarOpen && section.children?.length > 0) {
      navigate(section.children[0].to);
      return;
    }
    setOpenSection(openSection === section.trigger.label ? null : section.trigger.label)
  }

  const content = (
    <div className="flex flex-col h-full bg-white select-none">
      {isMobile && (
        <div className="px-5 py-4 flex justify-between items-center">
          <span className="font-bold text-teal-700">MENU</span>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      
      <nav className={`flex-1 overflow-y-auto px-3 ${isMobile ? 'py-4' : 'pt-7 pb-4'} space-y-3 custom-scrollbar`}>
        
        {/* Dashboard & Notifications (or Top Flat Items) */}
        {topFlatItems.map((item) => {
          const active = isRouteActive(pathname, item.to)
          return (
            <NavLink key={item.to} to={item.to} onClick={isMobile ? onClose : undefined} className="block group">
              <div className={`relative flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 transform active:scale-95
                ${active ? 'bg-teal-50 text-teal-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-teal-600'}
                ${!showLabels ? 'justify-center' : 'gap-3'}`}>
                <item.icon className={`w-5 h-5 shrink-0 transition-colors ${active ? 'text-teal-600' : 'text-slate-400 group-hover:text-teal-500'}`} />
                {showLabels && <span className="text-sm font-semibold">{item.label}</span>}
              </div>
            </NavLink>
          )
        })}

        {/* Dropdown Menu Items */}
        {currentDropdownSections.map((section) => {
          const hasChildren = section.children && section.children.length > 0;
          const isDirectLink = section.to && !hasChildren;
          const isSectionActive = hasChildren 
            ? section.children.some(child => isRouteActive(pathname, child.to))
            : (section.to ? isRouteActive(pathname, section.to) : false);
          const isOpen = openSection === section.trigger.label;

          const handleClick = () => {
            if (isDirectLink) {
              navigate(section.to);
              if (isMobile) onClose();
              return;
            }
            handleSectionClick(section);
          };

          return (
            <div key={section.trigger.label} className="space-y-1">
              <button
                onClick={handleClick}
                className={`w-full flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 transform active:scale-95 group
                  ${isSectionActive ? 'bg-teal-50 text-teal-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-teal-600'}
                  ${!showLabels ? 'justify-center' : 'gap-3'}`}
              >
                <section.trigger.icon className={`w-5 h-5 shrink-0 transition-colors ${isSectionActive ? 'text-teal-600' : 'text-slate-400 group-hover:text-teal-500'}`} />
                {showLabels && (
                  <>
                    <span className="flex-1 text-left text-sm font-semibold">{section.trigger.label}</span>
                    {hasChildren && <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />}
                  </>
                )}
              </button>

              {hasChildren && (
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${(isOpen && showLabels) ? 'max-h-[600px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                  <div className={`space-y-1 ${showLabels ? 'ml-4' : ''}`}>
                    {section.children.map((child) => {
                      const active = isRouteActive(pathname, child.to)
                      return (
                        <NavLink key={child.to} to={child.to} onClick={isMobile ? onClose : undefined} className="block">
                          <div className={`flex items-center rounded-lg text-[13px] transition-all duration-200 transform active:scale-95
                            ${active ? 'text-teal-600 font-bold bg-teal-50/50' : 'text-slate-500 hover:text-teal-600 hover:bg-slate-50/50'}
                            ${!showLabels ? 'justify-center py-2' : 'gap-3 px-4 py-2'}`}>
                            <child.icon className={`w-4 h-4 transition-colors ${active ? 'text-teal-500' : 'text-slate-400 group-hover:text-teal-500'}`} />
                            {showLabels && child.label}
                          </div>
                        </NavLink>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {isSanghAdmin && sanghAdminBottomFlatItems.length > 0 && (
          <div className="pt-2 border-t border-slate-100 mt-2 space-y-1">
            {sanghAdminBottomFlatItems.map((item) => {
               const active = isRouteActive(pathname, item.to)
               return (
                 <NavLink key={item.to} to={item.to} onClick={isMobile ? onClose : undefined} className="block group">
                   <div className={`relative flex items-center px-3 py-2.5 rounded-xl hover:bg-slate-50 hover:text-teal-600 transition-all duration-200 transform active:scale-95 ${active ? 'bg-teal-50 text-teal-700' : 'text-slate-600'} ${!showLabels ? 'justify-center' : 'gap-3'}`}>
                     <item.icon className={`w-5 h-5 shrink-0 ${active ? 'text-teal-600' : 'text-slate-400 group-hover:text-teal-500'}`} />
                     {showLabels && <span className="text-sm font-semibold">{item.label}</span>}
                   </div>
                 </NavLink>
               )
            })}
          </div>
        )}
      </nav>
    </div>
  );

  // Mobile & Desktop render logic stays the same...
  if (isMobile) {
    return (
      <>
        {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40" onClick={onClose} />}
        <div className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 bg-white shadow-2xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <span className="text-xl font-black bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">JAIN SANGH</span>
            <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"><X className="w-6 h-6"/></button>
          </div>
          {content}
        </div>
      </>
    );
  }

  return (
    <aside className={`fixed top-16 bottom-0 left-0 z-10 transition-all duration-300 ease-in-out bg-white border-r border-slate-100 
      ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
      {content}
    </aside>
  );
}
