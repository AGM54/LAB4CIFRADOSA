import { PrismaService } from '../services/prisma.service';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    savePublicKey(email: string, publicKey: string): Promise<{
        id: number;
        email: string;
        name: string;
        password: string;
        publicKey: string;
    }>;
}
