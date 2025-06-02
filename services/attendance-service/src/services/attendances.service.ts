import { Service } from 'typedi';
import { CONFIG } from '@/config';
import { Op } from 'sequelize';
import { DB } from '@/database/mysql/attendance.db';
import { CreateAttendanceDto } from '@/dtos/attendances.dto';
import { HttpException } from '@/exceptions/HttpException';
import { Attendance } from '@/interfaces/attendances.interface';
import { Employee } from '@/interfaces/employees.interface';
import { EmployeeFilterQuery } from '@/interfaces/query/employee.interface';
import { AttendanceFilterQuery } from '@/interfaces/query/attendance.interface';
import { paginateData, parsePagination } from '@/utils/pagination';
import { RedisUtil } from '@/utils/cache';

@Service()
export class AttendanceService {
  private getAttendanceCacheKey(employeeId: number, date_from?: string, date_to?: string): string {
    let key = `${employeeId}`;
    if (date_from && date_to) {
      key += `:${date_from}:${date_to}`;
    }
    return key;
  }

  public async getAttendanceGroupedByDate(
    employeeId: number,
    query: AttendanceFilterQuery,
  ): Promise<Array<{ date: string; attendances: Attendance[] }>> {
    const { date_from, date_to } = query;

    const where: Record<string, any> = {
      employee_id: employeeId,
      deleted: 0,
    };

    if (date_from && date_to) {
      where.date = { [Op.between]: [date_from, date_to] };
    } else {
      const today = new Date();
      const from = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4);
      const to = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      where.date = { [Op.between]: [from, to] };
    }

    const cacheKey = this.getAttendanceCacheKey(employeeId, date_from, date_to);
    const cachedAttendance: Attendance[] = await RedisUtil.get(CONFIG.MODULE_NAME, 'ATTENDANCE', cacheKey);

    let records: Attendance[] = cachedAttendance || [];

    if (!cachedAttendance || cachedAttendance.length === 0) {
      records = await DB.Attendances.findAll({
        where,
        order: [
          ['date', 'DESC'],
          ['time', 'DESC'],
        ],
        limit: 5,
      });

      await RedisUtil.set(CONFIG.MODULE_NAME, 'ATTENDANCE', cacheKey, records, 60 * 1 * 1);
    }

    const grouped = records.reduce<Record<string, Attendance[]>>((acc, curr) => {
      const date = new Date(curr.date).toISOString().split('T')[0];
      (acc[date] = acc[date] || []).push(curr);
      return acc;
    }, {});

    return Object.entries(grouped).map(([date, attendances]) => ({
      date,
      attendances,
    }));
  }

  public async getAttendanceGroupedByEmployee(query: EmployeeFilterQuery & { date?: string }): Promise<any> {
    const { page = 0, size = 10, sortBy = 'created_at', sortOrder = 'DESC', department, search, position, date } = query;
    const { limit, offset } = parsePagination(page, size);

    const employeeWhere: Record<string, any> = {
      deleted: 0,
      ...(search && {
        [DB.Sequelize.Op.or]: [{ name: { [DB.Sequelize.Op.like]: `%${search}%` } }, { nik: { [DB.Sequelize.Op.like]: `%${search}%` } }],
      }),
      ...(department && { department }),
      ...(position && { position }),
    };

    const attendanceWhere: Record<string, any> = {
      deleted: 0,
      ...(date
        ? { date }
        : (() => {
            const today = new Date();
            const onlyDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            return { date: onlyDate };
          })()),
    };

    const result = await DB.Employees.findAndCountAll({
      where: employeeWhere,
      attributes: ['id', 'name', 'nik', 'department', 'position'],
      include: [
        {
          model: DB.Users,
          as: 'user',
          attributes: ['id', 'role', 'email'],
        },
        {
          model: DB.Attendances,
          as: 'attendances',
          where: attendanceWhere,
          required: false,
          order: [
            ['date', 'DESC'],
            ['time', 'DESC'],
          ],
          limit: 5,
        },
      ],
      order: [[sortBy, sortOrder]],
      offset,
      limit,
    });

    return paginateData(result, page, size);
  }

  public async createAttendance(data: CreateAttendanceDto, employeeData: Employee): Promise<Attendance> {
    const now = new Date();
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const time = now.toTimeString().split(' ')[0];

    const existing = await DB.Attendances.findOne({
      where: {
        employee_id: employeeData.id,
        date,
        deleted: 0,
      },
      order: [['time', 'DESC']],
    });

    if (existing?.dataValues?.status === 'CHECKOUT') {
      throw new HttpException(400, 'You have already checked out today.');
    }

    const attendanceType = existing ? 'CHECKOUT' : 'CHECKIN';

    return DB.Attendances.create({
      employee_id: employeeData.id,
      photo_url: data.photo_url || null,
      date,
      time,
      type: employeeData.working_type,
      status: attendanceType,
      note: data.note || null,
    });
  }
}
