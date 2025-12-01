import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';

export class UpdatePublisherDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  address?: string;
}

