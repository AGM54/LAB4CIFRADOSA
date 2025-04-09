declare const api: Axios.AxiosInstance;
interface LoginResponse {
    token: string;
}
interface RegisterResponse {
    message: string;
}
interface FileMeta {
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
export declare const login: (email: string, password: string) => Promise<LoginResponse>;
export declare const register: (email: string, name: string, password: string) => Promise<RegisterResponse>;
export declare const uploadFile: (file: File, signature?: string) => Promise<{
    success: boolean;
    id: string;
}>;
export declare const getFiles: () => Promise<FileMeta[]>;
export declare const downloadFile: (id: string) => Promise<Blob>;
export declare const verifyFile: (fileId: string, publicKey: string) => Promise<VerifyResponse>;
export default api;
