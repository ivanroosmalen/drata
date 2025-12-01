import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';

export class UpdateStoreDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  name: string;
}

