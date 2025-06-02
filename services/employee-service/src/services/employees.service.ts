import { Service } from 'typedi';
import { DB } from '@/database/mysql/attendance.db';
import { HttpException } from '@/exceptions/HttpException';
import { Employee } from '@interfaces/employees.interface';
import { paginateData, parsePagination } from '@/utils/pagination';
import { EmployeeFilterQuery } from '@/interfaces/query/employee.interface';
import { UpdateEmployeeDto } from '@/dtos/employees.dto';
import { RedisUtil } from '@/utils/cache';
import { CONFIG } from '@/config';

@Service()
export class EmployeeService {
  public async findAllEmployee(query: EmployeeFilterQuery): Promise<any> {
    const { page = 0, size = 10, sortBy = 'created_at', sortOrder = 'DESC', department, search, position } = query;
    const { limit, offset } = parsePagination(page, size);

    const result = await DB.Employees.findAndCountAll({
      where: {
        deleted: 0,
        ...(search && {
          [DB.Sequelize.Op.or]: [{ name: { [DB.Sequelize.Op.like]: `%${search}%` } }, { nik: { [DB.Sequelize.Op.like]: `%${search}%` } }],
        }),
        ...(department && { department: department }),
        ...(position && { position: position }),
      },
      include: [{ model: DB.Users, as: 'user', attributes: ['id', 'role', 'email'] }],
      order: [[sortBy, sortOrder]],
      offset,
      limit,
    });

    return paginateData(result, page, size);
  }

  public async findEmployeeById(employeeId: number): Promise<Employee> {
    const cachedEmployee = await RedisUtil.get<Employee>(CONFIG.MODULE_NAME, 'EMPLOYEE', employeeId.toString());
    if (cachedEmployee) return cachedEmployee;

    const findEmployee: Employee = await DB.Employees.findOne({
      where: { id: employeeId, deleted: 0 },
      include: [{ model: DB.Users, as: 'user', attributes: ['id', 'role', 'email'] }],
    });

    if (!findEmployee) throw new HttpException(400, "Employee doesn't exist");

    await RedisUtil.set(CONFIG.MODULE_NAME, 'EMPLOYEE', employeeId.toString(), findEmployee, 60 * 5 * 1);

    return findEmployee;
  }

  public async updateEmployee(employeeId: number, employeeData: UpdateEmployeeDto): Promise<Employee> {
    const findEmployee: Employee = await DB.Employees.findOne({ where: { id: employeeId, deleted: 0 } });
    if (!findEmployee) throw new HttpException(400, "Employee doesn't exist");

    await DB.Employees.update({ ...employeeData }, { where: { id: employeeId } });

    const updateEmployee: Employee = await DB.Employees.findByPk(employeeId);
    return updateEmployee;
  }

  public async deleteEmployee(employeeId: number): Promise<Employee> {
    const findEmployee: Employee = await DB.Employees.findOne({ where: { id: employeeId, deleted: 0 } });
    if (!findEmployee) throw new HttpException(400, "Employee doesn't exist");

    await DB.Employees.update({ deleted: 1 }, { where: { id: employeeId } });

    return findEmployee;
  }
}
