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
  FILE_NOT_FOUND,
  NOT_AUTHORIZED,
  UPDATE_FAILED,
} from 'src/constants/error';
import {DELETE_SUCCESS, UPDATE_SUCCESS} from 'src/constants/en';
import {FileInterceptor} from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import {extname} from 'path';
import * as path from 'path';
import * as Cloudinary from 'cloudinary';
import {ConfigService} from '@nestjs/config';
import * as admin from 'firebase-admin';
import * as uuid from 'uuid';

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
  constructor(
    private userService: UserService,
    config: ConfigService,
  ) {
    Cloudinary.v2.config({
      cloud_name: config.get('CLOUD_NAME'),
      api_key: config.get('API_KEY'),
      api_secret: config.get('API_SECRET'),
    });
  }

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

  // Upload profile picture
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
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User,
  ) {
    if (!file) throw new ForbiddenException(FILE_NOT_FOUND);
    const UPLOAD = await Cloudinary.v2.uploader.upload(file.path, {
      folder: 'Profile',
    });
    this.userService.updateUser(user.id, {
      email: user.email,
      profile_pic: UPLOAD.secure_url,
    });
    return UPLOAD.secure_url;
  }

  // Upload profile picture
  @Post('/pic')
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
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User,
  ) {
    if (!file) throw new ForbiddenException(FILE_NOT_FOUND);
    const SERVICE_ACCOUNT = path.join(
      __dirname,
      '../../firebase-adminsdk-o7zp1-29aaba19d4.json',
    );
    admin.initializeApp({
      credential: admin.credential.cert(SERVICE_ACCOUNT),
      storageBucket: 'gs://in-hout.appspot.com',
    });
    const BUCKET = admin.storage().bucket();
    const UPLOAD = await BUCKET.upload(file.path, {
      metadata: {
        firebaseStorageDownloadTokens: uuid.v4(),
      },
    });
    const [url] = await UPLOAD[0].getSignedUrl({
      action: 'read',
      expires: '03-09-2030', // Set the expiration date for the signed URL (optional)
    });

    return url;
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
