import { IsString, IsNotEmpty } from 'class-validator';

export class UploadFilesDto {
  @IsNotEmpty()
  @IsString()
  public foldername: string;
}

export class DeleteFilesDto {
  @IsNotEmpty()
  @IsString()
  public public_id: string;
}
