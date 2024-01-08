import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {ApiBearerAuth, ApiParam, ApiResponse, ApiTags} from '@nestjs/swagger';
import {SiteService} from './site.service';
import {SiteDto} from './dto/site.dto';
import {GetUser} from 'src/auth/decorator';
import {User} from '@prisma/client';
import {JwtGuard} from 'src/auth/guard';
import {log} from 'util';

@UseGuards(JwtGuard)
@Controller('site')
@ApiTags('Site')
@ApiBearerAuth()
export class SiteController {
  constructor(private siteService: SiteService) {}

  @Post()
  @ApiResponse({status: HttpStatus.CREATED})
  async addSite(@Body() dto: SiteDto, @GetUser() user: User) {
    const DTO = {...dto, user: {connect: {id: user.id}}};
    DTO.name = DTO.name.toLowerCase();
    console.log(DTO);

    const SITE = await this.siteService.addSite(DTO);
    return SITE;
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
}
