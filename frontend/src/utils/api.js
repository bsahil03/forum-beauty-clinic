import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://your-backend-domain.com/api' 
    : 'http://localhost:5000/api',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers['x-auth-token'] = token;
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    // Log to localStorage
    const logs = JSON.parse(localStorage.getItem('errorLogs') || '[]');
    logs.push({ timestamp: new Date(), message: error.message });
    localStorage.setItem('errorLogs', JSON.stringify(logs));
    return Promise.reject(error);
  }
);

export default api;