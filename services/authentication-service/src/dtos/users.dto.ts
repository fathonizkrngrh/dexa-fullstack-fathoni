import { Type } from 'class-transformer';
import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength, IsEnum, ValidateNested, IsOptional, IsPhoneNumber } from 'class-validator';

export class CreateUserWithEmployeeDto {
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsEnum(['EMPLOYEE', 'ADMIN'])
  public role: 'EMPLOYEE' | 'ADMIN';

  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsOptional()
  @IsString()
  public position?: string;

  @IsOptional()
  @IsString()
  public department?: string;

  @IsOptional()
  @IsPhoneNumber()
  public phone_number?: string;

  @IsOptional()
  @IsString()
  public address?: string;

  @IsNotEmpty()
  @IsString()
  public working_type?: string;
}

export class UpdateUserDto {
  @IsString()
  @MinLength(9)
  @MaxLength(32)
  public password: string;

  @IsString()
  public role: string;
}
