//auth//controller.ts

import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Endpoint para registrar un nuevo usuario
  @Post('register')
  async register(
    @Body() body: { email: string; name: string; password: string }
  ) {
    console.log("📥 [POST /register] Petición recibida");
    console.log("📧 Email:", body.email);
    console.log("👤 Nombre:", body.name);

    const result = await this.authService.register(
      body.email,
      body.name,
      body.password
    );

    console.log("✅ Usuario registrado exitosamente:", result);
    return result;
  }

  // Endpoint para hacer login y generar un JWT
  @Post('login')
  async login(
    @Body() body: { email: string; password: string }
  ) {
    console.log("🔐 [POST /login] Petición recibida");
    console.log("📧 Email:", body.email);

    const result = await this.authService.login(body.email, body.password);

    console.log("🎟️ Token generado correctamente:", result.token.slice(0, 40) + "...");
    return result;
  }
}
