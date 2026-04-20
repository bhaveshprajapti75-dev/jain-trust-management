import api from '../api/axios';
import { apiService } from './apiService';

// Mock Data for Upashray
let MOCK_UPASHRAYS = [
  { 
    id: 1, 
    name: 'Shri Shantinath Upashray', 
    allocationType: 'Both (Separate Sections)',
    hallCapacity: 500,
    numberOfRooms: 10,
    gyanBhandar: true,
    separateWashrooms: true,
    woodenPlanks: true,
    audioSystem: true,
    status: 'Active',
    address: 'Main Bazaar, Near Jain Temple',
    landmark: 'Opposite City Center',
    city: 'Ahmedabad',
    taluka: 'Ahmedabad',
    district: 'Ahmedabad',
    pincode: '380001',
    mapLink: 'https://goo.gl/maps/example1',
    trustName: 'Maninagar Jain Sangh',
    trusteeName: 'Kantilal Shah',
    trusteePhone: '9876543210',
    caretakerName: 'Ramanbhai Patel',
    caretakerPhone: '9825098250',
    email: 'contact@shantinathupashray.org',
    photos: []
  },
  { 
    id: 2, 
    name: 'Kasturba Sadhvi Upashray', 
    allocationType: 'Only for Sadhvis (Female Ascetics)',
    hallCapacity: 200,
    numberOfRooms: 5,
    gyanBhandar: false,
    separateWashrooms: true,
    woodenPlanks: true,
    audioSystem: false,
    status: 'Under Renovation',
    address: 'Adajan Road',
    landmark: 'Near Tapi River',
    city: 'Surat',
    taluka: 'Surat',
    district: 'Surat',
    pincode: '395009',
    mapLink: 'https://goo.gl/maps/example2',
    trustName: 'Surat Adajan Sangh',
    trusteeName: 'Suresh Jhaveri',
    trusteePhone: '9898000000',
    caretakerName: 'Bhavik Desai',
    caretakerPhone: '9900112233',
    email: 'info@sadhviupashray.org',
    photos: []
  }
];

// Set this to false when the backend is available
const USE_MOCK = true;

/**
 * Upashray Management Service
 */
export const upashrayService = {
  getUpashrays: async (params) => {
    if (USE_MOCK) {
      console.log('Using mock data for getUpashrays');
      return Promise.resolve([...MOCK_UPASHRAYS]);
    }
    return apiService.get('v1/upashray/', params);
  },

  getUpashray: async (id) => {
    if (USE_MOCK) {
      const shala = MOCK_UPASHRAYS.find(s => s.id === parseInt(id));
      return Promise.resolve(shala ? { ...shala } : null);
    }
    return apiService.get(`v1/upashray/${id}/`);
  },

  createUpashray: async (data) => {
    if (USE_MOCK) {
      console.log('Mock: Creating Upashray', data);
      const newShala = { ...data, id: Date.now() };
      MOCK_UPASHRAYS.push(newShala);
      return Promise.resolve(newShala);
    }
    return apiService.post('v1/upashray/', data);
  },

  updateUpashray: async (id, data) => {
    if (USE_MOCK) {
      console.log('Mock: Updating Upashray', id, data);
      const index = MOCK_UPASHRAYS.findIndex(s => s.id === parseInt(id));
      if (index !== -1) {
        MOCK_UPASHRAYS[index] = { ...MOCK_UPASHRAYS[index], ...data, id: parseInt(id) };
        return Promise.resolve(MOCK_UPASHRAYS[index]);
      }
      return Promise.reject(new Error('Upashray not found'));
    }
    return apiService.put(`v1/upashray/${id}/`, data);
  },

  deleteUpashray: async (id) => {
    if (USE_MOCK) {
      console.log('Mock: Deleting Upashray', id);
      MOCK_UPASHRAYS = MOCK_UPASHRAYS.filter(s => s.id !== parseInt(id));
      return Promise.resolve({ success: true });
    }
    return apiService.delete(`v1/upashray/${id}/`);
  },
};
