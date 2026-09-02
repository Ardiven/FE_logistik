import axios from 'axios';

const API = axios.create({
  baseURL: 'https://tps.petra.ac.id/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (data) => API.post('/auth/login', data);

export const getGroups = () => API.get('/groups');
export const submitRequest = (data) => API.post('/requests', data);
export const getLogisticsMatrix = () => API.get(`/logistics/matrix?_t=${Date.now()}`);
export const assignRoom = (id, data) => API.patch(`/logistics/requests/${id}/assign`, data);
export const rejectRoom = (id) => API.patch(`/logistics/requests/${id}/reject`);
export const processRoom = (id) => API.patch(`/logistics/requests/${id}/process`);
