import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // Guarda la clave pública usando el email como identificador
  async savePublicKey(email: string, publicKey: string) {
    return this.prisma.user.update({
      where: { email },
      data: { publicKey },
    });
  }
}
