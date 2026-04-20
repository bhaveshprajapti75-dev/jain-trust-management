// Initial Data - Clean frontend only
export const INITIAL_TRUSTS = [
  {
    id: 1,
    name: 'Shree Palitana Jain Trust',
    mainContactPerson: 'Rajesh Mehta',
    mobile: '+91 98765 43210',
    email: 'rajesh@palitanatrust.org',
    address: 'Main Road, Near Derasar',
    area: 'Taleti',
    city: 'Palitana',
    state: 'Gujarat',
    about: 'Managing Palitana Jain temple and community services with focus on education and healthcare.',
    totalMembers: 1250,
    team: [],
    document: null,
    linkedSanghs: [101, 103],
    status: true,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
    activity: [{ id: 1, action: 'Trust Created', timestamp: '2024-01-01T10:00:00Z', user: 'Admin' }]
  },
  {
    id: 2,
    name: 'Ahmedabad Jain Trust',
    mainContactPerson: 'Nitin Shah',
    mobile: '+91 98765 43211',
    email: 'nitin@ahmedabadtrust.org',
    address: 'SG Highway, Bodakdev',
    area: 'Bodakdev',
    city: 'Ahmedabad',
    state: 'Gujarat',
    about: 'Ahmedabad Jain community services, managing multiple temples and social activities.',
    totalMembers: 2100,
    team: [],
    document: null,
    linkedSanghs: [101],
    status: true,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
    activity: [{ id: 1, action: 'Trust Created', timestamp: '2024-01-01T10:00:00Z', user: 'Admin' }]
  },
  {
    id: 3,
    name: 'Surat Jain Mandir Trust',
    mainContactPerson: 'Mukesh Patel',
    mobile: '+91 98765 43212',
    email: 'mukesh@surattrust.org',
    address: 'City Light Road, Adajan',
    area: 'Adajan',
    city: 'Surat',
    state: 'Gujarat',
    about: 'Managing Surat Jain temple and community events.',
    totalMembers: 850,
    team: [],
    document: null,
    linkedSanghs: [102],
    status: false,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
    activity: [{ id: 1, action: 'Trust Created', timestamp: '2024-01-01T10:00:00Z', user: 'Admin' }]
  },
  {
    id: 4,
    name: 'Rajkot Jain Sangh Trust',
    mainContactPerson: 'Dinesh Boda',
    mobile: '+91 98765 43213',
    email: 'dinesh@rajkottrust.org',
    address: 'Jain Derasar, Kalavad Road',
    area: 'Kalavad Road',
    city: 'Rajkot',
    state: 'Gujarat',
    about: 'Rajkot region Jain activities and community welfare programs.',
    totalMembers: 980,
    team: [],
    document: null,
    linkedSanghs: [104],
    status: true,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
    activity: [{ id: 1, action: 'Trust Created', timestamp: '2024-01-01T10:00:00Z', user: 'Admin' }]
  }
];

