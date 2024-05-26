import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MaxLength,
} from 'class-validator';

export class UserCreateInput {
  @ApiProperty({
    description: "The user's full name",
    maxLength: 64,
    minLength: 3,
    required: false,
    example: 'Luffy',
  })
  @IsOptional()
  @IsString()
  @Length(3, 64)
  name?: string;

  @ApiProperty({
    description: 'The avatar URL',
    maxLength: 256,
    required: false,
    example: 'https://image.com/avatars/luffy',
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(256)
  avatar?: string;
}
