import { PrismaService } from '../services/prisma.service';
export declare class FileService {
    private prisma;
    constructor(prisma: PrismaService);
    saveFile(file: Express.Multer.File, signature: string | undefined, hash: string | undefined, userId: number): Promise<{
        id: number;
        name: string;
        content: Uint8Array;
        hash: string | null;
        signature: string | null;
        userId: number;
    }>;
    verifyFile(fileId: number, publicKeyPem: string): Promise<{
        valid: any;
        message: string;
    }>;
    private detectKeyType;
    listFiles(userId: number): Promise<{
        id: number;
        name: string;
        hash: string | null;
        signature: string | null;
    }[]>;
    getFileById(id: number): Promise<{
        id: number;
        name: string;
        content: Uint8Array;
        hash: string | null;
        signature: string | null;
        userId: number;
    }>;
}
