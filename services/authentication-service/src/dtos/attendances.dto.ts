import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateAttendanceDto {
  @IsNotEmpty()
  @IsString()
  public photo_url: string;

  public note?: string;
}
