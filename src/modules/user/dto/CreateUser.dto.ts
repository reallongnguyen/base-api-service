import {
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateUserDTO {
  @IsOptional()
  @IsString()
  @Length(3, 64)
  name?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(256)
  avatar?: string;
}
