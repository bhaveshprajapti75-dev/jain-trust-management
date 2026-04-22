import api from '../api/axios';
import { apiService } from './apiService';

// Mock Data for Meetings
let MOCK_MEETINGS = [
  { 
    id: 1, 
    title: 'Annual General Board Meeting', 
    code: 'MTG-001',
    meetingType: 'Board',
    agenda: 'Discuss annual budget and strategic planning for the next fiscal year.',
    date: '2026-05-15',
    startTime: '10:00',
    endTime: '13:00',
    duration: '3 Hours',
    status: 'Scheduled',
    priority: 'High',
    
    // Tab 2: Location
    mode: 'Hybrid',
    venueName: 'Shree Mahaveer Hall',
    address: 'Near Jain Temple, Navrangpura',
    city: 'Ahmedabad',
    district: 'Ahmedabad',
    pincode: '380009',
    mapLink: 'https://goo.gl/maps/example1',
    meetingLink: 'https://zoom.us/j/123456789',
    expectedAttendees: 50,
    venueCapacity: 100,

    // Tab 3: Contact
    organizer: 'Ramesh Shah',
    organizerPhone: '9825098250',
    organizerEmail: 'ramesh.shah@example.com',
    expectedAttendeeCount: 50,
    confirmedAttendeeCount: 45
  },
  { 
    id: 2, 
    title: 'Monthly Coordination Meet', 
    code: 'MTG-002',
    meetingType: 'Coordination',
    agenda: 'Review monthly progress of pathshalas and derasar maintenance.',
    date: '2026-04-25',
    startTime: '15:00',
    endTime: '16:00',
    duration: '1 Hour',
    status: 'Completed',
    priority: 'Medium',
    
    // Tab 2: Location
    mode: 'Online',
    venueName: '',
    address: '',
    city: 'Surat',
    district: 'Surat',
    pincode: '',
    mapLink: '',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    expectedAttendees: 10,
    venueCapacity: '',

    // Tab 3: Contact
    organizer: 'Suresh Jhaveri',
    organizerPhone: '9898098980',
    organizerEmail: 'suresh@suratjain.org',
    expectedAttendeeCount: 10,
    confirmedAttendeeCount: 10
  }
];

const USE_MOCK = true;

export const meetingService = {
  getMeetings: async (params) => {
    if (USE_MOCK) {
      console.log('Using mock data for getMeetings');
      return Promise.resolve([...MOCK_MEETINGS]);
    }
    return apiService.get('v1/meeting/', params);
  },

  getMeeting: async (id) => {
    if (USE_MOCK) {
      const meeting = MOCK_MEETINGS.find(m => m.id === parseInt(id));
      return Promise.resolve(meeting ? { ...meeting } : null);
    }
    return apiService.get(`v1/meeting/${id}/`);
  },

  createMeeting: async (data) => {
    if (USE_MOCK) {
      console.log('Mock: Creating meeting', data);
      const newMeeting = { ...data, id: Date.now() };
      MOCK_MEETINGS.push(newMeeting);
      return Promise.resolve(newMeeting);
    }
    return apiService.post('v1/meeting/', data);
  },

  updateMeeting: async (id, data) => {
    if (USE_MOCK) {
      console.log('Mock: Updating meeting', id, data);
      const index = MOCK_MEETINGS.findIndex(m => m.id === parseInt(id));
      if (index !== -1) {
        MOCK_MEETINGS[index] = { ...MOCK_MEETINGS[index], ...data, id: parseInt(id) };
        return Promise.resolve(MOCK_MEETINGS[index]);
      }
      return Promise.reject(new Error('Meeting not found'));
    }
    return apiService.put(`v1/meeting/${id}/`, data);
  },

  deleteMeeting: async (id) => {
    if (USE_MOCK) {
      console.log('Mock: Deleting meeting', id);
      MOCK_MEETINGS = MOCK_MEETINGS.filter(m => m.id !== parseInt(id));
      return Promise.resolve({ success: true });
    }
    return apiService.delete(`v1/meeting/${id}/`);
  },
};
