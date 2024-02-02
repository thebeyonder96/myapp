import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {SiteService} from './site.service';
import {SiteDto} from './dto/site.dto';
import {GetUser} from 'src/auth/decorator';
import {User} from '@prisma/client';
import {JwtGuard} from 'src/auth/guard';
import {HttpExceptionFilter} from 'src/config/error.filter';
import * as Cloudinary from 'cloudinary';
import {ConfigService} from '@nestjs/config';
import {FileInterceptor} from '@nestjs/platform-express';
import {FILE_NOT_FOUND} from 'src/constants/error';
import {memoryStorage} from 'multer';
import {ImageUpload} from 'src/config/interfaces';

@UseGuards(JwtGuard)
@Controller('site')
@ApiTags('Site')
@ApiBearerAuth()
@UseFilters(new HttpExceptionFilter())
export class SiteController {
  constructor(
    private siteService: SiteService,
    config: ConfigService,
  ) {
    Cloudinary.v2.config({
      cloud_name: config.get('CLOUD_NAME'),
      api_key: config.get('API_KEY'),
      api_secret: config.get('API_SECRET'),
    });
  }

  @Post()
  @ApiResponse({status: HttpStatus.CREATED})
  async addSite(@Body() dto: SiteDto, @GetUser() user: User) {
    try {
      const DTO = {...dto, user: {connect: {id: user.id}}};
      DTO.name = DTO.name.toLowerCase();
      console.log(DTO);

      const SITE = await this.siteService.addSite(DTO);
      return SITE;
    } catch (error) {
      throw new HttpException(error, HttpStatus.FORBIDDEN);
    }
  }

  @Put(':siteId')
  @ApiParam({name: 'siteId'})
  @ApiResponse({status: HttpStatus.ACCEPTED})
  async updateSite(@Param('siteId') siteId: string, @Body() dto: SiteDto) {
    console.log(siteId);
    // const {siteId} = siteId;
    const UPDATED = await this.siteService.updateSite(siteId, dto);
    return UPDATED;
  }

  @Delete(':siteId')
  @ApiParam({name: 'siteId'})
  @ApiResponse({status: HttpStatus.ACCEPTED})
  async deleteSite(@Param('siteId') siteId: string) {
    try {
      const DELETED = await this.siteService.deleteSite(siteId);
      return DELETED;
    } catch (error) {
      console.log(error);
    }
  }

  @Get(':siteId')
  @ApiParam({name: 'siteId'})
  @ApiResponse({status: HttpStatus.ACCEPTED})
  async getSite(@Param('siteId') siteId: string) {
    try {
      const SITE = await this.siteService.getSite(siteId);
      return SITE;
    } catch (error) {
      throw new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }

  @Post('/image/:siteId')
  @ApiParam({name: 'siteId'})
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
  @UseInterceptors(FileInterceptor('file', {storage: memoryStorage()}))
  async siteImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('siteId') siteId: string,
  ) {
    try {
      if (!file) throw new ForbiddenException(FILE_NOT_FOUND);
      const UPLOAD = new Promise((resolve, reject) => {
        Cloudinary.v2.uploader
          .upload_stream({resource_type: 'image'}, onDone)
          .end(file.buffer);

        function onDone(error, result) {
          if (error) {
            return reject({success: false, error});
          }
          return resolve({success: true, result});
        }
      });
      const IMAGE = (await UPLOAD) as ImageUpload;

      // const UPLOADs = await Cloudinary.v2.uploader.upload(fileBuffer, {
      //   folder: 'Site',
      // });
      const UPDATED = await this.siteService.siteImage(
        IMAGE.result.secure_url,
        siteId,
      );
      return UPDATED;
    } catch (error) {
      throw error;
    }
  }
}
