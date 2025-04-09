import {
    Controller,
    Post,
    UseGuards,
    UploadedFile,
    UseInterceptors,
    Body,
    Request,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { FileService } from './file.service';
  import { CreateFileDto } from './create-file.dto';
  import { Express } from 'express';
  
  @Controller('file')
  export class FileController {
    constructor(private readonly fileService: FileService) {}
  
    // ✅ Subida de archivo con firma y hash
    @UseGuards(JwtAuthGuard)
    @Post('guardar')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
      @UploadedFile() file: Express.Multer.File,
      @Body() dto: CreateFileDto,
      @Request() req: any,
    ) {
      const userId = req.user.id;
      return this.fileService.saveFile(file, dto.signature, dto.hash, userId);
    }
  
    // ✅ Verificación de firma del archivo
    @UseGuards(JwtAuthGuard)
    @Post('verificar')
    async verifyFile(@Body() body: { fileId: number; publicKey: string }) {
      return this.fileService.verifyFile(body.fileId, body.publicKey);
    }
  }
  