import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { UpdateEmployeeDto } from '@/dtos/employees.dto';
import { Employee } from '@interfaces/employees.interface';
import { RequestWithUser } from '@interfaces/auth.interface';
import { EmployeeService } from '@/services/employees.service';

export class EmployeeController {
  public employeeSrv = Container.get(EmployeeService);

  public getEmployees = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllEmployeesData: Employee[] = await this.employeeSrv.findAllEmployee(req.query);

      res.status(200).json({ data: findAllEmployeesData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getEmployeeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employeeId = Number(req.params.id);
      const findOneEmployeeData: Employee = await this.employeeSrv.findEmployeeById(employeeId);

      res.status(200).json({ data: findOneEmployeeData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public updateEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employeeId = Number(req.params.id);
      const employeeData: UpdateEmployeeDto = req.body;
      const updateEmployeeData: Employee = await this.employeeSrv.updateEmployee(employeeId, employeeData);

      res.status(200).json({ data: updateEmployeeData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public updateEmployeeMe = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const employeeId = req.employee.id;
      const employeeData: UpdateEmployeeDto = req.body;
      const updateEmployeeData: Employee = await this.employeeSrv.updateEmployee(employeeId, employeeData);

      res.status(200).json({ data: updateEmployeeData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employeeId = Number(req.params.id);
      const deleteEmployeeData: Employee = await this.employeeSrv.deleteEmployee(employeeId);

      res.status(200).json({ data: deleteEmployeeData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
