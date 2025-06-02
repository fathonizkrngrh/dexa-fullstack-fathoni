import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { AttendanceController } from '@/controllers/attendances.controller';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { AuthorizationMiddleware } from '@/middlewares/authorization.middleware';

export class AttendanceRoute implements Routes {
  public path = '/attendance';
  public router = Router();
  public controller = new AttendanceController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/me`, AuthMiddleware, this.controller.getMyAttendances);
    this.router.get(`${this.path}/employee`, AuthMiddleware, AuthorizationMiddleware('ADMIN'), this.controller.getAttendanceGroupedByEmployee);
    this.router.get(`${this.path}/:employeeId`, AuthMiddleware, AuthorizationMiddleware('ADMIN'), this.controller.getAttendances);
    this.router.post(`${this.path}`, AuthMiddleware, this.controller.createAttendance);
  }
}
