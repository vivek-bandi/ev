import axios from 'axios';

const DEFAULT_API_PORT = 5000;

// Determine API base URL:
// 1. If VITE_API_URL is set, use it.
// 2. During development, if not set, construct a URL using the current page hostname
//    so mobile devices hitting the dev server will call the machine IP (e.g. http://192.168.x.x:5000/api).
// 3. Fallback to localhost for other environments.
const getDefaultApiBase = () => {
  try {
    if (import.meta.env.MODE === 'development' && typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      // If the frontend is being served from a network IP (e.g. 192.168.x.x), use that host with the backend port.
      return `${window.location.protocol}//${hostname}:${DEFAULT_API_PORT}/api`;
    }
  } catch (e) {
    // ignore
  }
  return 'http://localhost:5000/api';
};

const API_BASE_URL = import.meta.env.VITE_API_URL || getDefaultApiBase();

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to admin login if unauthorized
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
};

// Vehicle API
export const vehicleAPI = {
  getAll: (params = {}) => api.get('/vehicles', { params }),
  getById: (id) => api.get(`/vehicles/${id}`),
  create: (vehicleData) => api.post('/vehicles', vehicleData),
  update: (id, vehicleData) => api.put(`/vehicles/${id}`, vehicleData),
  delete: (id) => api.delete(`/vehicles/${id}`),
  updateInventory: (id, inventoryData) => api.patch(`/vehicles/${id}/inventory`, inventoryData),
  getStats: () => api.get('/vehicles/stats/overview'),
};

// Offer API
export const offerAPI = {
  getAll: (params = {}) => api.get('/offers', { params }),
  getById: (id) => api.get(`/offers/${id}`),
  create: (offerData) => api.post('/offers', offerData),
  update: (id, offerData) => api.put(`/offers/${id}`, offerData),
  delete: (id) => api.delete(`/offers/${id}`),
  toggle: (id) => api.patch(`/offers/${id}/toggle`),
  getActiveByVehicle: (vehicleId) => api.get(`/offers/vehicle/${vehicleId}/active`),
  getStats: () => api.get('/offers/stats/overview'),
};

// Customer API
export const customerAPI = {
  getAll: (params = {}) => api.get('/customers', { params }),
  getById: (id) => api.get(`/customers/${id}`),
  create: (customerData) => api.post('/customers', customerData),
  update: (id, customerData) => api.put(`/customers/${id}`, customerData),
  delete: (id) => api.delete(`/customers/${id}`),
  addPurchase: (id, purchaseData) => api.post(`/customers/${id}/purchases`, purchaseData),
  scheduleTestDrive: (id, testDriveData) => api.post(`/customers/${id}/test-drives`, testDriveData),
  updateTestDriveStatus: (id, testDriveId, status) => api.patch(`/customers/${id}/test-drives/${testDriveId}`, { status }),
  getStats: () => api.get('/customers/stats/overview'),
};

// Inquiry API
export const inquiryAPI = {
  getAll: (params = {}) => api.get('/inquiries', { params }),
  getById: (id) => api.get(`/inquiries/${id}`),
  create: (inquiryData) => api.post('/inquiries', inquiryData),
  update: (id, inquiryData) => api.put(`/inquiries/${id}`, inquiryData),
  addResponse: (id, responseData) => api.post(`/inquiries/${id}/responses`, responseData),
  assign: (id, assignedTo) => api.patch(`/inquiries/${id}/assign`, { assignedTo }),
  getStats: () => api.get('/inquiries/stats/overview'),
};

// Analytics API
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getSales: (params = {}) => api.get('/analytics/sales', { params }),
  getInventory: () => api.get('/analytics/inventory'),
  getCustomers: () => api.get('/analytics/customers'),
};

// Achievement API
export const achievementAPI = {
  getAll: (params = {}) => api.get('/achievements', { params }),
  getById: (id) => api.get(`/achievements/${id}`),
  create: (achievementData) => api.post('/achievements', achievementData),
  update: (id, achievementData) => api.put(`/achievements/${id}`, achievementData),
  delete: (id) => api.delete(`/achievements/${id}`),
  getFeatured: () => api.get('/achievements', { params: { featured: true } }),
  getByCategory: (category) => api.get('/achievements', { params: { category } }),
};

export default api;
