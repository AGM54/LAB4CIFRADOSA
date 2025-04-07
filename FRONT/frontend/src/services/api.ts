// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => Promise.reject(error));

export const login = async (email: string, password: string) => {
    const res = await api.post<{ token: string }>('/login', { email, password });
    localStorage.setItem('token', res.data.token);
    
  return res.data;
};

export const register = async (email: string, name: string, password: string) => {
  const res = await api.post('/register', { email, name, password });
  return res.data;
};

export const uploadFile = async (file: File, signature?: string) => {
  const formData = new FormData();
  formData.append('file', file);
  if (signature) formData.append('signature', signature);
  const res = await api.post('/guardar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const getFiles = async () => {
  const res = await api.get('/archivos');
  return res.data;
};

export const downloadFile = async (id: string) => {
  const res = await api.get(`/archivos/${id}/descargar`, { responseType: 'blob' });
  return res.data;
};

export const verifyFile = async (fileId: string, publicKey: string) => {
  const res = await api.post('/verificar', { fileId, publicKey });
  return res.data;
};

export default api;
