import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsOptional()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}
