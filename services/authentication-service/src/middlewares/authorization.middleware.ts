import { Request, Response, NextFunction } from 'express';
import { HttpException } from '@/exceptions/httpException';
import { RequestWithUser } from '@/interfaces/auth.interface';

export const AuthorizationMiddleware = (...allowedRoles: string[]) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return next(new HttpException(401, 'Unauthorized: No user found'));
    }

    if (!allowedRoles.includes(user.role)) {
      return next(new HttpException(403, 'Forbidden: You do not have permission to access this resource'));
    }

    next();
  };
};
