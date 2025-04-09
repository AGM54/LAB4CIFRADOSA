import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Post('publickey')
  async savePublicKey(
    @Request() req,
    @Body('publicKey') publicKey: string,
  ) {
    const email = req.user.email;
    return this.userService.savePublicKey(email, publicKey);
  }
}
