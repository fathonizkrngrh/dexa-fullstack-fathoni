import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { CONFIG, SECRET_KEY } from '@config';
import { DB } from '@/database/mysql/attendance.db';
import { HttpException } from '@exceptions/httpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import { RedisUtil } from '@/utils/cache';

const getAuthorization = req => {
  const coockie = req.cookies['Authorization'];
  if (coockie) return coockie;

  const header = req.header('Authorization');
  if (header) return header.split('Bearer ')[1];

  return null;
};

export const AuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = getAuthorization(req);
    console.log('Authorization:', Authorization);

    if (Authorization) {
      const { id } = verify(Authorization, SECRET_KEY) as DataStoredInToken;
      console.log('Decoded ID:', id);

      const userCache: any = await RedisUtil.get(CONFIG.MODULE_AUTH, 'LOGIN', id.toString());

      if (userCache) {
        req.user = userCache.user;
        req.employee = userCache.employee;
        next();
      } else {
        console.log('1:');
        next(new HttpException(401, 'Unauthorized'));
      }
    } else {
      console.log('2:');
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    console.log('3:', error);
    next(new HttpException(401, 'Unauthorized'));
  }
};
