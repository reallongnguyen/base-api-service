import { ApiProperty } from '@nestjs/swagger';

export interface Pagination {
  limit: number;
  offset: number;
  total: number;
}

export default class Collection<T> {
  @ApiProperty({
    description: 'List paginated data',
  })
  edges: T[];

  @ApiProperty({
    description: 'Pagination information',
    example: {
      limit: 10,
      offset: 0,
      total: 100,
    },
  })
  pagination: Pagination;
}
