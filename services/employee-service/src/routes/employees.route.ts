import { Router } from 'express';
import { EmployeeController } from '@/controllers/employees.controller';
import { UpdateEmployeeDto } from '@/dtos/employees.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { AuthorizationMiddleware } from '@/middlewares/authorization.middleware';

export class EmployeeRoute implements Routes {
  public path = '/employee';
  public router = Router();
  public employeeC = new EmployeeController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware, AuthorizationMiddleware('ADMIN', 'EMPLOYEE'), this.employeeC.getEmployees);
    this.router.get(`${this.path}/:id(\\d+)`, AuthMiddleware, AuthorizationMiddleware('ADMIN', 'EMPLOYEE'), this.employeeC.getEmployeeById);
    this.router.put(
      `${this.path}/:id(\\d+)`,
      AuthMiddleware,
      AuthorizationMiddleware('ADMIN', 'EMPLOYEE'),
      ValidationMiddleware(UpdateEmployeeDto, true),
      this.employeeC.updateEmployee,
    );
    this.router.put(`${this.path}/me`, AuthMiddleware, ValidationMiddleware(UpdateEmployeeDto, true), this.employeeC.updateEmployee);
    this.router.delete(`${this.path}/:id(\\d+)`, AuthMiddleware, AuthorizationMiddleware('ADMIN', 'EMPLOYEE'), this.employeeC.deleteEmployee);
  }
}
