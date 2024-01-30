import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class CryptoService {
  secretKey: string;
  constructor(private config: ConfigService) {}
  encrypt(password: string) {
    const ENCRYPTED = CryptoJS.AES.encrypt(
      password,
      this.config.get('ENCRYPTION_KEY'),
    );
    return ENCRYPTED.toString();
  }

  decrypt(password: string) {
    const DECRYPTED = CryptoJS.AES.decrypt(
      password,
      this.config.get('ENCRYPTION_KEY'),
    );
    return DECRYPTED.toString(CryptoJS.enc.Utf8);
  }
}
