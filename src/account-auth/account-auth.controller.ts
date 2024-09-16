import { Body, Controller, Logger, Post, Put } from '@nestjs/common';
import { AccountAuthService } from './account-auth.service';
import { AccessDTO } from './Dto/AccessDTO';
import { SendCodeDTO } from './Dto/SendCodeDTO';
import { UpdateDTO } from './Dto/UpdateDTO';

@Controller('account-auth')
export class AccountAuthController {
  constructor(readonly service: AccountAuthService) {  }

  logger = new Logger(AccountAuthController.name);

  @Post('login')
  async loginAccount(@Body() accessDto: AccessDTO):Promise<boolean> {
    const { email, password } = accessDto;
    return await this.service.login(email, password);
  }

  @Post('sendCode')
  async sendCode(@Body() sendCodeDto: SendCodeDTO): Promise<void> {
    const { email } = sendCodeDto;
    await this.service.sendRecoveryCode(email);
  }

  @Put('changePassword')
  async changePassword(@Body() updateDto: UpdateDTO): Promise<void> {
    const { newPassword, email, refactorCode } = updateDto;
    await this.service.changePassword(newPassword, email, refactorCode);
  }

}
