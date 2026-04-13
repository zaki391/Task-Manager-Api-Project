import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.MODE === 'production' ? '' : 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
