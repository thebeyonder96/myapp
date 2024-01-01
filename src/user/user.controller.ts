import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {User} from '@prisma/client';
import {GetUser} from 'src/auth/decorator';
import {JwtGuard} from 'src/auth/guard';
import {UserService} from './user.service';
import {UserDto} from './dto/';
import {
  DELETE_FAILED,
  NOT_AUTHORIZED,
  UPDATE_FAILED,
} from 'src/constants/error';
import {DELETE_SUCCESS, UPDATE_SUCCESS} from 'src/constants/en';
import {FileInterceptor} from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import {extname} from 'path';

export const storage = diskStorage({
  destination: './uploads',
  filename(req, file, callback) {
    callback(null, generateFilename(file));
  },
});

function generateFilename(file: Express.Multer.File) {
  return `${Date.now()}${extname(file.originalname)}`;
}

@UseGuards(JwtGuard)
@Controller('users')
@ApiTags('User')
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

  // Get user details
  @Get()
  @ApiResponse({status: 200})
  async getUser(@GetUser() user: User) {
    return user;
  }

  // Update user details

  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UserDto,
    @GetUser() user: User,
  ) {
    if (user.id != id) throw new ForbiddenException(NOT_AUTHORIZED);
    const UPDATED = await this.userService.updateUser(id, dto);
    if (!UPDATED) throw new ForbiddenException(UPDATE_FAILED);
    return UPDATE_SUCCESS;
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }

  // Delete user
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteUser(@Param('id') id: string, @GetUser() user: User) {
    if (user.id != id) throw new ForbiddenException(NOT_AUTHORIZED);
    const DELETED = await this.userService.deleteUser(id);
    if (!DELETED) throw new ForbiddenException(DELETE_FAILED);
    return DELETE_SUCCESS;
  }
}
