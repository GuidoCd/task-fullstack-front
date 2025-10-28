// src/api/axios.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost/api', // This is the URL of your Laravel API
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

export default apiClient;