import { ApiProperty } from '@nestjs/swagger';

export class Pagination {
  @ApiProperty({
    type: 'number',
    example: 20,
  })
  limit: number;

  @ApiProperty({
    type: 'number',
    example: 0,
  })
  offset: number;

  @ApiProperty({
    type: 'number',
    example: 100,
  })
  total: number;
}

export default class Collection<T> {
  @ApiProperty({
    description: 'List paginated data',
  })
  edges: T[];

  @ApiProperty({
    description: 'Pagination information',
  })
  pagination: Pagination;
}
