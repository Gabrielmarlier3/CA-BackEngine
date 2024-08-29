import { Body, Controller, HttpStatus, Logger, Post, Put } from '@nestjs/common';
import { AccountAuthService } from './account-auth.service';
import { AccessDto } from './Dto/AccessDto';
import { SendCodeDto } from './Dto/sendCodeDto';
import { UpdadeDto } from './Dto/updadeDto';

@Controller('account-auth')
export class AccountAuthController {
  constructor(readonly service: AccountAuthService) {
  }
  logger = new Logger(AccountAuthController.name);

  @Post('login')
  async loginAccount(@Body() accessDto: AccessDto){
    try{
      const {email, password} = accessDto;
      return await this.service.login(email, password);
    }
    catch(error){
      this.logger.error(error);
    }
  }

  @Post('sendCode')
  async sendCode(@Body() sendCodeDto :SendCodeDto):Promise<string> {
    try{
      const { email } = sendCodeDto;
      await this.service.sendRecoveryCode(email)
      return 'ok';
    }catch(error){
      this.logger.error(error);
      throw HttpStatus.BAD_REQUEST;
    }
  }

  @Put('changePassword')
  async changePassword(@Body() updateDto: UpdadeDto):Promise<string>{
    try {
      const { newPassword, email, refactorCode } = updateDto;
      await this.service.changePassword(newPassword, email, refactorCode);
      return 'ok';
    }catch(error){
      this.logger.error(error);
      throw HttpStatus.BAD_REQUEST;
    }
  }

}
