import * as dotenv from 'dotenv';
import { Dialect } from 'sequelize';

dotenv.config();

interface DBConfig {
  username: string;
  password: string;
  host: string;
  database: string;
  port: number;
  ssl: boolean;
  dialect: Dialect;
  dialectOptions?: Record<string, any>;
  timezone?: string;
  logging?: boolean;
}

export const DB_CONFIG: Record<string, DBConfig> = {
  attendances: {
    username: process.env.DB_USER_ATTENDANCE || 'root',
    password: process.env.DB_PASSWORD_ATTENDANCE || 'fathoni',
    host: process.env.DB_HOST_ATTENDANCE || '127.0.0.1',
    database: process.env.DB_NAME_ATTENDANCE || 'dexa_attendances',
    port: parseInt(process.env.DB_PORT_ATTENDANCE) || 3306,
    ssl: false,
    dialect: 'mysql',
    dialectOptions: {
      timezone: process.env.TZ_SEQUELIZE,
    },
    timezone: 'Asia/Jakarta',
    logging: false,
  },
};
