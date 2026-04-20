import {
  Users, Landmark, Shield, UserCog, Building2, HandHeart, BookOpen, 
  BarChart3, Bell, ClipboardList, Settings, User, CalendarDays, 
  Receipt, LayoutDashboard
} from "lucide-react";


export const sanghAdminDropdownSections = [
  {
    trigger: { icon: Building2, label: "My Sangh" },
    children: [
      { to: "/sangh-admin/my-sangh/details", icon: Building2, label: "Sangh Details" },
      { to: "/sangh-admin/my-sangh/linked-trusts", icon: Landmark, label: "Linked Trusts" },
      { to: "/sangh-admin/my-sangh/committee", icon: UserCog, label: "Committee Members" },
    ],
  },
  {
    trigger: { icon: Users, label: "Members" },
    to: "/sangh-admin/members",
    children: [],
  },
  {
    trigger: { icon: Landmark, label: "Institutions" },
    children: [
      { to: "/sangh-admin/institutions/derasar", icon: Landmark, label: "Derasar" },
      { to: "/sangh-admin/institutions/pathshala", icon: BookOpen, label: "Pathshala" },
      { to: "/sangh-admin/institutions/aayambil", icon: Building2, label: "Aayambil Shala" },
      { to: "/sangh-admin/institutions/upasray", icon: Building2, label: "Upasray" },
    ],
  },
  {
    trigger: { icon: CalendarDays, label: "Activities" },
    children: [
      { to: "/sangh-admin/activities/events", icon: CalendarDays, label: "Events" },
      { to: "/sangh-admin/activities/meetings", icon: Users, label: "Meetings" },
      { to: "/sangh-admin/activities/attendance", icon: ClipboardList, label: "Attendance" },
      { to: "/sangh-admin/activities/leave", icon: ClipboardList, label: "Leave Management" },
      { to: "/sangh-admin/activities/daily-work", icon: BarChart3, label: "Daily Work" },
    ],
  },
  {
    trigger: { icon: Receipt, label: "Finance" },
    children: [
      { to: "/sangh-admin/finance/donations", icon: HandHeart, label: "Donations" },
      { to: "/sangh-admin/finance/expenses", icon: Receipt, label: "Expenses" },
      { to: "/sangh-admin/finance/reports", icon: BarChart3, label: "Reports" },
    ],
  },
  {
    trigger: { icon: Shield, label: "Services" },
    children: [
      { to: "/sangh-admin/services/emergency", icon: Shield, label: "Emergency Contacts" },
    ],
  },
];

export const sanghAdminTopFlatItems = [
  { to: "/sangh-admin", icon: LayoutDashboard, label: "Dashboard" },
];

export const sanghAdminBottomFlatItems = [
  { to: "/sangh-admin/documents", icon: ClipboardList, label: "Documents" },
  { to: "/sangh-admin/notifications", icon: Bell, label: "Notifications" },
  { to: "/sangh-admin/reports", icon: BarChart3, label: "Reports" },
  { to: "/sangh-admin/settings", icon: Settings, label: "Settings" },
];


export const dropdownSections = sanghAdminDropdownSections;
export const flatItems = sanghAdminTopFlatItems;