//auth//service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../services/prisma.service';


@Injectable()
export class AuthService {
  // Inyectamos PrismaService y JwtService vía el constructor
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  // Método para registrar un nuevo usuario
  async register(email: string, name: string, password: string) {
    console.log("📥 [REGISTER] Intentando registrar usuario:", email);

    // Verificamos si ya existe un usuario con el mismo correo
    const existing = await this.prisma.user.findUnique({ where: { email } });

    if (existing) {
      console.warn("⚠️ Ya existe un usuario con ese correo.");
      throw new Error('Ya existe un usuario con este correo');
    }

    // Hasheamos la contraseña con bcrypt (con sal automática)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creamos el nuevo usuario en la base de datos
    await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        publicKey: "", // Se actualizará luego cuando genere su par de llaves
      },
    });

    console.log("✅ Usuario registrado exitosamente:", email);
    return { message: 'Usuario registrado exitosamente' };
  }

  // Método para login: verifica credenciales y devuelve un JWT
  async login(email: string, password: string) {
    console.log("🔐 [LOGIN] Intentando iniciar sesión:", email);

    // Buscamos al usuario por correo
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.error("❌ Usuario no encontrado.");
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Comparamos la contraseña ingresada con el hash almacenado
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error("❌ Contraseña incorrecta.");
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generamos un JWT con el ID y el email del usuario
    const token = this.jwtService.sign({
      sub: user.id,       // 'sub' representa al sujeto del token (user ID)
      email: user.email,
    });

    console.log("🎟️ JWT generado exitosamente para:", email);
    return { token };
  }

  // Método para verificar la validez de un token JWT
  verifyToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'defaultSecret',
      });
      console.log("🛡️ Token válido:", payload);
      return payload;
    } catch (error) {
      console.error("❌ Token inválido o expirado.");
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
