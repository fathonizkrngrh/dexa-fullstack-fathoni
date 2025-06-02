import { Employee } from '@/interfaces/employees.interface';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export type EmployeeCreationAttributes = Optional<Employee, 'id' | 'deleted' | 'created_at' | 'updated_at'>;

export class EmployeeModel extends Model<Employee, EmployeeCreationAttributes> implements Employee {
  public id!: number;
  public user_id!: number;
  public name!: string;
  public nik!: string;
  public position?: string;
  public department?: string;
  public status!: string;
  public phone_number?: string;
  public address?: string;
  public join_date?: Date;
  public working_type?: string;
  public deleted?: number;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

export default function (sequelize: Sequelize): typeof EmployeeModel {
  EmployeeModel.init(
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      user_id: { type: DataTypes.BIGINT, allowNull: false },
      name: { type: DataTypes.STRING(100), allowNull: false },
      nik: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      position: { type: DataTypes.STRING(100) },
      department: { type: DataTypes.STRING(100) },
      status: { type: DataTypes.STRING(100), defaultValue: 'active' },
      phone_number: { type: DataTypes.STRING(20) },
      address: { type: DataTypes.TEXT },
      join_date: { type: DataTypes.DATE },
      working_type: { type: DataTypes.STRING(10), defaultValue: 'WFH' },
      deleted: { type: DataTypes.TINYINT, defaultValue: 0 },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      tableName: 'employees',
      sequelize,
      timestamps: false,
      underscored: true,
    },
  );

  return EmployeeModel;
}
