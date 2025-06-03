import { DB } from '@/database/mysql/attendance.db';
import { HttpException } from '@/exceptions/httpException';
import { deleteFromCloudinary, uploadToCloudinary } from '@/utils/cloudinary';
import { Transaction } from 'sequelize';
import { Service } from 'typedi';

@Service()
export class FileService {
  public async upload(buffer: Buffer, userId: number, folder: string): Promise<any> {
    const fileName = `${userId}-${Date.now()}`;
    const cloudinaryRes = await uploadToCloudinary(buffer, fileName, folder);
    if (!cloudinaryRes) {
      throw new HttpException(400, 'Failed to upload file to Cloudinary');
    }

    const res = await DB.Files.create({
      url: cloudinaryRes.url,
      public_id: cloudinaryRes.publicId,
      folder: folder,
      uploaded_by: userId,
    });

    return res;
  }

  public async delete(publicId: string): Promise<any> {
    const transaction: Transaction = await DB.sequelize.transaction();
    try {
      const deleted = await DB.Files.update(
        { deleted: 1 },
        {
          where: {
            public_id: publicId,
          },
          transaction: transaction,
        },
      );

      await deleteFromCloudinary(publicId);

      await transaction.commit();

      return deleted;
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(400, `Failed to delete file: ${error.message}`);
    }
  }
}
