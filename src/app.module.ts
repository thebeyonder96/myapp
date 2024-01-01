import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {AuthModule} from './auth/auth.module';
import {UserModule} from './user/user.module';
import {PasswordsModule} from './passwords/passwords.module';
import {PrismaModule} from './prisma/prisma.module';
import {ConfigModule} from '@nestjs/config';
import { SiteModule } from './site/site.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PasswordsModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SiteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
