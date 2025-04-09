import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class FileService {
  constructor(private prisma: PrismaService) {}

  /**
   * Guarda un archivo con firma digital opcional y hash SHA-256.
   */
  async saveFile(
    file: Express.Multer.File,
    signature: string | undefined,
    hash: string | undefined,
    userId: number,
  ) {
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

  /**
   * Verifica la firma digital de un archivo usando la clave pública.
   */
  async verifyFile(fileId: number, publicKeyPem: string) {
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

      const isValid = verifier.verify(
        publicKeyPem,
        Buffer.from(file.signature, 'base64'),
      );

      return {
        valid: isValid,
        message: isValid ? 'Firma válida ✅' : 'Firma inválida ❌',
      };
    } catch (error) {
      console.error('Error verificando firma:', error);
      return {
        valid: false,
        message: 'Error durante la verificación de la firma',
      };
    }
  }
}
