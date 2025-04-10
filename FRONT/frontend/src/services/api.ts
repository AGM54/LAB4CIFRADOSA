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
  id: number;
  name: string;
  hash: string | null;
  signature: string | null;
}

interface VerifyResponse {
  valid: boolean;
  message?: string;
}

// ✅ LOGIN
export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    console.log("🔐 Intentando login...");
    const res = await api.post<LoginResponse>('/login', { email, password });
    localStorage.setItem('token', res.data.token);
    console.log("✅ Login exitoso");
    return res.data;
  } catch (error: any) {
    console.error("❌ Error en login:", error.response?.status, error.response?.data);
    throw error;
  }
};

// ✅ REGISTER
export const register = async (
  email: string,
  name: string,
  password: string
): Promise<RegisterResponse> => {
  try {
    console.log("📝 Intentando registrar usuario...");
    const res = await api.post<RegisterResponse>('/register', {
      email,
      name,
      password,
    });
    console.log("✅ Registro exitoso");
    return res.data;
  } catch (error: any) {
    console.error("❌ Error en register:", error.response?.status, error.response?.data);
    throw error;
  }
};

// ✅ SUBIR ARCHIVO (con firma y hash opcionales)
export const uploadFile = async (
  file: File,
  signature?: string,
  hash?: string
): Promise<{ success: boolean; id: string }> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    if (signature) formData.append('signature', signature);
    if (hash) formData.append('hash', hash);

    console.log("📤 Subiendo archivo a: /file/guardar");

    const res = await api.post<{ success: boolean; id: string }>(
      '/file/guardar',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );

    console.log("✅ Archivo subido correctamente:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ Error al subir archivo:", error.response?.status, error.response?.data);
    throw error;
  }
};

// ✅ OBTENER ARCHIVOS
export const getFiles = async (): Promise<FileMeta[]> => {
  try {
    console.log("📁 Solicitando archivos desde: /file/archivos");
    const res = await api.get<FileMeta[]>('/file/archivos');
    console.log("✅ Archivos recibidos:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ Error al obtener archivos:", error.response?.status, error.response?.data);
    throw error;
  }
};

// ✅ DESCARGAR ARCHIVO
export const downloadFile = async (id: number): Promise<Blob> => {
  try {
    console.log(`📥 Descargando archivo con ID: ${id}`);
    const res = await api.get<Blob>(`/file/${id}/descargar`, {
      responseType: 'blob',
    });
    return res.data;
  } catch (error: any) {
    console.error("❌ Error al descargar archivo:", error.response?.status, error.response?.data);
    throw error;
  }
};

// ✅ VERIFICAR ARCHIVO
export const verifyFile = async (
  fileId: number,
  publicKey: string
): Promise<VerifyResponse> => {
  try {
    console.log(`🔍 Verificando archivo con ID: ${fileId}`);
    const res = await api.post<VerifyResponse>('/file/verificar', {
      fileId,
      publicKey,
    });
    console.log("✅ Resultado de verificación:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ Error al verificar archivo:", error.response?.status, error.response?.data);
    throw error;
  }
};

// ✅ GUARDAR LLAVE PÚBLICA
export const savePublicKey = async (publicKey: string): Promise<void> => {
  try {
    console.log("📤 Enviando clave pública al backend...");
    await api.post('/user/publickey', { publicKey });
    console.log("✅ Clave pública guardada exitosamente.");
  } catch (error: any) {
    console.error("❌ Error al guardar la clave pública:", error.response?.status, error.response?.data);
    throw error;
  }
};

export default api;
