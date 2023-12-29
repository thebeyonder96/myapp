import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {PrismaService} from 'src/prisma/prisma.service';

export type IPayload = {
  sub: string;
  email: string;
  iat: number;
  exp: number;
};
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('SECRET_KEY'),
    });
  }

  async validate(payload: IPayload) {
    const USER = await this.prisma.user.findUnique({
      where: {id: payload.sub},
    });
    delete USER.hash;
    return USER;
  }
}
