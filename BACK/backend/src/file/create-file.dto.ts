// src/file/create-file.dto.ts


import { IsOptional, IsString } from 'class-validator';

//  Definimos una clase DTO que usaremos para recibir y validar los datos
export class CreateFileDto {

  // Esta propiedad es opcional
  // Se valida que si viene, debe ser un string (texto)
  @IsOptional()
  @IsString()
  signature?: string; //  Firma digital del archivo (puede no venir)

  // También es opcional, y si viene, debe ser string
  @IsOptional()
  @IsString()
  hash?: string; 
}
