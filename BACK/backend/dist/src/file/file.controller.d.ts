import { FileService } from './file.service';
import { CreateFileDto } from './create-file.dto';
import { Response } from 'express';
export declare class FileController {
    private readonly fileService;
    constructor(fileService: FileService);
    uploadFile(file: Express.Multer.File, dto: CreateFileDto, req: any): Promise<{
        success: boolean;
        id: number;
        message: string;
    }>;
    verifyFile(body: {
        fileId: number;
        publicKey: string;
    }): Promise<{
        valid: any;
        message: string;
    }>;
    listFiles(req: any): Promise<{
        id: number;
        name: string;
        hash: string | null;
        signature: string | null;
    }[]>;
    downloadFile(id: string, res: Response): Promise<void>;
}
