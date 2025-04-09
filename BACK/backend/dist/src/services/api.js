"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyFile = exports.downloadFile = exports.getFiles = exports.uploadFile = exports.register = exports.login = void 0;
const axios_1 = require("axios");
const api = axios_1.default.create({
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
const login = async (email, password) => {
    const res = await api.post('/login', { email, password });
    localStorage.setItem('token', res.data.token);
    return res.data;
};
exports.login = login;
const register = async (email, name, password) => {
    const res = await api.post('/register', {
        email,
        name,
        password,
    });
    return res.data;
};
exports.register = register;
const uploadFile = async (file, signature) => {
    const formData = new FormData();
    formData.append('file', file);
    if (signature)
        formData.append('signature', signature);
    const res = await api.post('/guardar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
};
exports.uploadFile = uploadFile;
const getFiles = async () => {
    const res = await api.get('/archivos');
    return res.data;
};
exports.getFiles = getFiles;
const downloadFile = async (id) => {
    const res = await api.get(`/archivos/${id}/descargar`, {
        responseType: 'blob',
    });
    return res.data;
};
exports.downloadFile = downloadFile;
const verifyFile = async (fileId, publicKey) => {
    const res = await api.post('/verificar', {
        fileId,
        publicKey,
    });
    return res.data;
};
exports.verifyFile = verifyFile;
exports.default = api;
//# sourceMappingURL=api.js.map