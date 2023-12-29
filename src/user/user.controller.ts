import {Controller, Get, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ApiBearerAuth, ApiResponse, ApiTags} from '@nestjs/swagger';
import {User} from '@prisma/client';
import {GetUser} from 'src/auth/decorator';
import {JwtGuard} from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor() {}

  @Get()
  @ApiBearerAuth()
  @ApiTags('USer')
  @ApiResponse({status: 200})
  async getUser(@GetUser() user: User) {
    return user;
  }
}
