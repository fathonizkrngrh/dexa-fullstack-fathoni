import { Request } from 'express';
import { User } from '@interfaces/users.interface';
import { Employee } from './employees.interface';

export interface DataStoredInToken {
  id: number;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  file: any;
  user: User;
  employee: Employee;
}
