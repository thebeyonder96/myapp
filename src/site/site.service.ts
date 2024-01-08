import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {PrismaService} from 'src/prisma/prisma.service';
import {SiteDto} from './dto/site.dto';
import {SITE_ALREADY_EXIST, SITE_NOT_FOUND} from 'src/constants/error';

@Injectable()
export class SiteService {
  constructor(private prisma: PrismaService) {}

  async addSite(dto: SiteDto) {
    const EXIST = await this.prisma.site.findUnique({
      where: {name: dto.name.toLowerCase()},
    });
    if (EXIST) throw new HttpException(SITE_ALREADY_EXIST, HttpStatus.CONFLICT);
    return await this.prisma.site.create({data: dto});
  }

  async updateSite(siteId: string, dto: Omit<SiteDto, 'name'>) {
    const {url, description} = dto;
    const EXIST = await this.prisma.site.findUnique({
      where: {id: siteId},
    });
    if (!EXIST) throw new HttpException(SITE_NOT_FOUND, HttpStatus.NOT_FOUND);
    return await this.prisma.site.update({
      where: {id: siteId},
      data: {url, description},
    });
  }
}
