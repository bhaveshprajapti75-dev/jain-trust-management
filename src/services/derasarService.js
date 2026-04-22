import api from '../api/axios';
import { apiService } from './apiService';

// Mock Data for Derasar
let MOCK_DERASARS = [
  { 
    id: 1, 
    name: 'Shree Chandraprabhu Derasar', 
    type: 'Shwetambar', 
    moolNayak: 'Chandraprabhu Bhagwan', 
    city: 'Ahmedabad', 
    district: 'Ahmedabad', 
    pratimas: 12, 
    poojaris: 3, 
    status: 'Active', 
    established: '1960', 
    trusteeName: 'Ramesh Shah', 
    trusteePhone: '9876543210',
    address: 'Paldi, Ahmedabad',
    landmark: 'Near Sanskar Kendra',
    taluka: 'Ahmedabad',
    pincode: '380007',
    registrationNumber: 'REG-12345',
    pujariName: 'Lalitbhai',
    pujariPhone: '9898989898',
    trustName: 'Paldi Jain Trust',
    email: 'contact@paldi-derasar.com',
    mapLink: 'https://goo.gl/maps/example1',
    pratimaType: 'Marble (આરસ)',
    morningFrom: '06:00',
    morningTo: '12:00',
    eveningFrom: '16:00',
    eveningTo: '20:00',
    dharamshala: true,
    bhojanshala: true,
    parking: true,
    upashray: true,
    disabled: false,
    photos: []
  },
  { 
    id: 2, 
    name: 'Shree Mahaveer Derasar', 
    type: 'Digambar', 
    moolNayak: 'Mahaveer Bhagwan', 
    city: 'Surat', 
    district: 'Surat', 
    pratimas: 8, 
    poojaris: 2, 
    status: 'Inactive', 
    established: '1975', 
    trusteeName: 'Suresh Jain', 
    trusteePhone: '9876543211',
    address: 'Adajan, Surat',
    landmark: 'Opposite Star Bazar',
    taluka: 'Surat',
    pincode: '395009',
    registrationNumber: 'REG-67890',
    pujariName: 'Maganlal',
    pujariPhone: '9797979797',
    trustName: 'Surat Jain Sangh',
    email: 'info@surat-derasar.org',
    mapLink: 'https://goo.gl/maps/example2',
    pratimaType: 'Panchdhatu',
    morningFrom: '06:00',
    morningTo: '12:00',
    eveningFrom: '17:00',
    eveningTo: '21:00',
    dharamshala: false,
    bhojanshala: true,
    parking: false,
    upashray: true,
    disabled: true,
    photos: []
  },
  { 
    id: 3, 
    name: 'Shree Adinath Derasar', 
    type: 'Shwetambar', 
    moolNayak: 'Adinath Bhagwan', 
    city: 'Ahmedabad', 
    district: 'Ahmedabad', 
    pratimas: 15, 
    poojaris: 4, 
    status: 'Active', 
    established: '1982', 
    trusteeName: 'Mahesh Shah', 
    trusteePhone: '9876543212',
    address: 'Navrangpura, Ahmedabad',
    landmark: 'Behind LD College',
    taluka: 'Ahmedabad',
    pincode: '380009',
    registrationNumber: 'REG-11223',
    pujariName: 'Bachubhai',
    pujariPhone: '9696969696',
    trustName: 'Navrangpura Trust',
    email: 'navrang@derasar.com',
    mapLink: 'https://goo.gl/maps/example3',
    pratimaType: 'Stone (પથ્થર)',
    morningFrom: '05:30',
    morningTo: '12:30',
    eveningFrom: '16:30',
    eveningTo: '20:30',
    dharamshala: true,
    bhojanshala: false,
    parking: true,
    upashray: false,
    disabled: false,
    photos: []
  },
];

// Set this to false when the backend is available
const USE_MOCK = true;

/**
 * Derasar Management Service
 * 
 * To switch to the real backend, set USE_MOCK to false.
 */
export const derasarService = {
  getDerasars: async (params) => {
    if (USE_MOCK) {
      console.log('Using mock data for getDerasars');
      return Promise.resolve([...MOCK_DERASARS]);
    }
    return apiService.get('v1/derasar/', params);
  },

  getDerasar: async (id) => {
    if (USE_MOCK) {
      const derasar = MOCK_DERASARS.find(d => d.id === parseInt(id));
      return Promise.resolve(derasar ? { ...derasar } : null);
    }
    return apiService.get(`v1/derasar/${id}/`);
  },

  createDerasar: async (data) => {
    if (USE_MOCK) {
      console.log('Mock: Creating derasar', data);
      const newDerasar = { ...data, id: Date.now() };
      MOCK_DERASARS.push(newDerasar);
      return Promise.resolve(newDerasar);
    }
    return apiService.post('v1/derasar/', data);
  },

  updateDerasar: async (id, data) => {
    if (USE_MOCK) {
      console.log('Mock: Updating derasar', id, data);
      const index = MOCK_DERASARS.findIndex(d => d.id === parseInt(id));
      if (index !== -1) {
        MOCK_DERASARS[index] = { ...MOCK_DERASARS[index], ...data, id: parseInt(id) };
        return Promise.resolve(MOCK_DERASARS[index]);
      }
      return Promise.reject(new Error('Derasar not found'));
    }
    return apiService.put(`v1/derasar/${id}/`, data);
  },

  deleteDerasar: async (id) => {
    if (USE_MOCK) {
      console.log('Mock: Deleting derasar', id);
      MOCK_DERASARS = MOCK_DERASARS.filter(d => d.id !== parseInt(id));
      return Promise.resolve({ success: true });
    }
    return apiService.delete(`v1/derasar/${id}/`);
  },
};
