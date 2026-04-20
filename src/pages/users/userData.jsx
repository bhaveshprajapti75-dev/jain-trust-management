import { INITIAL_ROLES } from '../RolesAndPermissions/RoleData'

export const INITIAL_USERS = [
  { id: 1, name: 'Naman Doshi', email: 'naman@jainsangh.com', phone: '9876543210', trustId: 1, sanghId: 1, departmentId: 1, roleId: 1, permissions: [], status: 'Active', joined: '2024-01-15', lastLogin: '2026-04-07 10:30', notes: 'Super Admin overseeing all trusts', committee: true, committeeRole: 'Chief Coordinator' },
  { id: 2, name: 'Rajesh Shah', email: 'rajesh@jainsangh.com', phone: '9876512340', trustId: 1, sanghId: 1, departmentId: 3, roleId: 2, permissions: [], status: 'Active', joined: '2024-02-10', lastLogin: '2026-04-06 09:00', notes: 'Trust Admin for Sathandji Kalyanji Trust', committee: true, committeeRole: 'President' },
  { id: 3, name: 'Amit Patel', email: 'amit@jainsangh.com', phone: '9876534562', trustId: 1, sanghId: 2, departmentId: 1, roleId: 3, permissions: [], status: 'Active', joined: '2024-01-20', lastLogin: '2026-04-05 14:00', notes: 'Sangh Admin handling Taleti operations', committee: false },
  { id: 4, name: 'Mehul Shah', email: 'mehul@jainsangh.com', phone: '9876567895', trustId: 1, sanghId: 1, departmentId: 1, roleId: 4, permissions: [], status: 'Active', joined: '2024-03-01', lastLogin: '2026-04-06 11:30', notes: 'Manager for daily sangh operations', committee: false },
  { id: 5, name: 'Anil Shah', email: 'anil@jainsangh.com', phone: '9876589017', trustId: 1, sanghId: 1, departmentId: 2, roleId: 5, permissions: [], status: 'Active', joined: '2024-02-01', lastLogin: '2026-04-07 08:45', notes: 'Accounts User for central trust accounts', committee: false },
  { id: 6, name: 'Vipul Shah', email: 'vipul@jainsangh.com', phone: '9876767890', trustId: 1, sanghId: 1, departmentId: 3, roleId: 6, permissions: [], status: 'Active', joined: '2024-09-15', lastLogin: '2026-04-05 14:30', notes: 'Committee observer and family liaison', committee: true, committeeRole: 'Secretary' },
  { id: 7, name: 'Bhavik Mehta', email: 'bhavik@jainsangh.com', phone: '9876623456', trustId: 2, sanghId: 3, departmentId: 5, roleId: 3, permissions: [], status: 'Active', joined: '2024-05-10', lastLogin: '2026-04-04 10:00', notes: 'Sangh Admin aligned with Pathshala batch planning', committee: false },
  { id: 8, name: 'Karan Desai', email: 'karan@jainsangh.com', phone: '9876645678', trustId: 2, sanghId: 4, departmentId: 4, roleId: 4, permissions: [], status: 'Inactive', joined: '2024-03-20', lastLogin: '2026-03-20 12:00', notes: 'Manager assigned to temple support team', committee: false },
  { id: 9, name: 'Jayesh Patel', email: 'jayesh@jainsangh.com', phone: '9876667890', trustId: 2, sanghId: 3, departmentId: 2, roleId: 5, permissions: [], status: 'Active', joined: '2024-06-01', lastLogin: '2026-04-07 09:30', notes: 'Accounts reporting and reconciliation support', committee: false },
  { id: 10, name: 'Prakash Soni', email: 'prakash@jainsangh.com', phone: '9876689012', trustId: 2, sanghId: 3, departmentId: 3, roleId: 2, permissions: [], status: 'Active', joined: '2024-01-25', lastLogin: '2026-04-06 15:00', notes: 'Trust Admin for Palitana Jain Welfare Trust', committee: true, committeeRole: 'Vice President' },
  { id: 11, name: 'Ravi Mehta', email: 'ravi@jainsangh.com', phone: '9876701234', trustId: 3, sanghId: 5, departmentId: 1, roleId: 4, permissions: [], status: 'Active', joined: '2024-07-10', lastLogin: '2026-04-06 11:00', notes: 'Manager for seva scheduling', committee: false },
  { id: 12, name: 'Dinesh Jain', email: 'dinesh@jainsangh.com', phone: '9876723456', trustId: 2, sanghId: 4, departmentId: 6, roleId: 5, permissions: [], status: 'Suspended', joined: '2024-02-15', lastLogin: '2026-03-10 10:00', notes: 'Expense entry access suspended pending audit review', committee: false },
  { id: 13, name: 'Harsh Patel', email: 'harsh@jainsangh.com', phone: '9876745678', trustId: 3, sanghId: 5, departmentId: 5, roleId: 6, permissions: [], status: 'Active', joined: '2024-08-01', lastLogin: '2026-04-07 08:00', notes: 'Normal User with Pathshala view access', committee: false },
  { id: 14, name: 'Suresh Jain', email: 'suresh@jainsangh.com', phone: '9876601234', trustId: 1, sanghId: 2, departmentId: 3, roleId: 6, permissions: [], status: 'Active', joined: '2024-04-15', lastLogin: '2026-04-05 16:00', notes: 'Committee member for sangh planning', committee: true, committeeRole: 'Committee Member' },
  { id: 15, name: 'Chirag Desai', email: 'chirag@jainsangh.com', phone: '9876789012', trustId: 1, sanghId: 1, departmentId: 4, roleId: 6, permissions: [], status: 'Active', joined: '2024-10-01', lastLogin: '2026-04-06 09:00', notes: 'Volunteer-style view user for derasar support', committee: false },
]

