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

import { ROLES } from '../config/roles'
import { ProtectedRoute, RoleGuard } from '../components/auth/Guards'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        
        {/* SUPER ADMIN PROTECTED ROUTES */}
        <Route element={<RoleGuard allowedRoles={[ROLES.SUPER_ADMIN]} />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            
            {/* 🛠️ Organization Management - FIXED PATHS */}
            {/* Sidebar na badha link ek j OrgIndex page par jase jya tame Tabs banaya che */}
            <Route path="organizations">
              <Route path="all" element={<OrgIndex />} />
              <Route path="trusts" element={<OrgIndex />} />
              <Route path="sanghs" element={<OrgIndex />} />
              <Route path="departments" element={<Departments />} />
            </Route>
            
            {/* Location Management */}
            <Route path="locations" element={<Location />} />
            
            {/* Users & Roles */}
            <Route path="users/all" element={<UserList />} />
            <Route path="users/:id/documents" element={<UserDocumentsPage />} />
            <Route path="users/roles" element={<RolesAndPermissionsPage />} />
            
            {/* Staff Management */}
            <Route path="staff/members" element={<Managers />} />
            <Route path="staff/dept" element={<Departments />} />
            
            {/* Members Section */}
            <Route path="members/families" element={<UserList />} />
            <Route path="members/individual" element={<UserList />} />
            <Route path="members/committee" element={<CommitteeMembers />} />
            
            {/* Donations & Finance */}
            <Route path="finance/donations" element={<DonationList />} />
            <Route path="finance/receipts" element={<DonationList />} />
            <Route path="donations/add" element={<AddDonation />} />
            <Route path="donations/edit/:id" element={<EditDonation />} />
            <Route path="donations/receipt/:id" element={<Receipt />} />
            
            {/* Institutions */}
            <Route path="institutions/derasar" element={<DerasarList />} />
            <Route path="institutions/pathshala" element={<Students />} />
            
            {/* Accounts */}
            <Route path="accounts" element={<Accounts />} />
            <Route path="accounts/income" element={<Income />} />
            <Route path="accounts/expense" element={<Expense />} />
            
            {/* General */}
            <Route path="notifications" element={<Notifications />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>

        {/* SANGH ADMIN PROTECTED ROUTES */}
        <Route element={<RoleGuard allowedRoles={[ROLES.SANGH_ADMIN]} />}>
          <Route path="/sangh-admin" element={<Layout />}>
            <Route index element={<SanghAdminDashboard />} />
            <Route path="my-sangh/details" element={<SanghDetails />} />
            <Route path="my-sangh/linked-trusts" element={<LinkedTrusts />} />
            <Route path="my-sangh/committee" element={<SanghCommitteeMembers />} />
            <Route path="members" element={<Members />} />
          </Route>
        </Route>

      </Route>
    </Routes>
  )
}