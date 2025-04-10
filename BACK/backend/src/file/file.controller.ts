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
  
  // ✅ Interceptor que permite manejar archivos subidos (tipo multipart/form-data)
  import { FileInterceptor } from '@nestjs/platform-express';
  
  // ✅ Guard que protege rutas usando JWT
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  
  // ✅ Servicio donde vive la lógica de archivos
  import { FileService } from './file.service';
  
  // ✅ DTO para recibir firma y hash opcionalmente
  import { CreateFileDto } from './create-file.dto';
  
  // ✅ Tipos para manejar archivos y respuestas HTTP
  import { Express, Response } from 'express';
  
  // ✅ Prefijo de todas las rutas: /file
  @Controller('file')
  export class FileController {
    // Inyectamos el servicio de archivos
    constructor(private readonly fileService: FileService) {}
  
    // ✅ Endpoint para subir un archivo firmado digitalmente (y con hash opcional)
    @UseGuards(JwtAuthGuard) //  Protege con JWT: solo usuarios logueados pueden subir
    @Post('guardar') // Ruta: POST /file/guardar
    @UseInterceptors(FileInterceptor('file')) // Habilita subida de archivos en el campo "file"
    async uploadFile(
      @UploadedFile() file: Express.Multer.File, //  Archivo subido
      @Body() dto: CreateFileDto,                //  Firma y hash opcionales
      @Request() req: any,                       //  Usuario autenticado
    ) {
      const userId = req.user.id; // Obtenemos el ID del usuario desde el JWT
  
      // Logs para debug
      console.log(`\n📤 [POST /file/guardar]`);
      console.log(`👤 Usuario ID: ${userId}`);
      console.log(`📄 Archivo recibido: ${file?.originalname}`);
      console.log(`🧮 Hash SHA-256: ${dto.hash}`);
      console.log(`🔏 Firma (inicio): ${dto.signature?.substring(0, 80)}...`);
  
      // Guardamos el archivo
      const saved = await this.fileService.saveFile(file, dto.signature, dto.hash, userId);
  
      console.log(`✅ Archivo guardado con ID: ${saved.id}`);
  
      return {
        success: true,
        id: saved.id,
        message: 'Archivo guardado correctamente',
      };
    }
  
    // ✅ Endpoint para verificar la firma digital de un archivo
    @UseGuards(JwtAuthGuard) //  Solo con JWT
    @Post('verificar') // Ruta: POST /file/verificar
    async verifyFile(@Body() body: { fileId: number; publicKey: string }) {
      console.log(`\n🔎 [POST /file/verificar]`);
      console.log(`🆔 Archivo ID: ${body.fileId}`);
      console.log(`🔑 Clave pública (inicio): ${body.publicKey.slice(0, 80)}...`);
  
      // Verificamos con el servicio si la firma es válida
      return this.fileService.verifyFile(body.fileId, body.publicKey);
    }
  
    // ✅ Endpoint para listar los archivos del usuario autenticado
    @UseGuards(JwtAuthGuard) //  Protegido con JWT
    @Get('archivos') // Ruta: GET /file/archivos
    async listFiles(@Request() req: any) {
      const userId = req.user.id; // Obtenemos ID desde JWT
  
      console.log(`\n📂 [GET /file/archivos]`);
      console.log(`👤 Solicitando archivos para usuario ID: ${userId}`);
  
      const archivos = await this.fileService.listFiles(userId);
  
      console.log(`📁 Archivos encontrados: ${archivos.length}`);
  
      return archivos; // Devuelve lista de archivos del usuario
    }
  
    // ✅Endpoint para descargar un archivo por su ID
    @UseGuards(JwtAuthGuard) // 🔐 Protegido con JWT
    @Get(':id/descargar') // Ruta: GET /file/:id/descargar
    async downloadFile(@Param('id') id: string, @Res() res: Response) {
      const numericId = Number(id); // Convertimos ID a número
      if (isNaN(numericId)) {
        // Si no es un número válido, respondemos con error
        console.warn(`🚫 [GET /file/${id}/descargar] ID inválido`);
        res.status(HttpStatus.BAD_REQUEST).send('ID inválido');
        return;
      }
  
      console.log(`\n⬇️ [GET /file/${numericId}/descargar]`);
      console.log(`📥 Descargando archivo con ID: ${numericId}`);
  
      try {
        const file = await this.fileService.getFileById(numericId);
  
        // Configuramos headers para descarga
        res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
        res.setHeader('Content-Type', 'application/octet-stream');
  
        // Enviamos el archivo como respuesta
        res.send(file.content);
  
        console.log("✅ Archivo enviado con éxito.");
      } catch (error) {
        console.error(`❌ Error al descargar archivo ID ${numericId}:`, error.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('No se pudo descargar el archivo');
      }
    }
  }
  