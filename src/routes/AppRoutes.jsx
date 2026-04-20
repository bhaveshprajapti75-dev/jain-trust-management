import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import Dashboard from '../pages/dashboard/Dashboard'


import OrgIndex from '../pages/organization/OrgIndex' 
import Departments from '../pages/organization/Departments'
import Location from '../pages/organization/Location'

// Users & Staff
import UserList from '../pages/users/UserList'
import UserDocumentsPage from '../pages/users/UserDocumentsPage'
import RolesAndPermissionsPage from '../pages/RolesAndPermissions/RolesAndPermissionsPage'
import Managers from '../pages/staff/Managers'
import Accountants from '../pages/staff/Accountants'
import Helpers from '../pages/staff/Helpers'
import Volunteers from '../pages/staff/Volunteers'

// Committee & Donations
import CommitteeMembers from '../pages/committee/CommitteeMembers'
import DonationList from '../pages/donations/DonationList'
import AddDonation from '../pages/donations/AddDonation'
import EditDonation from '../pages/donations/EditDonation'
import Receipt from '../pages/donations/Receipt'

// Institutions
import DerasarList from '../pages/derasar/DerasarList'
import Students from '../pages/pathshala/Students'

// Accounts & Others
import Accounts from '../pages/accounts/Accounts'
import Income from '../pages/accounts/Income'
import Expense from '../pages/accounts/Expense'
import Notifications from '../pages/notifications/Notifications'

// Sangh Admin
import SanghAdminDashboard from '../pages/sanghAdmin/SanghAdminDashboard'
import SanghDetails from '../pages/sanghAdmin/mySangh/SanghDetails'
import LinkedTrusts from '../pages/sanghAdmin/mySangh/LinkedTrusts'
import SanghCommitteeMembers from '../pages/sanghAdmin/mySangh/CommitteeMembers'
import Members from '../pages/sanghAdmin/members/Members'
import Login from '../pages/login/Login'

// Shared/Common Pages
import Analytics from '../pages/reports/Analytics'
import DonationReport from '../pages/reports/DonationReport'
import ExpenseReport from '../pages/reports/ExpenseReport'
import Profile from '../pages/settings/Profile'
import Settings from '../pages/settings/Settings'

// Sangh Institution Pages
import Derasar from '../pages/sanghAdmin/institutions/Derasar'
import Pathshala from '../pages/sanghAdmin/institutions/Pathshala'
import AyambliShala from '../pages/sanghAdmin/institutions/AyambliShala'
import Upashray from '../pages/sanghAdmin/institutions/Upashray'

import { ROLES } from '../config/roles'
import { ProtectedRoute, RoleGuard } from '../components/auth/Guards'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        
        {/* SUPER ADMIN PROTECTED ROUTES */}
        <Route path="/" element={<RoleGuard allowedRoles={[ROLES.SUPER_ADMIN]} />}>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            
            {/* 🛠️ Organization Management - FIXED PATHS */}
            <Route path="organizations">
              <Route path="all" element={<OrgIndex />} />
              <Route path="trusts" element={<OrgIndex />} />
              <Route path="sanghs" element={<OrgIndex />} />
              <Route path="departments" element={<Departments />} />
            </Route>
            
            <Route path="locations" element={<Location />} />
            <Route path="users/all" element={<UserList />} />
            <Route path="users/:id/documents" element={<UserDocumentsPage />} />
            <Route path="users/roles" element={<RolesAndPermissionsPage />} />
            <Route path="staff/members" element={<Managers />} />
            <Route path="staff/dept" element={<Departments />} />
            <Route path="members/families" element={<UserList />} />
            <Route path="members/individual" element={<UserList />} />
            <Route path="members/committee" element={<CommitteeMembers />} />
            <Route path="finance/donations" element={<DonationList />} />
            <Route path="finance/receipts" element={<DonationList />} />
            <Route path="donations/add" element={<AddDonation />} />
            <Route path="donations/edit/:id" element={<EditDonation />} />
            <Route path="donations/receipt/:id" element={<Receipt />} />
            <Route path="institutions/derasar" element={<DerasarList />} />
            <Route path="institutions/pathshala" element={<Students />} />
            <Route path="accounts" element={<Accounts />} />
            <Route path="accounts/income" element={<Income />} />
            <Route path="accounts/expense" element={<Expense />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>

        {/* SANGH ADMIN PROTECTED ROUTES */}
        <Route path="/sangh-admin" element={<RoleGuard allowedRoles={[ROLES.SANGH_ADMIN]} />}>
          <Route element={<Layout />}>
            <Route index element={<SanghAdminDashboard />} />
            <Route path="my-sangh/details" element={<SanghDetails />} />
            <Route path="my-sangh/linked-trusts" element={<LinkedTrusts />} />
            <Route path="my-sangh/committee" element={<SanghCommitteeMembers />} />
            <Route path="members" element={<Members />} />
            <Route path="institutions/derasar" element={<Derasar />} />
            <Route path="institutions/pathshala" element={<Pathshala />} />
            <Route path="institutions/ayambil" element={<AyambliShala />} />
            <Route path="institutions/upashray" element={<Upashray />} />
            
            {/* Reports & Analytics */}
            <Route path="reports" element={<Analytics />} />
            <Route path="reports/analytics" element={<Analytics />} />
            <Route path="reports/donations" element={<DonationReport />} />
            <Route path="reports/expenses" element={<ExpenseReport />} />
            
            {/* Common Pages */}
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
            <Route path="settings/profile" element={<Profile />} />
            <Route path="documents" element={<Analytics />} /> {/* Placeholder */}
            
            {/* Finance & Activities - Using placeholders for now if components don't exist */}
            <Route path="finance/donations" element={<DonationList />} />
            <Route path="finance/expenses" element={<Expense />} />
            <Route path="finance/reports" element={<Analytics />} />
            
            <Route path="activities/events" element={<SanghAdminDashboard />} /> {/* Placeholder */}
            <Route path="activities/meetings" element={<SanghAdminDashboard />} /> {/* Placeholder */}
          </Route>
        </Route>
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}