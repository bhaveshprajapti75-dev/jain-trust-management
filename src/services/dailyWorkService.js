import api from '../api/axios';
import { apiService } from './apiService';

// Mock Data for Daily Work
let MOCK_DAILY_WORK = [
  {
    id: 1,
    memberId: 1,
    memberName: 'Ramesh Shah',
    date: '20/04/2026',
    project: 'Derasar Maintenance',
    hours: 4.5,
    status: 'Completed',
    description: 'Cleaned the main hall and updated the inventory.'
  },
  {
    id: 2,
    memberId: 2,
    memberName: 'Suresh Jain',
    date: '20/04/2026',
    project: 'Pathshala Management',
    hours: 2.0,
    status: 'In Progress',
    description: 'Preparing student list for the upcoming exams.'
  },
  {
    id: 3,
    memberId: 3,
    memberName: 'Chetan Jhaveri',
    date: '19/04/2026',
    project: 'Trust Accounts',
    hours: 6.0,
    status: 'Pending',
    description: 'Verifying donation receipts from the last month.'
  }
];

const USE_MOCK = true;

export const dailyWorkService = {
  getDailyWorkItems: async (params) => {
    if (USE_MOCK) {
      console.log('Using mock data for getDailyWorkItems');
      return Promise.resolve([...MOCK_DAILY_WORK]);
    }
    return apiService.get('v1/daily-work/', params);
  },

  getDailyWork: async (id) => {
    if (USE_MOCK) {
      const item = MOCK_DAILY_WORK.find(a => a.id === parseInt(id));
      return Promise.resolve(item ? { ...item } : null);
    }
    return apiService.get(`v1/daily-work/${id}/`);
  },

  createDailyWork: async (data) => {
    if (USE_MOCK) {
      console.log('Mock: Creating daily work', data);
      const newWork = { ...data, id: Date.now() };
      MOCK_DAILY_WORK.push(newWork);
      return Promise.resolve(newWork);
    }
    return apiService.post('v1/daily-work/', data);
  },

  updateDailyWork: async (id, data) => {
    if (USE_MOCK) {
      console.log('Mock: Updating daily work', id, data);
      const index = MOCK_DAILY_WORK.findIndex(a => a.id === parseInt(id));
      if (index !== -1) {
        MOCK_DAILY_WORK[index] = { ...MOCK_DAILY_WORK[index], ...data, id: parseInt(id) };
        return Promise.resolve(MOCK_DAILY_WORK[index]);
      }
      return Promise.reject(new Error('Daily work record not found'));
    }
    return apiService.put(`v1/daily-work/${id}/`, data);
  },

  deleteDailyWork: async (id) => {
    if (USE_MOCK) {
      console.log('Mock: Deleting daily work', id);
      MOCK_DAILY_WORK = MOCK_DAILY_WORK.filter(a => a.id !== parseInt(id));
      return Promise.resolve({ success: true });
    }
    return apiService.delete(`v1/daily-work/${id}/`);
  },
};
