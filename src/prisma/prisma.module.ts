import {Global, Module} from '@nestjs/common';
import {PrismaService} from './prisma.service';

@Global() //Service can be accessed globally throughout all modules
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
