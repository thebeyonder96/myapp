import {ApiProperty} from '@nestjs/swagger';
import {Allow} from 'class-validator';

export class PasswordDto {
  siteId: string;

  @Allow()
  @ApiProperty()
  username?: string;

  @Allow()
  @ApiProperty()
  email?: string;

  @Allow()
  @ApiProperty()
  password: string;

  @Allow()
  @ApiProperty()
  description?: string;
}
