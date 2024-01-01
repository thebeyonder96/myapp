import {ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, IsString, IsStrongPassword} from 'class-validator';

export class AuthDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  // @IsStrongPassword()
  password: string;
}
