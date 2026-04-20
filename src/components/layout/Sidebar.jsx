import React, { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, MapPin, Building2, UserCog, Users2, Hotel,
  CalendarDays, Receipt, Users, BarChart3, Bell, Settings, X, ChevronDown, FileText, ShieldCheck
} from 'lucide-react'

const NAV_ITEMS = {
  dashboard: { to: '/dashboard', baseRoute: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  locations: { to: '/locations', baseRoute: '/locations', icon: MapPin, label: 'Locations' },
  organization: { to: '/organizations/all', baseRoute: '/organizations', icon: Building2, label: 'Organizations' },
  userManagement: { to: '/users/all', baseRoute: '/users/all', icon: UserCog, label: 'Users' },
  roles: { to: '/users/roles', baseRoute: '/users/roles', icon: ShieldCheck, label: 'Permissions' },
  members: { to: '/members/families', baseRoute: '/members', icon: Users2, label: 'Members' },
  institutions: { to: '/institutions/derasar', baseRoute: '/institutions', icon: Hotel, label: 'Institutions' },
  activities: { to: '/activities/events', baseRoute: '/activities', icon: CalendarDays, label: 'Activities' },
  finance: { to: '/finance/donations', baseRoute: '/finance', icon: Receipt, label: 'Finance' },
  departments: { to: '/staff/dept', baseRoute: '/staff', icon: Users, label: 'Departments & Staff' },
  reports: { to: '/reports', baseRoute: '/reports', icon: BarChart3, label: 'Reports' },
  documents: { to: '/documents', baseRoute: '/documents', icon: FileText, label: 'Documents' },
  notifications: { to: '/notifications', baseRoute: '/notifications', icon: Bell, label: 'Notifications' },
  settings: { to: '/settings', baseRoute: '/settings', icon: Settings, label: 'System Settings' },
}

const navSections = [
  {
    label: null,
    items: [
      NAV_ITEMS.dashboard,
      NAV_ITEMS.locations,
      NAV_ITEMS.organization,
      NAV_ITEMS.userManagement,
      NAV_ITEMS.roles,
      NAV_ITEMS.institutions,
      NAV_ITEMS.activities,
      NAV_ITEMS.finance,
      NAV_ITEMS.reports,
      NAV_ITEMS.documents,
      NAV_ITEMS.notifications,
      NAV_ITEMS.settings,
    ],
  },
]

export default function Sidebar({ isOpen: isSidebarOpen, onClose, isMobile }) {
  const { pathname } = useLocation()
  const showLabels = isMobile || isSidebarOpen

  const isRouteActive = (item) => {
    if (!item.to && !item.baseRoute) return false
    const matchPath = item.baseRoute || item.to
    if (matchPath === '/dashboard' && (pathname === '/' || pathname === '/dashboard')) return true
    return pathname === matchPath || pathname.startsWith(matchPath + '/')
  }

  const NavItem = ({ item }) => {
    const active = isRouteActive(item)

    const itemStyle = `relative flex items-center px-3 h-11 rounded-lg transition-all duration-200 group cursor-pointer text-sm font-medium mb-1.5
      ${!showLabels ? 'justify-center' : 'gap-3'}
      ${active
        ? 'bg-emerald-50/90 text-emerald-800'
        : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-700'}`

    const labelStyle = 'flex-1 whitespace-nowrap text-sm font-medium transition-colors duration-200'

    const iconStyle = `w-5 h-5 shrink-0 transition-colors duration-200 ${active ? 'text-emerald-700' : 'text-slate-400 group-hover:text-emerald-500'}`

    return (
      <NavLink to={item.to} onClick={isMobile ? onClose : undefined} className={itemStyle}>
        <item.icon className={iconStyle} strokeWidth={active ? 2.5 : 2} />
        {showLabels && <span className={labelStyle}>{item.label}</span>}
      </NavLink>
    )
  }

  const content = (
    <div className="flex flex-col h-full bg-white select-none">
      {isMobile && (
        <div className="h-12 flex items-center justify-end px-3 border-b border-slate-200 shrink-0">
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-full">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <nav className={`flex-1 px-4 ${isMobile ? 'py-4' : 'py-6'} overflow-y-auto
        scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}>
        <div className="space-y-1">
          {navSections[0].items.map((item, itemIdx) => (
            <NavItem key={item.label || itemIdx} item={item} />
          ))}
        </div>
      </nav>

      {showLabels && (
        <div className="px-4 py-3 border-t border-slate-200 shrink-0">
          <p className="text-[11px] text-emerald-700 font-medium tracking-wide">SUPER ADMIN PANEL</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Jain Sangh Management</p>
        </div>
      )}
    </div>
  )

  if (isMobile) {
    return (
      <>
        {isSidebarOpen && <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />}
        <div className={`fixed inset-y-0 left-0 z-50 w-[250px] transform transition-transform duration-200 ease-out bg-white border-r border-slate-200 shadow-xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {content}
        </div>
      </>
    )
  }

  return (
    <aside className={`hidden lg:block fixed top-14 bottom-0 left-0 z-10 transition-all duration-300 ease-in-out bg-white border-r border-slate-200
      ${isSidebarOpen ? 'w-[250px]' : 'w-0 overflow-hidden'}`}>
      {content}
    </aside>
  )
}
