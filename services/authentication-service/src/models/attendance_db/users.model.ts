import { User } from '@/interfaces/users.interface';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export type UserCreationAttributes = Optional<User, 'id' | 'deleted' | 'created_at' | 'updated_at'>;

export class UserModel extends Model<User, UserCreationAttributes> implements User {
  public id!: number;
  public email!: string;
  public password!: string;
  public role!: string;
  public registered_by!: number;
  public deleted!: number;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

export default function (sequelize: Sequelize): typeof UserModel {
  UserModel.init(
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      password: { type: DataTypes.STRING(255), allowNull: false },
      role: { type: DataTypes.STRING(100), allowNull: false },
      registered_by: { type: DataTypes.BIGINT, allowNull: false },
      deleted: { type: DataTypes.TINYINT, defaultValue: 0 },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      tableName: 'users',
      sequelize,
      timestamps: false,
      underscored: true,
    },
  );

  return UserModel;
}
