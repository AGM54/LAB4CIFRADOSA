import { PrismaService } from '../services/prisma.service';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    savePublicKey(email: string, publicKey: string): Promise<{
        id: number;
        name: string;
        email: string;
        password: string;
        publicKey: string;
    }>;
}
