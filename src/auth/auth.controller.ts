import {Body, Controller, HttpCode, HttpStatus, Post} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthDto} from './dto';
import {ApiBody, ApiResponse, ApiTags} from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiResponse({status: 200})
  async login(@Body() dto: AuthDto) {
    return await this.authService.login(dto);
  }

  @Post('register')
  async register(@Body() dto: AuthDto) {
    try {
      return await this.authService.register(dto);
    } catch (error) {
      throw error;
    }
  }
}
