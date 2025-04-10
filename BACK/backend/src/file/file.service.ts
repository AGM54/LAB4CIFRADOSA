import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import * as crypto from 'crypto';
import * as asn1 from 'asn1.js';
import { ec as EC } from 'elliptic';

const ec = new EC('p256'); // ECC curve usada por WebCrypto

const EcdsaDerSig = asn1.define('EcdsaDerSig', function (this: any) {
  this.seq().obj(this.key('r').int(), this.key('s').int());
});

function base64urlToHex(b64url: string) {
  const base64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  const buffer = Buffer.from(base64, 'base64');
  return buffer.toString('hex');
}

@Injectable()
export class FileService {
  constructor(private prisma: PrismaService) {}

  /**
   * Guarda un archivo en la base de datos, junto con su firma y hash.
   * 
   * @param file Archivo subido por el usuario.
   * @param signature Firma digital en base64 (opcional).
   * @param hash Hash SHA-256 del archivo (opcional).
   * @param userId ID del usuario que sube el archivo.
   * @returns Registro creado en la base de datos.
   */
  async saveFile(file: Express.Multer.File, signature: string | undefined, hash: string | undefined, userId: number) {
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

  /**
   * Verifica la firma digital de un archivo usando la clave pública proporcionada.
   * Soporta claves ECC (P-256) y RSA.
   * 
   * @param fileId ID del archivo guardado en la base de datos.
   * @param publicKeyPem Clave pública del usuario en formato PEM.
   * @returns Resultado de la verificación con mensaje.
   */
  async verifyFile(fileId: number, publicKeyPem: string) {
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
        const keyJwk = pubKeyObj.export({ format: 'jwk' }) as any;

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
      } else {
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
    } catch (err) {
      console.error('❌ Error durante la verificación:', err);
      return {
        valid: false,
        message: 'Error durante la verificación de la firma',
      };
    }
  }

  /**
   * Detecta si una clave pública es ECC o RSA.
   * 
   * @param pem Clave pública en formato PEM.
   * @returns Tipo de clave: 'rsa' o 'ecc'.
   */
  private detectKeyType(pem: string): 'rsa' | 'ecc' {
    const result = pem.includes('EC') || pem.includes('YHKoZIzj0CAQY') ? 'ecc' : 'rsa';
    console.log("🧠 [DETECCIÓN CLAVE] Resultado:", result);
    return result;
  }

  /**
   * Devuelve los archivos pertenecientes a un usuario.
   * 
   * @param userId ID del usuario autenticado.
   * @returns Lista de archivos con metadatos.
   */
    asyn
  async listFiles(userId: number) {
    console.log(`📂 Listando archivos del usuario ID: ${userId}`);
    return this.prisma.file.findMany({
      where: { userId },
      select: { id: true, name: true, hash: true, signature: true },
    });
  }

  /**
   * Busca un archivo por su ID y lo devuelve (incluyendo contenido binario).
   * 
   * @param id ID del archivo.
   * @returns Archivo completo (nombre, contenido, firma, hash...).
   * @throws Error si no se encuentra el archivo.
   */
  async getFileById(id: number) {
    console.log(`📤 Solicitando archivo ID: ${id}`);
    const file = await this.prisma.file.findUnique({ where: { id } });

    if (!file) {
      throw new Error('Archivo no encontrado');
    }

    return file;
  }
}
