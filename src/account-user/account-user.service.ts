import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AccountUserModel } from './account-user.model';
import { InjectModel } from '@nestjs/sequelize';
import { AccountAuthModel } from '../account-auth/account-auth.model';
import { AccountAuthService } from '../account-auth/account-auth.service';
import { Md5 } from 'ts-md5';
import { IAddress } from './interface/IAddress';
import { Op } from 'sequelize';

@Injectable()
export class AccountUserService {
  constructor(
    @InjectModel(AccountUserModel)
    private accountModel: typeof AccountUserModel,
    private readonly accountAuthService: AccountAuthService,
  ) {}

  logger = new Logger(AccountUserService.name);

  async getAccountUserByCpfCnpj(cpfCnpj: string): Promise<AccountUserModel> {
    const account = await this.accountModel.findOne({
      where: {
        cpfCnpj: cpfCnpj,
      },
    });

    if (account) {
      return account;
    }
  }

  async getAccountUserById(userId: number) {
    const account = this.accountModel.findOne({
      where: {
        id: userId,
      },
    });
    if (account) {
      return account;
    }
    this.logger.error(`Account user not found`);
  }

  async getAccountUserByEmail(email: string) {
    const account = this.accountModel.findOne({
      where: {
        email: email,
      },
    });
    if (account) {
      return account;
    }
    this.logger.error(`User account not found`);
    throw new HttpException('User account not found', HttpStatus.NOT_FOUND);
  }

  async createAccountUser(
    username: string,
    password: string,
    email: string,
    telephone: string,
    cpfCnpj: string,
    isLegalPerson: boolean,
    address: IAddress,
  ): Promise<void> {
    const existingAccount = await this.accountModel.findOne({
      where: {
        [Op.or]: [
          { cpfCnpj: cpfCnpj },
          { email: email },
          { telephoneNumber: telephone },
        ],
      },
    });

    if (existingAccount) {
      if (existingAccount.cpfCnpj === cpfCnpj) {
        throw new HttpException(
          'Account with this CPF/CNPJ already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (existingAccount.email === email) {
        throw new HttpException(
          'Account with this email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (existingAccount.telephoneNumber === telephone) {
        throw new HttpException(
          'Account with this telephone number already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const newAccount = await this.accountModel.create({
      name: username,
      email: email,
      cpfCnpj: cpfCnpj,
      telephoneNumber: telephone,
      isLegalPerson: isLegalPerson,
      address,
    });
    if (newAccount) {
      await this.accountAuthService.createPassword(password, newAccount.id);
    }
  }

  async savePagBankToken(
    cpfCnpj: string,
    pagBankToken: string,
    lastFourDigits: string,
    expMonth: number,
    expYear: number,
  ): Promise<void> {
    const account = await this.accountModel.findOne({
      where: {
        cpfCnpj: cpfCnpj,
      },
    });

    if (account && pagBankToken && lastFourDigits && expMonth && expYear) {
      await account.update({
        card: {
          pagBankToken,
          lastFourDigits,
          expMonth,
          expYear,
        },
      });
    }
  }

  async updateAccountUser(
    accountId: number,
    email?: string,
    name?: string,
    telephoneNumber?: string,
  ): Promise<void> {
    const transaction = await this.accountModel.sequelize.transaction();

    try {
      const account = await this.getAccountUserById(accountId);

      if (account) {
        const updateData: any = {};

        if (email !== undefined) {
          updateData.email = email;
        }

        if (telephoneNumber !== undefined) {
          updateData.telephoneNumber = telephoneNumber;
        }

        if (name !== undefined) {
          updateData.name = name;
        }

        await account.update(updateData, { transaction });
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      this.logger.error('Error updating account: ', error);
      throw new HttpException('Error updating account', HttpStatus.BAD_REQUEST);
    }
  }

  async changeAddress(accountId: number, address: IAddress): Promise<void> {
    const account = await this.getAccountUserById(accountId);

    if (account) {
      account.address = address;
      return;
    }

    throw new HttpException('fail to change address', HttpStatus.BAD_REQUEST);
  }

  async deactivateAccount(email: string, password: string): Promise<void> {
    const account = await this.accountModel.findOne({
      where: {
        email: email,
      },
      include: [
        {
          model: AccountAuthModel,
          as: 'accountAuth',
        },
      ],
    });

    if (account.accountAuth.password == Md5.hashStr(password)) {
      await account.update({
        isDeleted: true,
      });
      return;
    }
    throw new HttpException(
      'fail to deactivate account, password don`t match',
      HttpStatus.BAD_REQUEST,
    );
  }

  //todo: need this function create a new admin account without the need of a previous admin account, maybe create another endpoint to create a shop, and in this endpoint create a new admin account and only can be created if is using a cnpj
  async addAdmin(
    currentAdminEmail: string,
    newAdminEmail: string,
  ): Promise<void> {
    const account = await this.accountModel.findOne({
      where: { email: currentAdminEmail },
    });

    if (account.isAdmin) {
      const newAccount = await this.accountModel.findOne({
        where: { email: newAdminEmail },
      });

      if (newAccount) {
        await newAccount.update({
          isAdmin: true,
        });
        return;
      }
      throw new HttpException(
        'fail to add admin, account not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    throw new HttpException(
      'User dont have privilege',
      HttpStatus.UNAUTHORIZED,
    );
  }

  async removeAdmin(
    currentAdminEmail: string,
    targetAdminEmail: string,
  ): Promise<void> {
    const currentAdminAccount = await this.accountModel.findOne({
      where: { email: currentAdminEmail },
    });

    if (currentAdminAccount.isAdmin) {
      const targetAdminAccount = await this.accountModel.findOne({
        where: { email: targetAdminEmail },
      });

      if (targetAdminAccount) {
        await targetAdminAccount.update({
          isAdmin: false,
        });
        return;
      }

      throw new HttpException(
        'Failed to remove admin, account does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    throw new HttpException(
      'User does not have the necessary privileges',
      HttpStatus.UNAUTHORIZED,
    );
  }
}
