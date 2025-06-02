import { Service } from 'typedi';
import { DB } from '@/database/mysql/attendance.db';
import { HttpException } from '@/exceptions/HttpException';
import { User } from '@interfaces/users.interface';
import { createCookie, createToken } from '@/utils/token';
import { comparePassword, generatePassword, hashPassword } from '@/utils/password';
import { CreateUserWithEmployeeDto } from '@/dtos/users.dto';
import { Transaction } from 'sequelize';
import { generateEmployeeNIK } from '@/utils/employee';
import { Employee } from '@/interfaces/employees.interface';
import { LoginDto } from '@/dtos/auth.dto';
import { RedisUtil } from '@/utils/cache';
import { CONFIG } from '@/config';
import e from 'express';

@Service()
export class AuthService {
  public async registerEmployee(userData: CreateUserWithEmployeeDto, userId: number): Promise<{ user: User; employee: Employee }> {
    const user: User = await DB.Users.findOne({ where: { email: userData.email } });
    if (user) throw new HttpException(400, `This email ${userData.email} already exists`);

    // const generatedPassword = await generatePassword(userData.name, '123');
    const generatedPassword = '12345678';

    const hashedPassword = await hashPassword(generatedPassword);

    const transaction: Transaction = await DB.sequelize.transaction();
    try {
      const createUser = await DB.Users.create(
        { email: userData.email, registered_by: userId, password: hashedPassword, role: 'EMPLOYEE' },
        { transaction },
      );

      const createEmployee = await DB.Employees.create(
        {
          user_id: createUser.dataValues.id,
          ...userData,
          join_date: new Date(),
          nik: generateEmployeeNIK(new Date().toISOString().slice(0, 10)),
        },
        { transaction },
      );

      await transaction.commit();

      return { user: { ...createUser.dataValues, password: generatedPassword }, employee: createEmployee };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async login(userData: LoginDto): Promise<{ cookie: string; token: string; user: User; employee: Employee }> {
    const user: User = await DB.Users.findOne({ where: { email: userData.email } });
    if (!user) throw new HttpException(400, `This email ${userData.email} was not found`);

    const isPasswordMatching: boolean = await comparePassword(userData.password, user.password);
    if (!isPasswordMatching) throw new HttpException(400, 'Password not matching');

    const employee: Employee = await DB.Employees.findOne({ where: { user_id: user.id } });

    const tokenData = createToken(user);
    const cookie = createCookie(tokenData);

    const res = { user, token: tokenData, employee };

    RedisUtil.del(CONFIG.MODULE_NAME, 'LOGIN', user.id.toString());
    RedisUtil.set(CONFIG.MODULE_NAME, 'LOGIN', user.id.toString(), res, 60 * 60 * 24);

    return { cookie, user, employee, token: tokenData.token };
  }

  public async logout(userData: User): Promise<User> {
    const findUser: User = await DB.Users.findOne({ where: { email: userData.email, password: userData.password } });
    if (!findUser) throw new HttpException(400, "User doesn't exist");

    return findUser;
  }
}
