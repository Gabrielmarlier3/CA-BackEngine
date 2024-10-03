import { Body, Controller, Get, HttpException, HttpStatus, Logger, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AccountUserService } from './account-user.service';
import { UpdateDTO } from './Dto/UpdateDTO';
import { CreateDTO } from './Dto/CreateDTO';
import { validateCnpj } from '../shared/helpers/validate-cnpj';
import { validateCPF } from '../shared/helpers/validate-cpf';
import { DeleteDTO } from './Dto/DeleteDTO';
import { AdminManagementDTO } from './Dto/AdminManagementDTO';
import { ChangeAddressDTO } from './Dto/ChangeAddressDTO';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard';

@ApiTags('Account User')
@Controller('account-user')
export class AccountUserController {
  constructor(private readonly service: AccountUserService) {}

  logger = new Logger('AccountUserController');

  @ApiOperation({ summary: 'Endpoint to get the account information' })
  @ApiResponse({ status: 201, description: 'Success.' })
  @ApiResponse({ status: 404, description: 'User account not found' })
  @ApiParam({ name: 'email', example: 'gabrielmarliere2005@gmail.com', description: 'User email address' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAccount(@Req() req: any) {
    const userId = req.user.userId;
    return await this.service.getAccountUserById(userId);
  }

  @ApiOperation({ summary: 'Endpoint to change the account information like a telephone number' })
  @ApiResponse({ status: 201, description: 'Success.' })
  @ApiResponse({ status: 400, description: 'Error updating account' })
  @UseGuards(JwtAuthGuard)
  @Put('updateAccount')
  async updateAccount(@Body() updateDto: UpdateDTO, @Req() req: any): Promise<void> {
    const { email, telephoneNumber, name } = updateDto;
    const userId = req.user.userId;

    await this.service.updateAccountUser(userId, email, name, telephoneNumber);
  }

  @ApiOperation({ summary: 'Endpoint to create the account' })
  @ApiResponse({ status: 201, description: 'Success.' })
  @ApiResponse({ status: 400, description: 'Error creating account' })
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

  @ApiOperation({ summary: 'Endpoint to update the account address, like changing a house number' })
  @ApiResponse({ status: 201, description: 'Success.' })
  @ApiResponse({ status: 400, description: 'Error updating account' })
  @UseGuards(JwtAuthGuard)
  @Put('changeAddress')
  async changeAddress(@Body() changeAddressDto: ChangeAddressDTO): Promise<void> {
    const { accountId, address } = changeAddressDto;
    this.logger.debug(accountId, address);
    await this.service.changeAddress(accountId, address);
  }

  @ApiOperation({ summary: 'Endpoint to deactivate the account' })
  @ApiResponse({ status: 201, description: 'Success.' })
  @ApiResponse({ status: 400, description: 'Error deactivate account, password don`t match' })
  @UseGuards(JwtAuthGuard)
  @Put('deactivateAccount')
  async deactivateAccount(@Body() deleteDto: DeleteDTO): Promise<void> {
    const { email, password } = deleteDto;
    await this.service.deactivateAccount(email, password);
  }

  @ApiOperation({ summary: 'Endpoint to add account admin role' })
  @ApiResponse({ status: 201, description: 'Success.' })
  @ApiResponse({ status: 400, description: 'fail to add admin, account not exist' })
  @ApiResponse({ status: 401, description: 'fail to add admin, user dont have privilege' })
  @Put('addAdmin')
  async addAdmin(@Body() adminManagement: AdminManagementDTO): Promise<void> {
    const { currentAdminEmail, targetAdminEmail } = adminManagement;
    await this.service.addAdmin(currentAdminEmail, targetAdminEmail);
  }

  @ApiOperation({ summary: 'Endpoint to remove account admin role' })
  @ApiResponse({ status: 201, description: 'Success.' })
  @ApiResponse({ status: 400, description: 'fail to add admin, account not exist' })
  @ApiResponse({ status: 401, description: 'fail to add admin, user dont have privilege' })
  @Put('removeAdmin')
  async removeAdmin(@Body() adminManagement: AdminManagementDTO): Promise<void> {
    const { currentAdminEmail, targetAdminEmail } = adminManagement;
    await this.service.removeAdmin(currentAdminEmail, targetAdminEmail);
  }
}
