import { FileService } from './file.service';
import { CreateFileDto } from './create-file.dto';
export declare class FileController {
    private readonly fileService;
    constructor(fileService: FileService);
    uploadFile(file: Express.Multer.File, dto: CreateFileDto, req: any): Promise<{
        id: number;
        name: string;
        content: Uint8Array;
        hash: string | null;
        signature: string | null;
        userId: number;
    }>;
    verifyFile(body: {
        fileId: number;
        publicKey: string;
    }): Promise<{
        valid: boolean;
        message: string;
    }>;
}
