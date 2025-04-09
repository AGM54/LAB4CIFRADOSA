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
exports.FileService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../services/prisma.service");
const crypto = require("crypto");
let FileService = class FileService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async saveFile(file, signature, hash, userId) {
        return this.prisma.file.create({
            data: {
                name: file.originalname,
                content: file.buffer,
                signature: signature ?? null,
                hash: hash ?? '',
                user: {
                    connect: { id: userId },
                },
            },
        });
    }
    async verifyFile(fileId, publicKeyPem) {
        const file = await this.prisma.file.findUnique({
            where: { id: fileId },
        });
        if (!file) {
            return { valid: false, message: 'Archivo no encontrado' };
        }
        if (!file.signature || !file.hash) {
            return {
                valid: false,
                message: 'No hay firma o hash para verificar',
            };
        }
        try {
            const verifier = crypto.createVerify('RSA-SHA256');
            verifier.update(Buffer.from(file.hash, 'utf-8'));
            verifier.end();
            const isValid = verifier.verify(publicKeyPem, Buffer.from(file.signature, 'base64'));
            return {
                valid: isValid,
                message: isValid ? 'Firma válida ✅' : 'Firma inválida ❌',
            };
        }
        catch (error) {
            console.error('Error verificando firma:', error);
            return {
                valid: false,
                message: 'Error durante la verificación de la firma',
            };
        }
    }
};
exports.FileService = FileService;
exports.FileService = FileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FileService);
//# sourceMappingURL=file.service.js.map