import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {AuthModule} from './auth/auth.module';
import {UserModule} from './user/user.module';
import {PasswordsModule} from './passwords/passwords.module';
import {PrismaModule} from './prisma/prisma.module';
import {ConfigModule} from '@nestjs/config';
import {SiteModule} from './site/site.module';
import {APP_FILTER} from '@nestjs/core';
import {HttpExceptionFilter} from './config/error.filter';

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
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
