import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// TIPOS
interface LoginResponse {
  token: string;
}

interface RegisterResponse {
  message: string;
}

export interface FileMeta {
  id: string;
  nombre: string;
  user_id: string;
  content: string;
  contentHash: string;
}

interface VerifyResponse {
  valid: boolean;
  message?: string;
}

// LOGIN
export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>('/login', { email, password });
  localStorage.setItem('token', res.data.token);
  return res.data;
};

// REGISTER
export const register = async (
  email: string,
  name: string,
  password: string
): Promise<RegisterResponse> => {
  const res = await api.post<RegisterResponse>('/register', {
    email,
    name,
    password,
  });
  return res.data;
};

// ✅ SUBIR ARCHIVO (con firma y hash opcionales)
export const uploadFile = async (
  file: File,
  signature?: string,
  hash?: string
): Promise<{ success: boolean; id: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  if (signature) formData.append('signature', signature);
  if (hash) formData.append('hash', hash);

  const res = await api.post<{ success: boolean; id: string }>('/guardar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

// OBTENER ARCHIVOS
export const getFiles = async (): Promise<FileMeta[]> => {
  const res = await api.get<FileMeta[]>('/archivos');
  return res.data;
};

// DESCARGAR ARCHIVO
export const downloadFile = async (id: string): Promise<Blob> => {
  const res = await api.get<Blob>(`/archivos/${id}/descargar`, {
    responseType: 'blob',
  });
  return res.data;
};

// VERIFICAR ARCHIVO
export const verifyFile = async (
  fileId: string,
  publicKey: string
): Promise<VerifyResponse> => {
  const res = await api.post<VerifyResponse>('/verificar', {
    fileId,
    publicKey,
  });
  return res.data;
};

// GUARDAR LLAVE PÚBLICA
export const savePublicKey = async (publicKey: string): Promise<void> => {
  await api.post('/user/publickey', { publicKey });
};

export default api;