export const INITIAL_USER_DOCS = [
  { id: 1, userId: 1, type: 'Aadhaar', fileName: 'aadhaar_naman.pdf', status: 'Approved', uploadedDate: '2024-01-15', uploadedBy: 'Naman Doshi', notes: '' },
  { id: 2, userId: 1, type: 'PAN', fileName: 'pan_naman.pdf', status: 'Approved', uploadedDate: '2024-01-15', uploadedBy: 'Naman Doshi', notes: '' },
  { id: 3, userId: 2, type: 'Trust Appointment', fileName: 'appt_rajesh.pdf', status: 'Approved', uploadedDate: '2024-02-10', uploadedBy: 'Naman Doshi', notes: 'Trust Admin approval' },
  { id: 4, userId: 5, type: 'Bank Authorization', fileName: 'bank_anil.pdf', status: 'Pending', uploadedDate: '2024-02-01', uploadedBy: 'Rajesh Shah', notes: '' },
  { id: 5, userId: 9, type: 'Income Ledger', fileName: 'income_jayesh.xlsx', status: 'Approved', uploadedDate: '2024-06-01', uploadedBy: 'Prakash Soni', notes: '' },
  { id: 6, userId: 12, type: 'Audit Note', fileName: 'audit_dinesh.pdf', status: 'Rejected', uploadedDate: '2024-02-15', uploadedBy: 'Anil Shah', notes: 'Pending clarification' },
]

export const INITIAL_ACTIVITIES = [
  { id: 1, userId: 1, action: 'created', description: 'User account created as Super Admin', doneBy: 'System', date: '2024-01-15 09:00' },
  { id: 2, userId: 2, action: 'created', description: 'User account created as Trust Admin', doneBy: 'Naman Doshi', date: '2024-02-10 10:00' },
  { id: 3, userId: 5, action: 'permission_change', description: 'Accounts access reviewed and confirmed', doneBy: 'Rajesh Shah', date: '2024-03-15 14:00' },
  { id: 4, userId: 8, action: 'status_change', description: 'Status changed from Active to Inactive', doneBy: 'Prakash Soni', date: '2026-03-20 12:00' },
  { id: 5, userId: 12, action: 'status_change', description: 'Status changed from Active to Suspended', doneBy: 'Naman Doshi', date: '2026-03-10 10:00' },
  { id: 6, userId: 1, action: 'login', description: 'User logged in', doneBy: 'Naman Doshi', date: '2026-04-07 10:30' },
  { id: 7, userId: 3, action: 'role_change', description: 'Role confirmed as Sangh Admin', doneBy: 'Rajesh Shah', date: '2025-06-01 11:00' },
  { id: 8, userId: 10, action: 'committee_update', description: 'Assigned as Vice President', doneBy: 'Naman Doshi', date: '2025-11-12 10:30' },
]

export function getRoleName(roleId) {
  const role = INITIAL_ROLES.find(function(item) { return item.id === roleId })
  return role ? role.name : '-'
}

export function getRole(roleId) {
  return INITIAL_ROLES.find(function(item) { return item.id === roleId })
}

export function getDocCount(userId, docs) {
  return (docs || []).filter(function(item) { return item.userId === userId }).length
}

export function getUserDocs(userId, docs) {
  return (docs || []).filter(function(item) { return item.userId === userId })
}

export function getUserActivities(userId, activities) {
  return (activities || []).filter(function(item) { return item.userId === userId }).sort(function(a, b) { return new Date(b.date) - new Date(a.date) })
}

export function getStatusCounts(users) {
  const counts = { Active: 0, Inactive: 0, Suspended: 0, Deleted: 0, Total: 0 }
  ;(users || []).forEach(function(user) {
    counts[user.status] = (counts[user.status] || 0) + 1
    counts.Total += 1
  })
  return counts
}

export function getUsersByRole(roleId, users) {
  return (users || []).filter(function(user) { return user.roleId === roleId })
}

export function getUsersByTrust(trustId, users) {
  return (users || []).filter(function(user) { return user.trustId === trustId })
}

export function getUsersBySangh(sanghId, users) {
  return (users || []).filter(function(user) { return user.sanghId === sanghId })
}
