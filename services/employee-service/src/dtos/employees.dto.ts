import { IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class CreateEmployeeDetailsDto {
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

export class UpdateEmployeeDto {
  @IsOptional()
  @IsString()
  public name?: string;

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

  @IsOptional()
  @IsString()
  public status?: string;
}
