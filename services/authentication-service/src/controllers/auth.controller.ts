import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { User } from '@interfaces/users.interface';
import { RequestWithUser } from '@interfaces/auth.interface';
import { AuthService } from '@services/auth.service';
import { CreateUserWithEmployeeDto } from '@/dtos/users.dto';
import { LoginDto } from '@/dtos/auth.dto';

export class AuthController {
  public authSrv = Container.get(AuthService);

  public registerEmployee = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserWithEmployeeDto = req.body;
      const user = req.user as User;
      console.log('user', user);
      const registerEmployeeData = await this.authSrv.registerEmployee(userData, user.id);

      res.status(201).json({ data: registerEmployeeData, message: 'registerEmployeeData' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: LoginDto = req.body;
      const { cookie, user, employee, token } = await this.authSrv.login(userData);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ data: { user, employee, token: token }, message: 'login' });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.user;
      const logOutUserData: User = await this.authSrv.logout(userData);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };
}
