import Sequelize, { Transaction } from 'sequelize';
import { NODE_ENV } from '@config';
import { logger } from '@utils/logger';
import FileModel from '@/models/attendance_db/files.model';
import { DB_CONFIG } from '@/config/database.config';

const dbName = 'attendances';
const db = DB_CONFIG[dbName];

const sequelize = new Sequelize.Sequelize(db.database, db.username, db.password, {
  dialect: db.dialect,
  host: db.host,
  port: +db.port,
  timezone: '+07:00',
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    underscored: true,
    freezeTableName: true,
  },
  pool: {
    min: 0,
    max: 5,
  },
  logQueryParameters: NODE_ENV === 'development',
  logging: (query, time) => logger.info(`${time}ms ${query}`),
  benchmark: true,
});

sequelize.authenticate();

export const DB = {
  Files: FileModel(sequelize),
  sequelize,
  Sequelize,
  Transaction,
};
