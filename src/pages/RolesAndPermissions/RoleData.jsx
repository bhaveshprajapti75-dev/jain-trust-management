/* eslint-disable react-refresh/only-export-components */
import {
  LayoutDashboard,
  MapPin,
  Users,
  Landmark,
  BookOpen,
  BarChart3,
  Gem,
  Shield,
  Receipt,
  UserCog,
} from 'lucide-react'

export const ICONS = {
  LayoutDashboard,
  MapPin,
  Users,
  Landmark,
  BookOpen,
  BarChart3,
  Gem,
  Shield,
  Receipt,
  UserCog,
}

export const PERM_GROUPS = [
  { key: 'dashboard', label: 'Dashboard View', icon: 'LayoutDashboard', perms: ['View'], type: 'System' },
  { key: 'users', label: 'User Create / Edit / Delete', icon: 'UserCog', perms: ['View', 'Create', 'Edit', 'Delete'], type: 'System' },
  { key: 'trust', label: 'Trust Create / Edit / Delete', icon: 'Landmark', perms: ['View', 'Create', 'Edit', 'Delete'], type: 'Trust' },
  { key: 'sangh', label: 'Sangh Create / Edit / Delete', icon: 'Users', perms: ['View', 'Create', 'Edit', 'Delete'], type: 'Sangh' },
  { key: 'location', label: 'Location Create / Edit / Delete', icon: 'MapPin', perms: ['View', 'Create', 'Edit', 'Delete'], type: 'System' },
  { key: 'accounts', label: 'Accounts Create / Edit / Delete', icon: 'Receipt', perms: ['View', 'Create', 'Edit', 'Delete'], type: 'Trust' },
  { key: 'committee', label: 'Committee Create / Edit / Delete', icon: 'Users', perms: ['View', 'Create', 'Edit', 'Delete'], type: 'Sangh' },
  { key: 'derasar', label: 'Derasar Create / Edit / Delete', icon: 'Gem', perms: ['View', 'Create', 'Edit', 'Delete'], type: 'Sangh' },
  { key: 'pathshala_students', label: 'Pathshala Student Create / Edit / Delete', icon: 'BookOpen', perms: ['View', 'Create', 'Edit', 'Delete'], type: 'Sangh' },
  { key: 'pathshala_exams', label: 'Pathshala Exam Create / Edit / Delete', icon: 'BookOpen', perms: ['View', 'Create', 'Edit', 'Delete'], type: 'Sangh' },
  { key: 'pathshala_results', label: 'Pathshala Result Create / Edit / Delete', icon: 'BarChart3', perms: ['View', 'Create', 'Edit', 'Delete'], type: 'Sangh' },
  { key: 'reports', label: 'Reports View / Export', icon: 'BarChart3', perms: ['View', 'Export'], type: 'Trust' },
  { key: 'permissions', label: 'Permission Change', icon: 'Shield', perms: ['View', 'Change'], type: 'System' },
]

let PERM_LABEL_MAP = {}
function rebuildLabelMap() {
  PERM_LABEL_MAP = {}
  PERM_GROUPS.forEach(function(group) {
    group.perms.forEach(function(permission) {
      PERM_LABEL_MAP[group.key + '_' + permission.toLowerCase().replace(/\s+/g, '_')] = permission
    })
  })
}
rebuildLabelMap()

export function getTotalPerms() {
  return PERM_GROUPS.reduce(function(sum, group) { return sum + group.perms.length }, 0)
}

export function getAllPermKeys() {
  return PERM_GROUPS.flatMap(function(group) {
    return group.perms.map(function(permission) {
      return group.key + '_' + permission.toLowerCase().replace(/\s+/g, '_')
    })
  })
}

export function getPermsByType(type) {
  return PERM_GROUPS.filter(function(group) { return group.type === type })
}

export function getFullPermKeysForType(type) {
  return getPermsByType(type).flatMap(function(group) {
    return group.perms.map(function(permission) {
      return group.key + '_' + permission.toLowerCase().replace(/\s+/g, '_')
    })
  })
}

export function P(groupKey, action) {
  return groupKey + '_' + action.toLowerCase().replace(/\s+/g, '_')
}

export function getPerms(role) {
  return role.permissions === 'all' ? getAllPermKeys() : role.permissions
}

export function getCount(role) {
  if (role.permissions === 'all') return getTotalPerms()
  return Array.isArray(role.permissions) ? role.permissions.length : 0
}

export function hasPerm(role, key) {
  if (role.permissions === 'all') return true
  return Array.isArray(role.permissions) && role.permissions.indexOf(key) !== -1
}

export function getUserCount(roleId, users) {
  return users.filter(function(user) { return user.roleId === roleId }).length
}

