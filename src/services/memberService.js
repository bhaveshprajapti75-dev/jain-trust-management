import api from '../api/axios';
import { apiService } from './apiService';

// Mock Data for Members
let MOCK_MEMBERS = [
  {
    id: 1,
    name: 'Ramesh Shah',
    family_category: 'Life Member',
    role: 'Head',
    gender: 'Male',
    blood_group: 'O+',
    mobile: '9876543210',
    email: 'ramesh@example.com',
    birthDate: '1970-05-15',
    address: 'Paldi, Ahmedabad',
    status: 'Active',
    is_volunteer: true,
    is_family_head: true,
    familyId: 1,
    location: '',
    document: ''
  },
  {
    id: 2,
    name: 'Suresh Jain',
    family_category: 'Niyat',
    role: 'Head',
    gender: 'Male',
    blood_group: 'B+',
    mobile: '9876543211',
    email: 'suresh@example.com',
    birthDate: '1975-08-20',
    address: 'Adajan, Surat',
    status: 'Inactive',
    is_volunteer: false,
    is_family_head: true,
    familyId: 2,
    location: '',
    document: ''
  }
];

let MOCK_CATEGORIES = ['General', 'Life Member', 'Niyat', 'Other'];

// Set this to false when the backend is available
const USE_MOCK = true;

export const memberService = {
  getMembers: async (params) => {
    if (USE_MOCK) {
      console.log('Using mock data for getMembers');
      return Promise.resolve([...MOCK_MEMBERS]);
    }
    return apiService.get('v1/members/', params);
  },

  getMember: async (id) => {
    if (USE_MOCK) {
      const member = MOCK_MEMBERS.find(m => m.id === parseInt(id));
      return Promise.resolve(member ? { ...member } : null);
    }
    return apiService.get(`v1/members/${id}/`);
  },

  createMember: async (data) => {
    if (USE_MOCK) {
      console.log('Mock: Creating member', data);
      const newMember = { ...data, id: Date.now() };
      MOCK_MEMBERS.push(newMember);
      return Promise.resolve(newMember);
    }
    return apiService.post('v1/members/', data);
  },

  updateMember: async (id, data) => {
    if (USE_MOCK) {
      console.log('Mock: Updating member', id, data);
      const index = MOCK_MEMBERS.findIndex(m => m.id === parseInt(id));
      if (index !== -1) {
        MOCK_MEMBERS[index] = { ...MOCK_MEMBERS[index], ...data, id: parseInt(id) };
        return Promise.resolve(MOCK_MEMBERS[index]);
      }
      return Promise.reject(new Error('Member not found'));
    }
    return apiService.put(`v1/members/${id}/`, data);
  },

  deleteMember: async (id) => {
    if (USE_MOCK) {
      console.log('Mock: Deleting member', id);
      MOCK_MEMBERS = MOCK_MEMBERS.filter(m => m.id !== parseInt(id));
      return Promise.resolve({ success: true });
    }
    return apiService.delete(`v1/members/${id}/`);
  },

  getCategories: async () => {
    if (USE_MOCK) {
      return Promise.resolve([...MOCK_CATEGORIES]);
    }
    return apiService.get('v1/members/categories/');
  },

  createCategory: async (name) => {
    if (USE_MOCK) {
      if (!MOCK_CATEGORIES.includes(name)) {
         MOCK_CATEGORIES.push(name);
      }
      return Promise.resolve(name);
    }
    return apiService.post('v1/members/categories/', { name });
  }
};
