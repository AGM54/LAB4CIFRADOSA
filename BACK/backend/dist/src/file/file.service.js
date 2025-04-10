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
const asn1 = require("asn1.js");
const elliptic_1 = require("elliptic");
const ec = new elliptic_1.ec('p256');
const EcdsaDerSig = asn1.define('EcdsaDerSig', function () {
    this.seq().obj(this.key('r').int(), this.key('s').int());
});
function base64urlToHex(b64url) {
    const base64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
    const buffer = Buffer.from(base64, 'base64');
    return buffer.toString('hex');
}
let FileService = class FileService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async saveFile(file, signature, hash, userId) {
        console.log("📥 [GUARDAR] Nombre del archivo:", file.originalname);
        console.log("🧾 Tamaño:", file.size, "bytes");
        console.log("🔐 Firma recibida (base64):", signature?.slice(0, 100));
        console.log("📌 Hash SHA-256:", hash);
        console.log("👤 ID de usuario:", userId);
        return this.prisma.file.create({
            data: {
                name: file.originalname,
                content: file.buffer,
                signature: signature ?? null,
                hash: hash ?? '',
                user: { connect: { id: userId } },
            },
        });
    }
    async verifyFile(fileId, publicKeyPem) {
        console.log(`🔎 [VERIFICAR] Archivo ID: ${fileId}`);
        const file = await this.prisma.file.findUnique({ where: { id: fileId } });
        if (!file) {
            console.log("❌ Archivo no encontrado.");
            return { valid: false, message: 'Archivo no encontrado' };
        }
        if (!file.signature || !file.hash) {
            console.log("❌ Falta firma o hash para verificar.");
            return { valid: false, message: 'Faltan firma o hash' };
        }
        const keyType = this.detectKeyType(publicKeyPem);
        console.log("🔍 Tipo de clave detectada:", keyType);
        try {
            if (keyType === 'ecc') {
                console.log("🔄 Decodificando firma DER...");
                const signatureBuffer = Buffer.from(file.signature, 'base64');
                const decoded = EcdsaDerSig.decode(signatureBuffer, 'der');
                const r = decoded.r.toString(16).padStart(64, '0');
                const s = decoded.s.toString(16).padStart(64, '0');
                console.log("🔐 r:", r);
                console.log("🔐 s:", s);
                const pubKeyObj = crypto.createPublicKey(publicKeyPem);
                const keyJwk = pubKeyObj.export({ format: 'jwk' });
                const x = keyJwk.x;
                const y = keyJwk.y;
                const pubKeyHex = '04' + base64urlToHex(x) + base64urlToHex(y);
                const key = ec.keyFromPublic(pubKeyHex, 'hex');
                const msgHash = crypto.createHash('sha256').update(file.content).digest();
                console.log("📦 Hash generado del archivo (hex):", msgHash.toString('hex'));
                const isValid = key.verify(msgHash, { r, s });
                console.log("✅ Resultado de verificación ECC:", isValid);
                return {
                    valid: isValid,
                    message: isValid ? 'Firma válida ✅' : 'Firma inválida ❌',
                };
            }
            else {
                console.log("🔍 Usando verificación RSA...");
                const signatureBuffer = Buffer.from(file.signature, 'base64');
                const verifier = crypto.createVerify('RSA-SHA256');
                verifier.update(Buffer.from(file.hash, 'hex'));
                verifier.end();
                const isValid = verifier.verify(publicKeyPem, signatureBuffer);
                console.log("✅ Resultado de verificación RSA:", isValid);
                return {
                    valid: isValid,
                    message: isValid ? 'Firma válida ✅' : 'Firma inválida ❌',
                };
            }
        }
        catch (err) {
            console.error('❌ Error durante la verificación:', err);
            return {
                valid: false,
                message: 'Error durante la verificación de la firma',
            };
        }
    }
    detectKeyType(pem) {
        const result = pem.includes('EC') || pem.includes('YHKoZIzj0CAQY') ? 'ecc' : 'rsa';
        console.log("🧠 [DETECCIÓN CLAVE] Resultado:", result);
        return result;
    }
    async listFiles(userId) {
        console.log(`📂 Listando archivos del usuario ID: ${userId}`);
        return this.prisma.file.findMany({
            where: { userId },
            select: { id: true, name: true, hash: true, signature: true },
        });
    }
    async getFileById(id) {
        console.log(`📤 Solicitando archivo ID: ${id}`);
        const file = await this.prisma.file.findUnique({ where: { id } });
        if (!file) {
            throw new Error('Archivo no encontrado');
        }
        return file;
    }
};
exports.FileService = FileService;
exports.FileService = FileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FileService);
//# sourceMappingURL=file.service.js.map