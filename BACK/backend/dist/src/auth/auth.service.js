"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../services/prisma.service");
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(email, name, password) {
        const existing = await this.prisma.user.findUnique({ where: { email } });
        if (existing) {
            throw new Error('Ya existe un usuario con este correo');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await this.prisma.user.create({
            data: { email, name, password: hashedPassword, publicKey: "" },
        });
        return { message: 'Usuario registrado exitosamente' };
    }
    async login(email, password) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        const token = this.jwtService.sign({
            id: user.id,
            email: user.email,
        });
        return { token };
    }
    verifyToken(token) {
        try {
            return this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET,
            });
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Token inválido o expirado');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map