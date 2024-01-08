import {ApiProperty} from '@nestjs/swagger';
import {Allow} from 'class-validator';

export class SiteDto {
  @Allow()
  userId: string;

  @Allow()
  @ApiProperty()
  name: string;

  @Allow()
  @ApiProperty()
  url: string;

  @Allow()
  @ApiProperty()
  description?: string;

  @Allow()
  image?: string;
}
