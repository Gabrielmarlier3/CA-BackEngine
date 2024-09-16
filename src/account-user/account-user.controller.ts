import { Body, Controller, Get, HttpException, HttpStatus, Logger, Param, Post, Put } from '@nestjs/common';
import { AccountUserService } from './account-user.service';
import { UpdateDTO } from './Dto/UpdateDTO';
import { CreateDTO } from './Dto/CreateDTO';
import { validateCnpj } from '../shared/helpers/validate-cnpj';
import { validateCPF } from '../shared/helpers/validate-cpf';
import { DeleteDTO } from './Dto/DeleteDTO';
import { AdminManagementDTO } from './Dto/AdminManagementDTO';
import { ChangeAddressDTO } from './Dto/ChangeAddressDTO';

@Controller('account-user')
export class AccountUserController {

  constructor(private readonly service: AccountUserService) {
  }

  logger = new Logger('AccountUserController');

  @Get(':email')
  async getAccount(@Param('email') email: string) {
    return await this.service.getAccountUserByEmail(email);
  }

  @Put('updateAccount')
  async updateAccount(@Body() updateDto: UpdateDTO): Promise<void> {
    const { accountId, email, telephoneNumber, name } = updateDto;
    await this.service.updateAccountUser(accountId, email, name, telephoneNumber);
  }

  @Post('create')
  async createAccount(@Body() createDto: CreateDTO): Promise<void> {
    const { name, password, email, cpfCnpj, telephone, isLegalPerson, address } = createDto;
    if (isLegalPerson) {
      if (!validateCnpj(cpfCnpj)) {
        throw new HttpException('Invalid CNPJ.', HttpStatus.BAD_REQUEST);
      }
    }

    if (!validateCPF(cpfCnpj)) {
      throw new HttpException('Invalid CPF.', HttpStatus.BAD_REQUEST);
    }
    const clearCpfCnpj = cpfCnpj.replace(/[^\d]/g, '');

    await this.service.createAccountUser(name, password, email, telephone, clearCpfCnpj, isLegalPerson, address);
  }

  @Put('changeAddress')
  async changeAddress(@Body() changeAddressDto: ChangeAddressDTO): Promise<void> {
    const { accountId, address } = changeAddressDto;
    this.logger.debug(accountId, address);
    await this.service.changeAddress(accountId, address);
  }

  @Put('deactivateAccount')
  async deactivateAccount(@Body() deleteDto: DeleteDTO): Promise<void> {
    const { email, password } = deleteDto;
    await this.service.deactivateAccount(email, password);
  }

  @Put('addAdmin')
  async addAdmin(@Body() adminManagement: AdminManagementDTO): Promise<void> {
    const { currentAdminEmail, targetAdminEmail } = adminManagement;
    await this.service.addAdmin(currentAdminEmail, targetAdminEmail);
  }

  @Put('removeAdmin')
  async removeAdmin(@Body() adminManagement: AdminManagementDTO): Promise<void> {
    const { currentAdminEmail, targetAdminEmail } = adminManagement;
    await this.service.removeAdmin(currentAdminEmail, targetAdminEmail);
  }

}
