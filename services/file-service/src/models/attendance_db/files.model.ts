// src/models/files.model.ts
import { File } from '@/interfaces/files.interface';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export type FileCreationAttributes = Optional<File, 'id' | 'folder' | 'deleted' | 'created_at' | 'updated_at'>;

export class FileModel extends Model<File, FileCreationAttributes> implements File {
  public id!: number;
  public url!: string;
  public folder: string;
  public public_id: string;
  public uploaded_by!: number;
  public deleted!: number;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

export default function (sequelize: Sequelize): typeof FileModel {
  FileModel.init(
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      url: { type: DataTypes.STRING(255), allowNull: false },
      folder: { type: DataTypes.STRING(100), allowNull: false },
      public_id: { type: DataTypes.STRING(100), allowNull: false },
      uploaded_by: { type: DataTypes.BIGINT, allowNull: false },
      deleted: { type: DataTypes.TINYINT, defaultValue: 0 },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      tableName: 'files',
      sequelize,
      timestamps: false,
      underscored: true,
    },
  );

  return FileModel;
}
