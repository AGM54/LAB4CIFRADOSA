import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { PrismaModule } from '../services/prisma.module'; 

@Module({
  imports: [PrismaModule],
  controllers: [FileController],
  providers: [FileService]
})
export class FileModule {}
