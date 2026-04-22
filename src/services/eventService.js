import api from '../api/axios';
import { apiService } from './apiService';

// Mock Data for Events
let MOCK_EVENTS = [
  {
    id: 1,
    eventName: 'Paryushan Mahaparva 2024',
    eventCode: 'EV-2024-001',
    eventType: 'Parv',
    description: 'Annual Paryushan festival celebration with spiritual discourses and pratikraman.',
    startDate: '2024-08-31',
    endDate: '2024-09-07',
    startTime: '06:00',
    endTime: '20:00',
    expectedAttendees: 500,
    confirmedAttendees: 450,
    isFree: true,
    ticketPrice: 0,
    maxParticipants: 1000,
    eventStatus: 'Upcoming',
    eventImage: null,
    createdBy: 'Sangh Admin',
    createdAt: '2024-04-01T10:00:00Z',
    isPublished: true,
    // Location & Venue
    venueAddress: 'Paldi Jain Sangh, Opp. Sanskar Kendra',
    landmark: 'Paldi',
    city: 'Ahmedabad',
    district: 'Ahmedabad',
    pincode: '380007',
    googleMapsLink: 'https://maps.app.goo.gl/example1',
    latitude: '23.0120',
    longitude: '72.5645',
    venueName: 'Main Hall',
    venueCapacity: 1200,
    parkingAvailable: true,
    disabledAccessAvailable: true,
    // Organizer & Contact
    sanghId: 1, // Paldi Jain Sangh
    derasarId: 1, // Optional
    organizerName: 'Ramesh Shah',
    organizerPhone: '9876543210',
    organizerEmail: 'ramesh@example.com',
    registrationPhone: '9876543210',
    secondaryContactName: 'Mahesh Jain',
    secondaryContactPhone: '9876543211',
    speakerName: 'Pujya Gurudev',
    speakerContact: '9876543212',
    websiteLink: 'https://paldijainsangh.com/paryushan',
    // Additional Info
    parkingArrangement: 'Available at basement and adjacent plot',
    foodPrasad: 'Bhojanshala lunch and dinner',
    accommodation: 'Available for outstation guests',
    transportation: 'Shuttle from main circle',
    medicalFacilities: 'First aid kit and ambulance on call',
    security: 'CCTV and Private guards',
    eventBrochure: null,
    galleryPhotos: [],
    announcements: 'Please bring your own Pratikraman set.',
    updatedAt: '2024-04-15T12:00:00Z'
  },
  {
    id: 2,
    eventName: 'Mahaveer Janma Kalyanak',
    eventCode: 'EV-2024-002',
    eventType: 'Utsav',
    description: 'Grand celebration of Mahaveer Janma Kalyanak with Shobha Yatra.',
    startDate: '2024-04-21',
    endDate: '2024-04-21',
    startTime: '08:00',
    endTime: '14:00',
    expectedAttendees: 2000,
    confirmedAttendees: 1800,
    isFree: true,
    ticketPrice: 0,
    maxParticipants: 5000,
    eventStatus: 'Completed',
    eventImage: null,
    createdBy: 'Sangh Admin',
    createdAt: '2024-01-10T09:00:00Z',
    isPublished: true,
    // Location & Venue
    venueAddress: 'Surat Town Hall',
    landmark: 'Nanpura',
    city: 'Surat',
    district: 'Surat',
    pincode: '395001',
    googleMapsLink: 'https://maps.app.goo.gl/example2',
    latitude: '21.1702',
    longitude: '72.8311',
    venueName: 'Town Hall',
    venueCapacity: 3000,
    parkingAvailable: true,
    disabledAccessAvailable: true,
    // Organizer & Contact
    sanghId: 2,
    derasarId: null,
    organizerName: 'Suresh Jain',
    organizerPhone: '9825012345',
    organizerEmail: 'suresh@suratjain.org',
    registrationPhone: '9825012345',
    secondaryContactName: 'Pravin Shah',
    secondaryContactPhone: '9825067890',
    speakerName: 'Dr. Jitendra Shah',
    speakerContact: '9825011111',
    websiteLink: 'https://suratjainsangh.org/mahaveer-kalyanak',
    // Additional Info
    parkingArrangement: 'Public parking nearby',
    foodPrasad: 'Sweet prasad for all',
    accommodation: 'N/A',
    transportation: 'Special buses organized',
    medicalFacilities: 'Mobile clinic',
    security: 'Police and volunteers',
    eventBrochure: null,
    galleryPhotos: [],
    announcements: 'Shobha Yatra starts at 8 AM sharp.',
    updatedAt: '2024-04-22T10:00:00Z'
  }
];

