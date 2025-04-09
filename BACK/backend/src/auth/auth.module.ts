import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../services/prisma.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,  // ✅ Necesario para estrategias con Passport
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret', // ✅ fallback por si no hay .env
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy], // ✅ Registrar JwtStrategy
  exports: [AuthService], 
})
export class AuthModule {}
