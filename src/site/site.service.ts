import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import {PrismaService} from 'src/prisma/prisma.service';
import {SiteDto} from './dto/site.dto';
import {SITE_ALREADY_EXIST, SITE_NOT_FOUND} from 'src/constants/error';

@Injectable()
export class SiteService {
  constructor(private prisma: PrismaService) {}

  async addSite(dto: SiteDto) {
    try {
      const EXIST = await this.prisma.site.findUnique({
        where: {name: dto.name.toLowerCase()},
      });
      if (EXIST)
        throw new HttpException(SITE_ALREADY_EXIST, HttpStatus.CONFLICT);
      return await this.prisma.site.create({data: dto});
    } catch (error) {
      console.log(error);
      throw new ForbiddenException(error);
    }
  }

  async updateSite(siteId: string, dto: Omit<SiteDto, 'name'>) {
    try {
      const {url, description} = dto;
      const EXIST = await this.prisma.site.findUnique({
        where: {id: siteId},
      });
      if (!EXIST) throw new HttpException(SITE_NOT_FOUND, HttpStatus.NOT_FOUND);
      return await this.prisma.site.update({
        where: {id: siteId, deleted: false},
        data: {url, description},
      });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteSite(siteId: string) {
    try {
      const EXIST = await this.prisma.site.findUnique({where: {id: siteId}});
      if (!EXIST) throw new HttpException(SITE_NOT_FOUND, HttpStatus.NOT_FOUND);
      return await this.prisma.site.update({
        where: {id: siteId},
        data: {deleted: true},
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getSite(siteId: string) {
    try {
      const EXIST = await this.prisma.site.findUnique({
        where: {id: siteId, deleted: false},
      });
      if (!EXIST) throw new HttpException(SITE_NOT_FOUND, HttpStatus.NOT_FOUND);
      return EXIST;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }

  async getAllSite(userId: string) {
    try {
      const EXIST = await this.prisma.site.findMany({
        where: {userId, deleted: false},
      });
      if (!EXIST) throw new HttpException(SITE_NOT_FOUND, HttpStatus.NOT_FOUND);
      return EXIST;
    } catch (error) {
      console.log(error);
    }
  }
}