export function permsToNested(perms) {
  if (perms === 'all' || !Array.isArray(perms)) return {}
  const nested = {}

  perms.forEach(function(key) {
    const label = PERM_LABEL_MAP[key]
    if (!label) return

    const group = PERM_GROUPS.find(function(item) {
      return item.perms.some(function(permission) {
        return item.key + '_' + permission.toLowerCase().replace(/\s+/g, '_') === key
      })
    })

    if (!group) return
    if (!nested[group.key]) nested[group.key] = {}
    nested[group.key][label] = true
  })

  return nested
}

export function nestedToPerms(nested) {
  if (!nested || typeof nested !== 'object') return []
  const permissions = []

  Object.keys(nested).forEach(function(groupKey) {
    const actions = nested[groupKey]
    if (!actions || typeof actions !== 'object') return

    Object.keys(actions).forEach(function(label) {
      if (actions[label]) {
        const key = groupKey + '_' + label.toLowerCase().replace(/\s+/g, '_')
        if (PERM_LABEL_MAP[key]) permissions.push(key)
      }
    })
  })

  return permissions
}

export function addPermToGroup(groupKey, permLabel) {
  const group = PERM_GROUPS.find(function(item) { return item.key === groupKey })
  if (!group || group.perms.indexOf(permLabel) !== -1) return false
  group.perms.push(permLabel)
  rebuildLabelMap()
  return true
}

export function updatePermInGroup(groupKey, oldLabel, newLabel) {
  const group = PERM_GROUPS.find(function(item) { return item.key === groupKey })
  if (!group) return false
  const index = group.perms.indexOf(oldLabel)
  if (index === -1) return false
  group.perms[index] = newLabel
  rebuildLabelMap()
  return true
}

export function deletePermFromGroup(groupKey, permLabel) {
  const group = PERM_GROUPS.find(function(item) { return item.key === groupKey })
  if (!group) return false
  const index = group.perms.indexOf(permLabel)
  if (index === -1) return false
  group.perms.splice(index, 1)
  rebuildLabelMap()
  return true
}

export function addPermGroup(key, label, icon, type) {
  if (PERM_GROUPS.find(function(group) { return group.key === key })) return false
  PERM_GROUPS.push({ key, label, icon: icon || 'Shield', perms: [], type: type || 'System' })
  rebuildLabelMap()
  return true
}

export function deletePermGroup(groupKey) {
  const index = PERM_GROUPS.findIndex(function(group) { return group.key === groupKey })
  if (index === -1) return false
  PERM_GROUPS.splice(index, 1)
  rebuildLabelMap()
  return true
}

export function sortRoles(roles, sortBy, sortDir, users) {
  return roles.slice().sort(function(a, b) {
    let comparison = 0
    if (sortBy === 'name') comparison = a.name.localeCompare(b.name)
    else if (sortBy === 'type') comparison = a.type.localeCompare(b.type) || a.name.localeCompare(b.name)
    else if (sortBy === 'users') comparison = getUserCount(a.id, users) - getUserCount(b.id, users)
    else if (sortBy === 'perms') comparison = getCount(a) - getCount(b)
    else comparison = a.name.localeCompare(b.name)
    return sortDir === 'asc' ? comparison : -comparison
  })
}

