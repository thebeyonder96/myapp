import {
  ForbiddenException,
  HttpException,
  Injectable,
  Logger,
  UseFilters,
} from '@nestjs/common';
import {PrismaService} from 'src/prisma/prisma.service';
import {PasswordDto} from './dto/password.dto';
import {
  PASS_NOT_FOUND,
  SITE_NOT_FOUND,
  USER_OR_EMAIL_EXIST,
} from 'src/constants/error';
import {HttpExceptionFilter} from 'src/config/error.filter';

@Injectable()
@UseFilters(new HttpExceptionFilter())
export class PasswordsService {
  constructor(
    private prisma: PrismaService,
    private logger: Logger,
  ) {}

  async addPassword(dto: PasswordDto) {
    try {
      const EXIST = await this.prisma.password.findFirst({
        where: {
          OR: [{email: dto.email}, {username: dto.email}],
          deleted: false,
        },
      });
      if (EXIST) throw new ForbiddenException(USER_OR_EMAIL_EXIST);
      const PASSWORD = await this.prisma.password.create({
        data: dto,
      });
      return PASSWORD;
    } catch (error) {
      this.logger.error(error);
    }
  }
  async updatePassword(id: string, dto: PasswordDto) {
    const PASSWORD = await this.prisma.password.findUnique({
      where: {
        id,
        deleted: false,
      },
    });
    if (!PASSWORD) throw new HttpException(PASS_NOT_FOUND, 404);

    const UPDATED = await this.prisma.password.update({
      where: {
        id,
      },
      data: dto,
    });
    return UPDATED;
  }
  async deletePassword(id: string) {
    const PASSWORD = await this.prisma.password.findUnique({
      where: {
        id,
        deleted: false,
      },
    });
    if (!PASSWORD) throw new HttpException(PASS_NOT_FOUND, 404);
    const DELETED = await this.prisma.password.delete({
      where: {
        id,
      },
    });
    return DELETED;
  }

  async getPassword(id: string) {
    const PASSWORD = await this.prisma.password.findUnique({
      where: {
        id,
        deleted: false,
      },
    });
    if (!PASSWORD) throw new HttpException(PASS_NOT_FOUND, 404);
    return PASSWORD;
  }

  async getAllPassword(siteId: string) {
    console.log({siteId});

    const SITE = await this.prisma.site.findFirst({
      where: {
        id: siteId,
        deleted: false,
      },
    });
    if (!SITE) throw new HttpException(SITE_NOT_FOUND, 404);
    const PASSWORDS = await this.prisma.password.findMany({
      where: {
        siteId,
        deleted: false,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
    return PASSWORDS;
  }
}
