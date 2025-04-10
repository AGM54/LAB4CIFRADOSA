//auth//service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../services/prisma.service';


@Injectable()
export class AuthService {
  /**
   * Servicio de autenticación que maneja registro, inicio de sesión y verificación de tokens JWT.
   * 
   * @param prisma Servicio Prisma para acceso a base de datos.
   * @param jwtService Servicio para generación y verificación de JWT.
  */
 constructor(
   // Inyectamos PrismaService y JwtService vía el constructor
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  /**
   * Registra un nuevo usuario con email, nombre y contraseña.
   * La contraseña se almacena hasheada con bcrypt.
   * 
   * @param email Correo electrónico del nuevo usuario.
   * @param name Nombre del usuario.
   * @param password Contraseña en texto plano.
   * @returns Mensaje de éxito si el usuario fue registrado.
   * @throws Error si ya existe un usuario con el mismo correo.
  */
 async register(email: string, name: string, password: string) {
    // Método para registrar un nuevo usuario
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

  /**
   * Inicia sesión verificando las credenciales y genera un JWT.
   * 
   * @param email Correo electrónico del usuario.
   * @param password Contraseña ingresada por el usuario.
   * @returns Objeto con token JWT si las credenciales son válidas.
   * @throws UnauthorizedException si las credenciales son inválidas.
   */
  async login(email: string, password: string) {
    // Método para login: verifica credenciales y devuelve un JWT
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
  
  /**
   * Verifica la validez de un token JWT.
   * 
   * @param token Token JWT a verificar.
   * @returns Payload decodificado si el token es válido.
   * @throws UnauthorizedException si el token es inválido o ha expirado.
   */
  verifyToken(token: string) {
    // Método para verificar la validez de un token JWT
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
