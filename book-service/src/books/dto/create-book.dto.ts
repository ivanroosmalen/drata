import { IsNotEmpty, IsString, MaxLength, IsInt, IsDateString } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  title: string;

  @IsNotEmpty()
  @IsInt()
  authorId: number;

  @IsNotEmpty()
  @IsInt()
  publisherId: number;

  @IsNotEmpty()
  @IsDateString()
  releaseDate: string;
}
