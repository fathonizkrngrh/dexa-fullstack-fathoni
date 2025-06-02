// src/middlewares/multer.middleware.ts
import { Request } from 'express';
import multer, { FileFilterCallback, Multer } from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Multer, cb: FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB limit
  },
});
