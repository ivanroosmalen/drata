import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateAuthorDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  lastName: string;
}
