import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(
    @Body() body: { email: string; name: string; password: string }
  ) {
    return this.authService.register(body.email, body.name, body.password);
  }

  @Post('login')
  login(
    @Body() body: { email: string; password: string }
  ) {
    return this.authService.login(body.email, body.password);
  }
}
