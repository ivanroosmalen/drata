import { IsNotEmpty, IsString, MaxLength, IsInt, IsDateString } from 'class-validator';

export class UpdateBookDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  title: string;

  @IsNotEmpty()
  @IsInt()
  authorId: number;

  @IsNotEmpty()
  @IsDateString()
  releaseDate: string;
}
