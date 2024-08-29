import { Body, Controller, Get, HttpException, HttpStatus, Logger, Param, Post, Put } from '@nestjs/common';
import { AccountUserService } from './account-user.service';
import { UpdateDto } from './Dto/updateDto'
import { CreateDto } from './Dto/createDto';
import { validateCnpj } from '../shared/helpers/validate-cnpj';
import { validateCPF } from '../shared/helpers/validate-cpf';
import { DeleteDto } from './Dto/deleteDto';
import { AdminManagement } from './Dto/adminManagement';
import { ChangeAddressDto } from './Dto/changeAddressDto';

@Controller('account-user')
export class AccountUserController {

  constructor(private readonly service: AccountUserService) {}

  logger = new Logger('AccountUserController');

  @Get(':email')
  async getAccount(@Param('email') email: string) {
    return await this.service.getAccountUserByEmail(email);
  }

  @Put('updateAccount')
  async updateAccount(@Body() updateDto: UpdateDto):Promise<string> {
    try{
      const { accountId ,email, telephoneNumber, name } = updateDto;
      await this.service.updateAccountUser(accountId , email, name, telephoneNumber);
      return 'ok'
    }catch (e){
      throw new HttpException('Error updating profile', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('create')
  async createAccount(@Body() createDto: CreateDto):Promise<string> {
    const { name, password, email, cpfCnpj, telephone, isLegalPerson, address } = createDto;
    if (isLegalPerson) {
      if (!validateCnpj(cpfCnpj)) {
        throw new HttpException('Invalid CNPJ.', HttpStatus.BAD_REQUEST)
      }
    }

    if (!validateCPF(cpfCnpj)) {
      throw new HttpException('Invalid CPF.', HttpStatus.BAD_REQUEST)
    }
    const clearCpfCnpj = cpfCnpj.replace(/[^\d]/g, '')

    await this.service.createAccountUser(name, password, email, telephone, clearCpfCnpj, isLegalPerson, address );
    return 'ok';
  }

  @Put('changeAddress')
  async changeAddress(@Body() changeAddressDto: ChangeAddressDto):Promise<string> {
    const { accountId , address } = changeAddressDto
    this.logger.debug(accountId, address );
    await this.service.changeAddress( accountId , address)
    return 'ok'
  }

  @Put('deactivateAccount')
  async deactivateAccount(@Body() deleteDto: DeleteDto):Promise<string> {
    const { email, password } = deleteDto;
    await this.service.deactivateAccount(email, password)
    return 'ok'
  }

  @Put('addAdmin')
  async addAdmin(@Body() adminManagement: AdminManagement): Promise<string> {
    const { currentAdminEmail, targetAdminEmail} = adminManagement;

    await this.service.addAdmin(currentAdminEmail, targetAdminEmail)

    return 'ok';
  }

  @Put('removeAdmin')
  async removeAdmin(@Body() adminManagement: AdminManagement): Promise<string> {
    const { currentAdminEmail, targetAdminEmail} = adminManagement;

    await this.service.removeAdmin(currentAdminEmail, targetAdminEmail)

    return 'ok';
  }

}
