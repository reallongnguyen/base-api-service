import { ApiProperty } from '@nestjs/swagger';
import { User as UserType } from '@prisma/client';

export class User implements UserType {
  @ApiProperty({
    example: '1',
  })
  id: number;

  @ApiProperty({
    example: '018fb0ab-f1e3-7bd7-961c-8b14b479a710',
  })
  authId: string;

  @ApiProperty({
    example: 'Luffy',
    required: false,
  })
  name: string;

  @ApiProperty({
    example: 'https://image.com/avatars/luffy',
    required: false,
  })
  avatar: string;
}