let MOCK_CATEGORIES = [
  { id: 1, categoryName: 'Parv', description: 'Religious festivals and parv days', isPublished: true, createdAt: '2024-04-01T10:00:00Z' },
  { id: 2, categoryName: 'Utsav', description: 'Social and cultural celebrations', isPublished: true, createdAt: '2024-04-01T10:00:00Z' },
  { id: 3, categoryName: 'Lecture', description: 'Spiritual discourses and lectures', isPublished: true, createdAt: '2024-04-01T10:00:00Z' },
  { id: 4, categoryName: 'Yatra', description: 'Pilgrimage and yatras', isPublished: true, createdAt: '2024-04-01T10:00:00Z' }
];

const USE_MOCK = true;

export const eventService = {
  // Events
  getEvents: async (params) => {
    if (USE_MOCK) {
      return Promise.resolve([...MOCK_EVENTS]);
    }
    return apiService.get('v1/events/', params);
  },

  getEvent: async (id) => {
    if (USE_MOCK) {
      const event = MOCK_EVENTS.find(e => e.id === parseInt(id));
      return Promise.resolve(event ? { ...event } : null);
    }
    return apiService.get(`v1/events/${id}/`);
  },

  createEvent: async (data) => {
    if (USE_MOCK) {
      const newEvent = { 
        ...data, 
        id: Date.now(),
        eventCode: `EV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      MOCK_EVENTS.unshift(newEvent);
      return Promise.resolve(newEvent);
    }
    return apiService.post('v1/events/', data);
  },

  updateEvent: async (id, data) => {
    if (USE_MOCK) {
      const index = MOCK_EVENTS.findIndex(e => e.id === parseInt(id));
      if (index !== -1) {
        MOCK_EVENTS[index] = { 
          ...MOCK_EVENTS[index], 
          ...data, 
          id: parseInt(id),
          updatedAt: new Date().toISOString()
        };
        return Promise.resolve(MOCK_EVENTS[index]);
      }
      return Promise.reject(new Error('Event not found'));
    }
    return apiService.put(`v1/events/${id}/`, data);
  },

  deleteEvent: async (id) => {
    if (USE_MOCK) {
      MOCK_EVENTS = MOCK_EVENTS.filter(e => e.id !== parseInt(id));
      return Promise.resolve({ success: true });
    }
    return apiService.delete(`v1/events/${id}/`);
  },

  // Categories
  getCategories: async (params) => {
    if (USE_MOCK) {
      return Promise.resolve([...MOCK_CATEGORIES]);
    }
    return apiService.get('v1/event-categories/', params);
  },

  createCategory: async (data) => {
    if (USE_MOCK) {
      const newCat = { ...data, id: Date.now(), createdAt: new Date().toISOString() };
      MOCK_CATEGORIES.unshift(newCat);
      return Promise.resolve(newCat);
    }
    return apiService.post('v1/event-categories/', data);
  },

  updateCategory: async (id, data) => {
    if (USE_MOCK) {
      const index = MOCK_CATEGORIES.findIndex(c => c.id === parseInt(id));
      if (index !== -1) {
        MOCK_CATEGORIES[index] = { ...MOCK_CATEGORIES[index], ...data, id: parseInt(id) };
        return Promise.resolve(MOCK_CATEGORIES[index]);
      }
      return Promise.reject(new Error('Category not found'));
    }
    return apiService.put(`v1/event-categories/${id}/`, data);
  },

  deleteCategory: async (id) => {
    if (USE_MOCK) {
      MOCK_CATEGORIES = MOCK_CATEGORIES.filter(c => c.id !== parseInt(id));
      return Promise.resolve({ success: true });
    }
    return apiService.delete(`v1/event-categories/${id}/`);
  }
};
