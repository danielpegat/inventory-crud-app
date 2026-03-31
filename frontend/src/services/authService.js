/**
 * Auth Service
 * API calls for authentication: login, register, profile.
 */
import api from './api';

const authService = {
  /** Authenticate user with email and password */
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },

  /** Register a new user (admin operation) */
  register: async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    return data;
  },

  /** Get the current user's profile */
  getProfile: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },

  /** Refresh the access token */
  refreshToken: async (refreshToken) => {
    const { data } = await api.post('/auth/refresh', { refreshToken });
    return data;
  },
};

export default authService;
