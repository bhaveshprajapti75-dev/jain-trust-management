import api from '../api/axios';
import { apiService } from './apiService';

// Mock Data for Attendance
let MOCK_ATTENDANCE = [
  {
    id: 1,
    memberId: 1,
    memberName: 'Ramesh Shah',
    date: '20/04/2026',
    checkInTime: '09:00',
    checkOutTime: '18:00',
    status: 'Present'
  },
  {
    id: 2,
    memberId: 2,
    memberName: 'Suresh Jain',
    date: '20/04/2026',
    checkInTime: '09:15',
    checkOutTime: '18:05',
    status: 'Late'
  },
  {
    id: 3,
    memberId: 3,
    memberName: 'Chetan Jhaveri',
    date: '20/04/2026',
    checkInTime: '',
    checkOutTime: '',
    status: 'Absent'
  },
  {
    id: 4,
    memberId: 4,
    memberName: 'Dinesh Doshi',
    date: '20/04/2026',
    checkInTime: '09:30',
    checkOutTime: '14:00',
    status: 'Half-day'
  },
  {
    id: 5,
    memberId: 5,
    memberName: 'Ela Parikh',
    date: '20/04/2026',
    checkInTime: '',
    checkOutTime: '',
    status: 'Leave'
  }
];

const USE_MOCK = true;

export const attendanceService = {
  getAttendanceItems: async (params) => {
    if (USE_MOCK) {
      console.log('Using mock data for getAttendanceItems');
      return Promise.resolve([...MOCK_ATTENDANCE]);
    }
    return apiService.get('v1/attendance/', params);
  },

  getAttendance: async (id) => {
    if (USE_MOCK) {
      const item = MOCK_ATTENDANCE.find(a => a.id === parseInt(id));
      return Promise.resolve(item ? { ...item } : null);
    }
    return apiService.get(`v1/attendance/${id}/`);
  },

  createAttendance: async (data) => {
    if (USE_MOCK) {
      console.log('Mock: Creating attendance', data);
      const newAttendance = { ...data, id: Date.now() };
      MOCK_ATTENDANCE.push(newAttendance);
      return Promise.resolve(newAttendance);
    }
    return apiService.post('v1/attendance/', data);
  },

  updateAttendance: async (id, data) => {
    if (USE_MOCK) {
      console.log('Mock: Updating attendance', id, data);
      const index = MOCK_ATTENDANCE.findIndex(a => a.id === parseInt(id));
      if (index !== -1) {
        MOCK_ATTENDANCE[index] = { ...MOCK_ATTENDANCE[index], ...data, id: parseInt(id) };
        return Promise.resolve(MOCK_ATTENDANCE[index]);
      }
      return Promise.reject(new Error('Attendance record not found'));
    }
    return apiService.put(`v1/attendance/${id}/`, data);
  },

  deleteAttendance: async (id) => {
    if (USE_MOCK) {
      console.log('Mock: Deleting attendance', id);
      MOCK_ATTENDANCE = MOCK_ATTENDANCE.filter(a => a.id !== parseInt(id));
      return Promise.resolve({ success: true });
    }
    return apiService.delete(`v1/attendance/${id}/`);
  },
};
