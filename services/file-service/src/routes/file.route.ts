import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { upload } from '@/middlewares/multer.middleware';
import { FileController } from '@/controllers/file.controller';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import { DeleteFilesDto, UploadFilesDto } from '@/dtos/files.dto';

export class FileRoute implements Routes {
  public path = '/file';
  public router = Router();
  public file = new FileController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/upload`, upload.single('photo'), ValidationMiddleware(UploadFilesDto), AuthMiddleware, this.file.uploadPhoto);
    this.router.post(`${this.path}/delete`, ValidationMiddleware(DeleteFilesDto), AuthMiddleware, this.file.deletePhoto);
  }
}
