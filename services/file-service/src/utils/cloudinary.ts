import cloudinary from '@/config/cloudinary.config';
import { Readable } from 'stream';

export const uploadToCloudinary = (buffer: Buffer, fileName: string, folder: string): Promise<{ url: string; publicId: string }> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder || 'dexa/misc',
        public_id: fileName,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id, // <<-- ini dia
        });
      },
    );

    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    stream.pipe(uploadStream);
  });
};

export const deleteFromCloudinary = (publicId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, { resource_type: 'image' }, (error, result) => {
      if (error) return reject(error);
      if (result.result !== 'ok' && result.result !== 'not found') {
        return reject(new Error(`Failed to delete image: ${result.result}`));
      }
      resolve();
    });
  });
};
