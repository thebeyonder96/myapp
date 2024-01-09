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
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {ApiBearerAuth, ApiParam, ApiResponse, ApiTags} from '@nestjs/swagger';
import {SiteService} from './site.service';
import {SiteDto} from './dto/site.dto';
import {GetUser} from 'src/auth/decorator';
import {User} from '@prisma/client';
import {JwtGuard} from 'src/auth/guard';
import {log} from 'util';
import {HttpExceptionFilter} from 'src/config/error.filter';

@UseGuards(JwtGuard)
@Controller('site')
@ApiTags('Site')
@ApiBearerAuth()
@UseFilters(new HttpExceptionFilter())
export class SiteController {
  constructor(private siteService: SiteService) {}

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
}
