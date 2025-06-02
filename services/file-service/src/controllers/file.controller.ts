import { Response, NextFunction } from 'express';
import { FileService } from '@/services/file.service';
import { RequestWithUser } from '@/interfaces/auth.interface';
import Container from 'typedi';

export class FileController {
  public fileSrv = Container.get(FileService);

  public uploadPhoto = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const file = req.file;
      const userId = req.user.id;
      const folder = req.body.foldername || 'attendance_photos';

      if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      const data = await this.fileSrv.upload(file.buffer, userId, folder);

      return res.status(201).json({ data: data, message: 'File uploaded successfully' });
    } catch (err) {
      next(err);
    }
  };

  public deletePhoto = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const publicId = req.body.public_id;

      await this.fileSrv.delete(publicId);

      return res.status(200).json({ message: 'File deleted successfully' });
    } catch (err) {
      next(err);
    }
  };
}
