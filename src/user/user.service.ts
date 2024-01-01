import {Injectable} from '@nestjs/common';
import {PrismaService} from 'src/prisma/prisma.service';
import {UserDto} from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async updateUser(userId: string, dto: UserDto) {
    return this.prisma.user.update({where: {id: userId}, data: dto});
  }

  async deleteUser(userId: string) {
    return this.prisma.user.delete({where: {id: userId}});
  }
}
