"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const file_service_1 = require("./file.service");
const create_file_dto_1 = require("./create-file.dto");
let FileController = class FileController {
    fileService;
    constructor(fileService) {
        this.fileService = fileService;
    }
    async uploadFile(file, dto, req) {
        const userId = req.user.id;
        return this.fileService.saveFile(file, dto.signature, dto.hash, userId);
    }
    async verifyFile(body) {
        return this.fileService.verifyFile(body.fileId, body.publicKey);
    }
};
exports.FileController = FileController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('guardar'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_file_dto_1.CreateFileDto, Object]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('verificar'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "verifyFile", null);
exports.FileController = FileController = __decorate([
    (0, common_1.Controller)('file'),
    __metadata("design:paramtypes", [file_service_1.FileService])
], FileController);
//# sourceMappingURL=file.controller.js.map