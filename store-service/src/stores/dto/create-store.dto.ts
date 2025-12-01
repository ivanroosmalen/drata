import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';

export class CreateStoreDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  name: string;

}

