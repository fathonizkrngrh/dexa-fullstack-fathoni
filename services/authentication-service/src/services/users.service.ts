import { Service } from 'typedi';
import { DB } from '@/database/mysql/attendance.db';
import { HttpException } from '@/exceptions/httpException';
import { User } from '@interfaces/users.interface';
import { UpdateUserDto } from '@/dtos/users.dto';
import { hashPassword } from '@/utils/password';

@Service()
export class UserService {
  public async findAllUser(): Promise<User[]> {
    const allUser: User[] = await DB.Users.findAll();
    return allUser;
  }

  public async findUserById(userId: number): Promise<User> {
    const findUser: User = await DB.Users.findByPk(userId);
    if (!findUser) throw new HttpException(400, "User doesn't exist");

    return findUser;
  }

  public async updateUser(userId: number, userData: UpdateUserDto): Promise<User> {
    const findUser: User = await DB.Users.findByPk(userId);
    if (!findUser) throw new HttpException(400, "User doesn't exist");

    const hashedPassword = await hashPassword(userData.password);
    await DB.Users.update({ ...userData, password: hashedPassword }, { where: { id: userId } });

    const updateUser: User = await DB.Users.findByPk(userId);
    return updateUser;
  }

  public async deleteUser(userId: number): Promise<User> {
    const findUser: User = await DB.Users.findByPk(userId);
    if (!findUser) throw new HttpException(400, "User doesn't exist");

    await DB.Users.destroy({ where: { id: userId } });

    return findUser;
  }
}
