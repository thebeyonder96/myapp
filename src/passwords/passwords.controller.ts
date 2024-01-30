import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {ApiBearerAuth, ApiBody, ApiParam, ApiTags} from '@nestjs/swagger';
import {PasswordDto} from './dto/password.dto';
import {PasswordsService} from './passwords.service';
import {JwtGuard} from 'src/auth/guard';
import {
  CREATE_FAILED,
  DELETE_FAILED,
  PASS_NOT_FOUND,
} from 'src/constants/error';
import {DELETE_SUCCESS, SUCCESS} from 'src/constants/en';
import {CryptoService} from 'src/utils/crypto';
import {HttpExceptionFilter} from 'src/config/error.filter';

@UseGuards(JwtGuard)
@ApiTags('Password')
@ApiBearerAuth()
@Controller('passwords')
@UseFilters(new HttpExceptionFilter())
export class PasswordsController {
  constructor(
    private password: PasswordsService,
    private crypto: CryptoService,
  ) {}

  @Post(':siteId')
  @ApiParam({name: 'siteId'})
  async addPassword(@Body() dto: PasswordDto, @Param('siteId') siteId: string) {
    try {
      dto.password = this.crypto.encrypt(dto.password);
      const DTO = {...dto, site: {connect: {id: siteId}}};
      const PASSWORD = await this.password.addPassword(DTO);
      if (!PASSWORD)
        throw new HttpException(CREATE_FAILED, HttpStatus.UNPROCESSABLE_ENTITY);
      return SUCCESS;
    } catch (error) {
      throw new HttpException(error, 403);
    }
  }

  @Put(':id')
  @ApiParam({name: 'id', type: 'string'})
  async updatePassword(@Body() dto: PasswordDto, @Param('id') id: string) {
    dto.password = this.crypto.encrypt(dto.password);
    const UPDATE = await this.password.updatePassword(id, dto);
    return UPDATE;
  }

  @Delete(':id')
  @ApiParam({name: 'id'})
  async deletePassword(@Param('id') id: string) {
    const DELETED = await this.password.deletePassword(id);
    if (!DELETED) throw new HttpException(DELETE_FAILED, 403);
    return DELETE_SUCCESS;
  }

  @Get(':id')
  @ApiParam({name: 'id'})
  async getPassword(@Param('id') id: string) {
    const PASSWORD = await this.password.getPassword(id);
    if (!PASSWORD) throw new HttpException(PASS_NOT_FOUND, 404);
    return PASSWORD;
  }

  @Get('all/:siteId')
  @ApiParam({name: 'siteId'})
  async getAllPassword(@Param('siteId') siteId: string) {
    const PASSWORDS = await this.password.getAllPassword(siteId);
    if (!PASSWORDS) throw new HttpException(PASS_NOT_FOUND, 404);
    return PASSWORDS;
  }
}
