import {Logger, Module} from '@nestjs/common';
import {PasswordsService} from './passwords.service';
import {PasswordsController} from './passwords.controller';
import {CryptoService} from 'src/utils/crypto';

@Module({
  providers: [PasswordsService, CryptoService, Logger],
  controllers: [PasswordsController],
})
export class PasswordsModule {}
