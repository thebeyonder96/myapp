import {Injectable} from '@nestjs/common';
import {PrismaService} from 'src/prisma/prisma.service';
import {} from 'crypto';

@Injectable()
export class PasswordsService {
  constructor(private prisma: PrismaService) {}

  async addPassword() {}
  async updatePassword() {}
  async deletePassword() {}
  async getPassword() {}
  async getAllPassword() {}
}
