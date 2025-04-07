import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FileModule } from './file/file.module';
import { PrismaService } from './prisma/prisma.service';


@Module({
  imports: [AuthModule, UserModule, FileModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
