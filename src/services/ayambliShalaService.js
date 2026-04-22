import api from '../api/axios';
import { apiService } from './apiService';

// Mock Data for Ayambli Shala
let MOCK_AYAMBLISHALAS = [
  { 
    id: 1, 
    name: 'Shri Mahavir Swami Ayambli Bhavan', 
    operationalType: 'Daily (Runs 365 days)',
    sittingCapacity: 150,
    morningFrom: '10:00',
    morningTo: '13:30',
    separateSeating: true,
    wheelchairAccessible: true,
    boiledWater: true,
    waitingArea: false,
    status: 'Active',
    address: 'Near Jain Temple, Navrangpura',
    landmark: 'Behind Bank of Baroda',
    city: 'Ahmedabad',
    taluka: 'Ahmedabad',
    district: 'Ahmedabad',
    pincode: '380009',
    mapLink: 'https://goo.gl/maps/example1',
    trustName: 'Navrangpura Jain Sangh',
    sanchalakName: 'Babulal Shah',
    sanchalakPhone: '9876543210',
    maharajName: 'Magaram Maharaj',
    email: 'ayambli@navrangpura.com',
    photos: []
  },
  { 
    id: 2, 
    name: 'Aadinath Ayambli Shala', 
    operationalType: 'Only Oli (Runs only during Chaitra/Ashwin Navpad Oli)',
    sittingCapacity: 300,
    morningFrom: '09:30',
    morningTo: '14:00',
    separateSeating: true,
    wheelchairAccessible: false,
    boiledWater: true,
    waitingArea: true,
    status: 'Active',
    address: 'Adajan Road',
    landmark: 'Near Flower Market',
    city: 'Surat',
    taluka: 'Surat',
    district: 'Surat',
    pincode: '395009',
    mapLink: 'https://goo.gl/maps/example2',
    trustName: 'Surat Adajan Sangh',
    sanchalakName: 'Ramesh Jhaveri',
    sanchalakPhone: '9898000000',
    maharajName: '',
    email: 'info@suratayambli.org',
    photos: []
  }
];

// Set this to false when the backend is available
const USE_MOCK = true;

/**
 * Ayambli Shala Management Service
 */
export const ayambliShalaService = {
  getAyambliShalas: async (params) => {
    if (USE_MOCK) {
      console.log('Using mock data for getAyambliShalas');
      return Promise.resolve([...MOCK_AYAMBLISHALAS]);
    }
    return apiService.get('v1/ayamblishala/', params);
  },

  getAyambliShala: async (id) => {
    if (USE_MOCK) {
      const shala = MOCK_AYAMBLISHALAS.find(s => s.id === parseInt(id));
      return Promise.resolve(shala ? { ...shala } : null);
    }
    return apiService.get(`v1/ayamblishala/${id}/`);
  },

  createAyambliShala: async (data) => {
    if (USE_MOCK) {
      console.log('Mock: Creating Ayambli Shala', data);
      const newShala = { ...data, id: Date.now() };
      MOCK_AYAMBLISHALAS.push(newShala);
      return Promise.resolve(newShala);
    }
    return apiService.post('v1/ayamblishala/', data);
  },

  updateAyambliShala: async (id, data) => {
    if (USE_MOCK) {
      console.log('Mock: Updating Ayambli Shala', id, data);
      const index = MOCK_AYAMBLISHALAS.findIndex(s => s.id === parseInt(id));
      if (index !== -1) {
        MOCK_AYAMBLISHALAS[index] = { ...MOCK_AYAMBLISHALAS[index], ...data, id: parseInt(id) };
        return Promise.resolve(MOCK_AYAMBLISHALAS[index]);
      }
      return Promise.reject(new Error('Ayambli Shala not found'));
    }
    return apiService.put(`v1/ayamblishala/${id}/`, data);
  },

  deleteAyambliShala: async (id) => {
    if (USE_MOCK) {
      console.log('Mock: Deleting Ayambli Shala', id);
      MOCK_AYAMBLISHALAS = MOCK_AYAMBLISHALAS.filter(s => s.id !== parseInt(id));
      return Promise.resolve({ success: true });
    }
    return apiService.delete(`v1/ayamblishala/${id}/`);
  },
};
