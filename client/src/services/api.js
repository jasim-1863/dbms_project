import axios from 'axios';

// Create an axios instance
const api = axios.create();

// Add a request interceptor to add the token to each request
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API functions for menu
export const fetchMenu = () => api.get('/api/menu');
export const fetchTodayMenu = () => api.get('/api/menu/today');
export const updateMenu = (menuData) => api.post('/api/menu', menuData);

// API functions for bookings
export const fetchUserBookings = () => api.get('/api/bookings/user');
export const fetchTodayUserBooking = () => api.get('/api/bookings/user/today');
export const createOrUpdateBooking = (bookingData) => api.post('/api/bookings', bookingData);
export const fetchTodayBookings = () => api.get('/api/bookings/today');
export const fetchTodayMealCount = () => api.get('/api/bookings/today/count');

// API functions for bills
export const fetchUserBills = () => api.get('/api/bills/my-bills');
export const fetchBillById = (id) => api.get(`/api/bills/${id}`);
export const fetchAllBills = () => api.get('/api/bills');
export const generateBill = (billData) => api.post('/api/bills/generate', billData);
export const markBillAsPaid = (id) => api.put(`/api/bills/${id}/pay`);

// API functions for users
export const fetchAllUsers = () => api.get('/api/users');
export const fetchUserProfile = () => api.get('/api/users/profile');

export default api; 