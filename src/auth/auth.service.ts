import {ForbiddenException, Injectable} from '@nestjs/common';
import {PrismaService} from 'src/prisma/prisma.service';
import {hash, verify} from 'argon2';
import {AuthDto} from './dto';
import {
  EMAIL_EXISTS,
  EMAIL_NOT_EXISTS,
  WRONG_PASSWORD,
} from 'src/constants/error';
import {PrismaClientKnownRequestError} from '@prisma/client/runtime/library';
import {LOGIN_SUCCESS, REGISTER_SUCCESS} from 'src/constants/en';
import {User} from '@prisma/client';
import {ConfigService} from '@nestjs/config';
import {JwtService} from '@nestjs/jwt';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}
  async register(dto: AuthDto) {
    try {
      const HASH = await hash(dto.password);
      const EXIST = await this.prisma.user.findUnique({
        where: {email: dto.email},
      });
      const USER = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash: HASH,
        },
      });
      delete USER.hash;
      return REGISTER_SUCCESS;
    } catch (error) {
      console.log(error);
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') throw new ForbiddenException(EMAIL_EXISTS);
      }
    }
  }

  async login(dto: AuthDto) {
    const USER = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!USER) throw new ForbiddenException(EMAIL_NOT_EXISTS);
    const VERIFY_PASS = await verify(USER.hash, dto.password);
    if (!VERIFY_PASS) throw new ForbiddenException(WRONG_PASSWORD);
    const TOKEN = await this.generateToken(USER);
    return {LOGIN_SUCCESS, TOKEN};
  }

  async generateToken(dto: User) {
    const PAYLOAD = {
      sub: dto.id,
      email: dto.email,
    };

    const SECRET = this.config.get('SECRET_KEY');
    const TOKEN = await this.jwt.signAsync(PAYLOAD, {
      secret: SECRET,
      expiresIn: '1m',
    });
    return TOKEN;
  }
}
