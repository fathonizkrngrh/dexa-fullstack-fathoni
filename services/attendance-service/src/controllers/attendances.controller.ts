import { Request, Response, NextFunction } from 'express';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { CreateAttendanceDto } from '@/dtos/attendances.dto';
import { Attendance } from '@/interfaces/attendances.interface';
import { AttendanceService } from '@/services/attendances.service';
import { Container } from 'typedi';
import { AttendanceFilterQuery } from '@/interfaces/query/attendance.interface';

export class AttendanceController {
  public attendanceService = Container.get(AttendanceService);

  public getAttendances = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employeeId = req.params.employeeId;
      const query = req.query as AttendanceFilterQuery;

      const data = await this.attendanceService.getAttendanceGroupedByDate(+employeeId, query);
      res.status(200).json({ data, message: `attendances form employee ${employeeId}` });
    } catch (error) {
      next(error);
    }
  };

  public getAttendanceGroupedByEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query;
      const data = await this.attendanceService.getAttendanceGroupedByEmployee(query);
      res.status(200).json({ data, message: 'attendances grouped by employee' });
    } catch (error) {
      next(error);
    }
  };

  public getMyAttendances = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const query = req.query as AttendanceFilterQuery;
      const employeeId = req.employee.id;

      const data = await this.attendanceService.getAttendanceGroupedByDate(employeeId, query);
      res.status(200).json({ data, message: 'my attendances' });
    } catch (error) {
      next(error);
    }
  };

  public createAttendance = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const employee = req.employee;
      const attendanceData: CreateAttendanceDto = req.body;

      const data: Attendance = await this.attendanceService.createAttendance(attendanceData, employee);

      res.status(201).json({ data, message: `success ${data.type}` });
    } catch (error) {
      next(error);
    }
  };
}
