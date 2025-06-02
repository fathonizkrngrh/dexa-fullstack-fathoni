import { Router } from 'express';
import { AuthController } from '@controllers/auth.controller';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { CreateUserWithEmployeeDto } from '@/dtos/users.dto';
import { LoginDto } from '@/dtos/auth.dto';

export class AuthRoute implements Routes {
  public router = Router();
  public auth = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/register/employee', ValidationMiddleware(CreateUserWithEmployeeDto), AuthMiddleware, this.auth.registerEmployee);
    this.router.post('/login', ValidationMiddleware(LoginDto), this.auth.logIn);
    this.router.post('/logout', AuthMiddleware, this.auth.logOut);
  }
}
