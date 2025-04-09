import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: {
        email: string;
        name: string;
        password: string;
    }): Promise<{
        message: string;
    }>;
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        token: string;
    }>;
}
