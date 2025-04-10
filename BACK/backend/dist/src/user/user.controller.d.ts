import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    savePublicKey(req: any, publicKey: string): Promise<{
        id: number;
        email: string;
        name: string;
        password: string;
        publicKey: string;
    }>;
}