export const INITIAL_SANGHS = [
  {
    id: 101,
    name: 'Ahmedabad Jain Sangh',
    mainPersonName: 'Ramesh Shah',
    mobile: '+91 98765 43214',
    email: 'ramesh@ahmedabadsangh.org',
    address: 'Near Jain Temple, Ellisbridge',
    area: 'Navrangpura',
    city: 'Ahmedabad',
    state: 'Gujarat',
    totalFamilies: 350,
    totalMembers: 1250,
    about: 'Main sangh for Ahmedabad region, active in community service and religious activities.',
    committee: [],
    document: null,
    linkedTrustId: 2,
    status: true,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
    activity: [{ id: 1, action: 'Sangh Created', timestamp: '2024-01-01T10:00:00Z', user: 'Admin' }]
  },
  {
    id: 102,
    name: 'Surat Jain Sangh',
    mainPersonName: 'Kiran Patel',
    mobile: '+91 98765 43215',
    email: 'kiran@suratsangh.org',
    address: 'City Light Road',
    area: 'City Light',
    city: 'Surat',
    state: 'Gujarat',
    totalFamilies: 250,
    totalMembers: 850,
    about: 'Surat region Jain activities and community engagement.',
    committee: [],
    document: null,
    linkedTrustId: 3,
    status: true,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
    activity: [{ id: 1, action: 'Sangh Created', timestamp: '2024-01-01T10:00:00Z', user: 'Admin' }]
  },
  {
    id: 103,
    name: 'Palitana Sangh',
    mainPersonName: 'Vijay Mehta',
    mobile: '+91 98765 43216',
    email: 'vijay@palitanasangh.org',
    address: 'Taleti Road',
    area: 'Taleti',
    city: 'Palitana',
    state: 'Gujarat',
    totalFamilies: 120,
    totalMembers: 450,
    about: 'Palitana region sangh, focused on pilgrimage services.',
    committee: [],
    document: null,
    linkedTrustId: 1,
    status: false,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
    activity: [{ id: 1, action: 'Sangh Created', timestamp: '2024-01-01T10:00:00Z', user: 'Admin' }]
  },
  {
    id: 104,
    name: 'Rajkot Jain Sangh',
    mainPersonName: 'Ashok Boda',
    mobile: '+91 98765 43217',
    email: 'ashok@rajkotsangh.org',
    address: 'Kalavad Road',
    area: 'Kalavad Road',
    city: 'Rajkot',
    state: 'Gujarat',
    totalFamilies: 180,
    totalMembers: 620,
    about: 'Rajkot region Jain sangh, active in social welfare.',
    committee: [],
    document: null,
    linkedTrustId: 4,
    status: true,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
    activity: [{ id: 1, action: 'Sangh Created', timestamp: '2024-01-01T10:00:00Z', user: 'Admin' }]
  },
  {
    id: 105,
    name: 'Vadodara Jain Sangh',
    mainPersonName: 'Mahesh Jain',
    mobile: '+91 98765 43218',
    email: 'mahesh@vadodarasangh.org',
    address: 'Alkapuri',
    area: 'Alkapuri',
    city: 'Vadodara',
    state: 'Gujarat',
    totalFamilies: 220,
    totalMembers: 780,
    about: 'Vadodara Jain community sangh, active in educational programs.',
    committee: [],
    document: null,
    linkedTrustId: 2,
    status: true,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
    activity: [{ id: 1, action: 'Sangh Created', timestamp: '2024-01-01T10:00:00Z', user: 'Admin' }]
  }
];

export const INITIAL_LINKS = [
  { id: 1, trustId: 1, sanghId: 101, linkedAt: '2020-01-01', status: true },
  { id: 2, trustId: 1, sanghId: 103, linkedAt: '2020-06-15', status: true },
  { id: 3, trustId: 2, sanghId: 101, linkedAt: '2019-03-10', status: true },
  { id: 4, trustId: 3, sanghId: 102, linkedAt: '2021-02-20', status: true },
  { id: 5, trustId: 4, sanghId: 104, linkedAt: '2018-11-30', status: true }
];

// Add this export - INITIAL_DEPARTMENTS
export const INITIAL_DEPARTMENTS = [
  { id: 1, name: 'Accounts & Finance', head: 'Nirav Shah', members: 5 },
  { id: 2, name: 'Donation Management', head: 'Mehul Mehta', members: 8 },
  { id: 3, name: 'Event Management', head: 'Rakesh Jain', members: 12 },
];

const STORAGE_KEY = 'org_management_final_v2';

export const getOrgData = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return JSON.parse(saved);
  return { trusts: INITIAL_TRUSTS, sanghs: INITIAL_SANGHS, links: INITIAL_LINKS };
};

export const saveOrgData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getTrustName = (trustId, trusts) => {
  const trust = trusts.find(t => t.id === trustId);
  return trust ? trust.name : 'Unknown Trust';
};

export const getSanghName = (sanghId, sanghs) => {
  const sangh = sanghs.find(s => s.id === sanghId);
  return sangh ? sangh.name : 'Unknown Sangh';
};

export const addActivity = (item, action, user = 'Admin') => {
  const newActivity = {
    id: Date.now(),
    action,
    timestamp: new Date().toISOString(),
    user
  };
  item.activity = item.activity || [];
  item.activity.unshift(newActivity);
  item.updatedAt = new Date().toISOString();
  return item;
};