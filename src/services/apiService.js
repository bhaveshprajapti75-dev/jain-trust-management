import api from '../api/axios';
import { ROLES } from '../config/roles';

export const apiService = {
  // Generic GET request
  get: async (url, params = {}) => {
    try {
      const response = await api.get(url, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Generic POST request
  post: async (url, data = {}) => {
    try {
      const response = await api.post(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Generic PUT request
  put: async (url, data = {}) => {
    try {
      const response = await api.put(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Generic DELETE request
  delete: async (url) => {
    try {
      const response = await api.delete(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Authentication Service
export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('v1/auth/login/', credentials);
      const data = response.data;

      const token = data.tokens?.access || data.access || data.token;
      
      if (!token) {
        throw new Error('No authentication token in response');
      }

      const role = data.user?.role || data.user_role || data.role || '';
      
      const userName = data.user?.full_name || data.user?.name || data.user_name || 'User';
      const userId = data.user?.id || data.user_id || '';

      const normalizedRole = role.toLowerCase()
        .split('_')
        .map((word, idx) => idx === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
        .join('');

      if (!Object.values(ROLES).includes(normalizedRole)) {
        throw new Error(`Invalid role: ${role}`);
      }

      sessionStorage.setItem('token', token);
      sessionStorage.setItem('userRole', normalizedRole);
      sessionStorage.setItem('userName', userName);
      sessionStorage.setItem('userId', userId);
      
      if (data.user?.scope_id) {
        sessionStorage.setItem('scopeId', data.user.scope_id);
      }
      if (data.user?.scope_type) {
        sessionStorage.setItem('scopeType', data.user.scope_type);
      }

      return { 
        ...data, 
        normalizedRole,
        token,
        role: normalizedRole 
      };
    } catch (error) {
      console.error('Auth login error:', error.response?.data || error.message);
      throw error;
    }
  },
  getProfile: () => apiService.get('v1/accounts/users/me/'),
};

// User Management Service
export const userService = {
  getUsers: () => apiService.get('v1/accounts/users/'),
  getUser: (id) => apiService.get(`v1/accounts/users/${id}/`),
  createUser: (data) => apiService.post('v1/accounts/users/', data),
  updateUser: (id, data) => apiService.put(`v1/accounts/users/${id}/`, data),
  deleteUser: (id) => apiService.delete(`v1/accounts/users/${id}/`),
  getActivities: () => apiService.get('v1/activities/'),
  getDocuments: () => apiService.get('v1/documents/'),
};

// Organization Management Service
export const orgService = {
  getTrusts: () => apiService.get('v1/org/trusts/'),
  getSanghs: () => apiService.get('v1/org/sanghs/'),
  getDepartments: () => apiService.get('v1/org/departments/'),
};

// Location Management Service
export const locationService = {
  getLocations: () => apiService.get('v1/locations/'),
  getLocation: (id) => apiService.get(`v1/locations/${id}/`),
  createLocation: (data) => apiService.post('v1/locations/', data),
  updateLocation: (id, data) => apiService.put(`v1/locations/${id}/`, data),
  deleteLocation: (id) => apiService.delete(`v1/locations/${id}/`),
  batchUpdate: (data) => apiService.post('v1/locations/batch/', data),
};

// Sangh Administration Service
export const sanghService = {
  getDetails: (id) => apiService.get(`v1/sangh/${id}/`),
  updateDetails: (id, data) => apiService.put(`v1/sangh/${id}/`, data),
  getLinkedTrusts: (id) => apiService.get(`v1/sangh/${id}/trusts/`),
  getCommitteeMembers: (sanghId) => apiService.get(`v1/sangh/contact/`, { sangh: sanghId }),
  updateTrust: (id, data) => apiService.put(`v1/trusts/${id}/`, data),
  removeTrust: (id) => apiService.delete(`v1/trusts/${id}/`),
};

