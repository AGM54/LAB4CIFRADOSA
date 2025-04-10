import {
    Controller,
    Post,
    UseGuards,
    UploadedFile,
    UseInterceptors,
    Body,
    Request,
    Get,
    Param,
    Res,
    HttpStatus,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { FileService } from './file.service';
  import { CreateFileDto } from './create-file.dto';
  import { Express, Response } from 'express';
  
  @Controller('file')
  export class FileController {
    constructor(private readonly fileService: FileService) {}
  
    // ✅ Subida de archivo con firma digital y hash
    @UseGuards(JwtAuthGuard)
    @Post('guardar')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
      @UploadedFile() file: Express.Multer.File,
      @Body() dto: CreateFileDto,
      @Request() req: any,
    ) {
      const userId = req.user.id;
  
      console.log(`\n📤 [POST /file/guardar]`);
      console.log(`👤 Usuario ID: ${userId}`);
      console.log(`📄 Archivo recibido: ${file?.originalname}`);
      console.log(`🧮 Hash SHA-256: ${dto.hash}`);
      console.log(`🔏 Firma (inicio): ${dto.signature?.substring(0, 80)}...`);
  
      const saved = await this.fileService.saveFile(file, dto.signature, dto.hash, userId);
  
      console.log(`✅ Archivo guardado con ID: ${saved.id}`);
  
      return {
        success: true,
        id: saved.id,
        message: 'Archivo guardado correctamente',
      };
    }
  
    // ✅ Verificación de firma digital
    @UseGuards(JwtAuthGuard)
    @Post('verificar')
    async verifyFile(@Body() body: { fileId: number; publicKey: string }) {
      console.log(`\n🔎 [POST /file/verificar]`);
      console.log(`🆔 Archivo ID: ${body.fileId}`);
      console.log(`🔑 Clave pública (inicio): ${body.publicKey.slice(0, 80)}...`);
  
      return this.fileService.verifyFile(body.fileId, body.publicKey);
    }
  
    // ✅ Obtener archivos del usuario autenticado
    @UseGuards(JwtAuthGuard)
    @Get('archivos')
    async listFiles(@Request() req: any) {
      const userId = req.user.id;
  
      console.log(`\n📂 [GET /file/archivos]`);
      console.log(`👤 Solicitando archivos para usuario ID: ${userId}`);
  
      const archivos = await this.fileService.listFiles(userId);
  
      console.log(`📁 Archivos encontrados: ${archivos.length}`);
  
      return archivos;
    }
  
    // ✅ Descargar archivo por ID
    @UseGuards(JwtAuthGuard)
    @Get(':id/descargar')
    async downloadFile(@Param('id') id: string, @Res() res: Response) {
      const numericId = Number(id);
      if (isNaN(numericId)) {
        console.warn(`🚫 [GET /file/${id}/descargar] ID inválido`);
        res.status(HttpStatus.BAD_REQUEST).send('ID inválido');
        return;
      }
  
      console.log(`\n⬇️ [GET /file/${numericId}/descargar]`);
      console.log(`📥 Descargando archivo con ID: ${numericId}`);
  
      try {
        const file = await this.fileService.getFileById(numericId);
  
        res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.send(file.content);
  
        console.log("✅ Archivo enviado con éxito.");
      } catch (error) {
        console.error(`❌ Error al descargar archivo ID ${numericId}:`, error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('No se pudo descargar el archivo');
      }
    }
  }
  