export const INITIAL_ROLES = [
  {
    id: 1,
    name: 'Super Admin',
    type: 'System',
    description: 'Complete access across all trusts, sanghs, modules, and permission controls.',
    status: 'Active',
    isLocked: true,
    permissions: 'all',
  },
  {
    id: 2,
    name: 'Trust Admin',
    type: 'Trust',
    description: 'Can manage only the assigned trust and its sanghs.',
    status: 'Active',
    isLocked: false,
    permissions: [
      P('dashboard', 'View'),
      P('users', 'View'),
      P('users', 'Create'),
      P('users', 'Edit'),
      P('trust', 'View'),
      P('trust', 'Edit'),
      P('sangh', 'View'),
      P('sangh', 'Create'),
      P('sangh', 'Edit'),
      P('location', 'View'),
      P('location', 'Create'),
      P('location', 'Edit'),
      P('accounts', 'View'),
      P('accounts', 'Create'),
      P('accounts', 'Edit'),
      P('committee', 'View'),
      P('committee', 'Create'),
      P('committee', 'Edit'),
      P('derasar', 'View'),
      P('derasar', 'Create'),
      P('derasar', 'Edit'),
      P('pathshala_students', 'View'),
      P('pathshala_students', 'Create'),
      P('pathshala_students', 'Edit'),
      P('pathshala_exams', 'View'),
      P('pathshala_exams', 'Create'),
      P('pathshala_exams', 'Edit'),
      P('pathshala_results', 'View'),
      P('pathshala_results', 'Create'),
      P('pathshala_results', 'Edit'),
      P('reports', 'View'),
      P('reports', 'Export'),
      P('permissions', 'View'),
    ],
  },
  {
    id: 3,
    name: 'Sangh Admin',
    type: 'Sangh',
    description: 'Can manage only the assigned sangh.',
    status: 'Active',
    isLocked: false,
    permissions: [
      P('dashboard', 'View'),
      P('users', 'View'),
      P('users', 'Create'),
      P('users', 'Edit'),
      P('sangh', 'View'),
      P('sangh', 'Edit'),
      P('location', 'View'),
      P('location', 'Edit'),
      P('committee', 'View'),
      P('committee', 'Create'),
      P('committee', 'Edit'),
      P('derasar', 'View'),
      P('derasar', 'Create'),
      P('derasar', 'Edit'),
      P('pathshala_students', 'View'),
      P('pathshala_students', 'Create'),
      P('pathshala_students', 'Edit'),
      P('pathshala_exams', 'View'),
      P('pathshala_exams', 'Create'),
      P('pathshala_exams', 'Edit'),
      P('pathshala_results', 'View'),
      P('pathshala_results', 'Create'),
      P('pathshala_results', 'Edit'),
      P('reports', 'View'),
    ],
  },
  {
    id: 4,
    name: 'Manager',
    type: 'Sangh',
    description: 'Can add and edit but cannot delete.',
    status: 'Active',
    isLocked: false,
    permissions: [
      P('dashboard', 'View'),
      P('users', 'View'),
      P('users', 'Create'),
      P('users', 'Edit'),
      P('sangh', 'View'),
      P('sangh', 'Create'),
      P('sangh', 'Edit'),
      P('location', 'View'),
      P('location', 'Create'),
      P('location', 'Edit'),
      P('committee', 'View'),
      P('committee', 'Create'),
      P('committee', 'Edit'),
      P('derasar', 'View'),
      P('derasar', 'Create'),
      P('derasar', 'Edit'),
      P('pathshala_students', 'View'),
      P('pathshala_students', 'Create'),
      P('pathshala_students', 'Edit'),
      P('pathshala_exams', 'View'),
      P('pathshala_exams', 'Create'),
      P('pathshala_exams', 'Edit'),
      P('pathshala_results', 'View'),
      P('pathshala_results', 'Create'),
      P('pathshala_results', 'Edit'),
    ],
  },
  {
    id: 5,
    name: 'Accounts User',
    type: 'Trust',
    description: 'Can manage accounts and reports only.',
    status: 'Active',
    isLocked: false,
    permissions: [
      P('dashboard', 'View'),
      P('accounts', 'View'),
      P('accounts', 'Create'),
      P('accounts', 'Edit'),
      P('reports', 'View'),
      P('reports', 'Export'),
    ],
  },
  {
    id: 6,
    name: 'Normal User',
    type: 'System',
    description: 'View-only access across the assigned trust and sangh records.',
    status: 'Active',
    isLocked: false,
    permissions: [
      P('dashboard', 'View'),
      P('users', 'View'),
      P('trust', 'View'),
      P('sangh', 'View'),
      P('location', 'View'),
      P('accounts', 'View'),
      P('committee', 'View'),
      P('derasar', 'View'),
      P('pathshala_students', 'View'),
      P('pathshala_exams', 'View'),
      P('pathshala_results', 'View'),
      P('reports', 'View'),
      P('permissions', 'View'),
    ],
  },
]

export const INITIAL_USERS = [
  { id: 1, roleId: 1, name: 'Naman Doshi', email: 'naman@jainsangh.com', phone: '9876543210', status: 'Active', joined: '2024-01-15' },
  { id: 2, roleId: 2, name: 'Rajesh Shah', email: 'rajesh@jainsangh.com', phone: '9876512340', status: 'Active', joined: '2024-02-10' },
  { id: 3, roleId: 3, name: 'Amit Patel', email: 'amit@jainsangh.com', phone: '9876534562', status: 'Active', joined: '2024-01-20' },
  { id: 4, roleId: 4, name: 'Mehul Shah', email: 'mehul@jainsangh.com', phone: '9876567895', status: 'Active', joined: '2024-03-01' },
  { id: 5, roleId: 5, name: 'Anil Shah', email: 'anil@jainsangh.com', phone: '9876589017', status: 'Active', joined: '2024-02-01' },
  { id: 6, roleId: 6, name: 'Vipul Shah', email: 'vipul@jainsangh.com', phone: '9876767890', status: 'Active', joined: '2024-04-15' },
]
