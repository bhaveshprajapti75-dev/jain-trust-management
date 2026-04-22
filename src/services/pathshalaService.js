import api from '../api/axios';
import { apiService } from './apiService';

// Mock Data for Pathshala
let MOCK_PATHSHALAS = [
  { 
    id: 1, 
    name: 'Shree Mahaveer Pathshala', 
    medium: ['Gujarati'],
    established: '1995',
    totalStudents: 120,
    totalTeachers: 5,
    totalClasses: 6,
    ageGroupFrom: 5,
    ageGroupTo: 15,
    morningFrom: '08:00',
    morningTo: '10:00',
    subjectsOffered: 'Samyak Darshan, Gatha, Pratikraman',
    feeType: 'Free',
    monthlyFee: '',
    status: 'Active',
    address: 'Near Jain Temple, Navrangpura',
    landmark: 'Behind Bank of Baroda',
    city: 'Ahmedabad',
    taluka: 'Ahmedabad',
    district: 'Ahmedabad',
    pincode: '380009',
    mapLink: 'https://goo.gl/maps/example1',
    principalName: 'Shantilal Mehta',
    principalPhone: '9876543210',
    trusteeName: 'Ramesh Shah',
    trusteePhone: '9825098250',
    trustName: 'Navrangpura Jain Sangh',
    email: 'pathshala@navrangpura.com',
    website: 'www.navrangpurapathshala.com',
    photos: []
  },
  { 
    id: 2, 
    name: 'Gyan Mandir Pathshala', 
    medium: ['English'],
    established: '2005',
    totalStudents: 85,
    totalTeachers: 4,
    totalClasses: 4,
    ageGroupFrom: 8,
    ageGroupTo: 18,
    morningFrom: '07:30',
    morningTo: '09:30',
    subjectsOffered: 'Jain History, Tattvarth Sutra',
    feeType: 'Paid',
    monthlyFee: '500',
    status: 'Active',
    address: 'Adajan Road',
    landmark: 'Near Flower Market',
    city: 'Surat',
    taluka: 'Surat',
    district: 'Surat',
    pincode: '395009',
    mapLink: 'https://goo.gl/maps/example2',
    principalName: 'Minaben Jain',
    principalPhone: '9876500012',
    trusteeName: 'Suresh Jhaveri',
    trusteePhone: '9898098980',
    trustName: 'Surat Adajan Sangh',
    email: 'gyan@suratjain.org',
    website: '',
    photos: []
  }
];

// Set this to false when the backend is available
const USE_MOCK = true;

/**
 * Pathshala Management Service
 */
export const pathshalaService = {
  getPathshalas: async (params) => {
    if (USE_MOCK) {
      console.log('Using mock data for getPathshalas');
      return Promise.resolve([...MOCK_PATHSHALAS]);
    }
    return apiService.get('v1/pathshala/', params);
  },

  getPathshala: async (id) => {
    if (USE_MOCK) {
      const pathshala = MOCK_PATHSHALAS.find(p => p.id === parseInt(id));
      return Promise.resolve(pathshala ? { ...pathshala } : null);
    }
    return apiService.get(`v1/pathshala/${id}/`);
  },

  createPathshala: async (data) => {
    if (USE_MOCK) {
      console.log('Mock: Creating pathshala', data);
      const newPathshala = { ...data, id: Date.now() };
      MOCK_PATHSHALAS.push(newPathshala);
      return Promise.resolve(newPathshala);
    }
    return apiService.post('v1/pathshala/', data);
  },

  updatePathshala: async (id, data) => {
    if (USE_MOCK) {
      console.log('Mock: Updating pathshala', id, data);
      const index = MOCK_PATHSHALAS.findIndex(p => p.id === parseInt(id));
      if (index !== -1) {
        MOCK_PATHSHALAS[index] = { ...MOCK_PATHSHALAS[index], ...data, id: parseInt(id) };
        return Promise.resolve(MOCK_PATHSHALAS[index]);
      }
      return Promise.reject(new Error('Pathshala not found'));
    }
    return apiService.put(`v1/pathshala/${id}/`, data);
  },

  deletePathshala: async (id) => {
    if (USE_MOCK) {
      console.log('Mock: Deleting pathshala', id);
      MOCK_PATHSHALAS = MOCK_PATHSHALAS.filter(p => p.id !== parseInt(id));
      return Promise.resolve({ success: true });
    }
    return apiService.delete(`v1/pathshala/${id}/`);
  },
};
