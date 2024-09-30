import { Body, Controller, Logger, Post, Put, UseGuards } from '@nestjs/common';
import { AccountAuthService } from './account-auth.service';
import { AccessDTO } from './Dto/AccessDTO';
import { SendCodeDTO } from './Dto/SendCodeDTO';
import { UpdateAuthDTO } from './Dto/UpdateAuthDTO';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard';

@ApiTags('Account Auth')
@Controller('account-auth')
export class AccountAuthController {
  constructor(readonly service: AccountAuthService) {  }

  logger = new Logger(AccountAuthController.name);

  @ApiOperation({ summary: 'Endpoint to login on the application' })
  @ApiResponse({ status: 201, description: 'Success logged in.' })
  @ApiResponse({ status: 401, description: 'Credential invalid.' })
  @Post('login')
  async loginAccount(@Body() accessDto: AccessDTO): Promise<{ access_token: string }> {
    const { email, password } = accessDto;
    return await this.service.login(email, password);
  }

  @ApiOperation({ summary: 'Send an email to get the 5 random number, use the number to change password' })
  @ApiResponse({ status: 201, description: 'Success.' })
  @ApiResponse({ status: 400, description: 'Account not Found' })
  @Post('sendCode')
  async sendCode(@Body() sendCodeDto: SendCodeDTO): Promise<void> {
    const { email } = sendCodeDto;
    await this.service.sendRecoveryCode(email);
  }

  @ApiOperation({ summary: 'Endpoint to change password, use sendCode endpoint before use this one' })
  @ApiResponse({ status: 201, description: 'Success.' })
  @ApiResponse({ status: 400, description: 'Refactor code does not match in database' })
  @UseGuards(JwtAuthGuard)
  @Put('changePassword')
  async changePassword(@Body() updateDto: UpdateAuthDTO): Promise<void> {
    const { newPassword, email, refactorCode } = updateDto;
    await this.service.changePassword(newPassword, email, refactorCode);
  }

}
