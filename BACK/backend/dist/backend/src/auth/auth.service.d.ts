import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../services/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(email: string, name: string, password: string): Promise<{
        message: string;
    }>;
    login(email: string, password: string): Promise<{
        token: string;
    }>;
    verifyToken(token: string): any;
}
