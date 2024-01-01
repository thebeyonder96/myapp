import {ApiProperty} from '@nestjs/swagger';
import {Prisma} from '@prisma/client';
import {Allow} from 'class-validator';

type UserCreateInputWithoutHash = Omit<Prisma.UserCreateInput, 'hash'>;
export class UserDto implements UserCreateInputWithoutHash {
  @ApiProperty()
  @Allow()
  firstName?: string;

  @ApiProperty()
  @Allow()
  lastName?: string;

  @ApiProperty()
  @Allow()
  email: string;
}
