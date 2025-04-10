// src/auth/jwt.strategy.ts

// Importamos los decoradores y clases necesarias de NestJS y Passport
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// Declaramos esta clase como inyectable (servicio)
@Injectable()
// Extendemos la clase PassportStrategy, indicamos que usaremos la estrategia 'jwt'
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    // Configuramos la estrategia JWT
    super({
      // Indicamos que el JWT se va a extraer del header Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // No ignoramos la expiración: si el token expira, será rechazado automáticamente
      ignoreExpiration: false,

      // Clave secreta para verificar la firma del token
      // Debe coincidir con la usada para firmar en `JwtModule`
      secretOrKey: process.env.JWT_SECRET || 'defaultSecret',
    });
  }

  // Este método se llama automáticamente si el token es válido
  // Aquí podemos retornar la información que queremos que esté en `req.user`
  async validate(payload: any) {
    // El payload contiene los datos firmados en el JWT (como sub, email, etc.)
    // Aquí retornamos el objeto que estará disponible en cada request
    return {
      id: payload.sub,       // ID del usuario (campo `sub` en el JWT)
      email: payload.email,  // Email del usuario
    };
  }
}
