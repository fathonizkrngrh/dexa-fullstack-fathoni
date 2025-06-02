import { Attendance } from '@/interfaces/attendances.interface';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export type AttendanceCreationAttributes = Optional<Attendance, 'id'>;

export class AttendanceModel extends Model<Attendance, AttendanceCreationAttributes> implements Attendance {
  public id: number;
  public employee_id: number;
  public type: string;
  public status: string;
  public date: Date;
  public time: string;
  public photo_url: string;
  public note: string;
  public deleted: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof AttendanceModel {
  AttendanceModel.init(
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      employee_id: { type: DataTypes.BIGINT, allowNull: false },
      type: { type: DataTypes.STRING(100), allowNull: false },
      status: { type: DataTypes.STRING(20), allowNull: false },
      date: { type: DataTypes.DATEONLY, allowNull: false },
      time: { type: DataTypes.TIME, allowNull: false },
      photo_url: { type: DataTypes.TEXT },
      note: { type: DataTypes.TEXT },
      deleted: { type: DataTypes.TINYINT, defaultValue: 0 },
    },
    {
      tableName: 'attendances',
      sequelize,
      timestamps: true,
      underscored: true,
    },
  );

  return AttendanceModel;
}
