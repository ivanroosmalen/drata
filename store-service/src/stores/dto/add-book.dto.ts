import { IsNotEmpty, IsInt } from 'class-validator';

export class AddBookDto {
  @IsNotEmpty()
  @IsInt()
  bookId: number;
}

