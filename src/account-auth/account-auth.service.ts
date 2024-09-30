import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Md5 } from 'ts-md5';
import { AccountAuthModel } from './account-auth.model';
import { InjectModel } from '@nestjs/sequelize';
import { EmailService } from '../email/email.service';
import { AccountUserModel } from '../account-user/account-user.model';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AccountAuthService {
  constructor(
    @InjectModel(AccountAuthModel)
    private accountAuthModel: typeof AccountAuthModel,
    private readonly jwtService: JwtService,
    readonly emailService: EmailService,
  ) {}

  logger = new Logger(AccountAuthService.name);

  async findByEmail(email: string): Promise<AccountAuthModel> {
    return await this.accountAuthModel.findOne({
      include: [
        {
          model: AccountUserModel,
          where: {
            email: email,
          },
        },
      ],
    });
  }

  async createPassword(password: string, accountId: number): Promise<void> {
    if (accountId) {
      await this.accountAuthModel.create({
        password: Md5.hashStr(password),
        accountUserId: accountId,
      });
    }
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    try {
      const account = await this.findByEmail(email);

      if (account && account.password == Md5.hashStr(password)) {
        const payload = { email: email, sub: account.id };
        return {
          access_token: this.jwtService.sign(payload),
        };
      } else {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }

    } catch (error) {
      this.logger.error(error);
      throw new HttpException('Login failed', HttpStatus.UNAUTHORIZED);
    }
  }

  async sendRecoveryCode(email: string): Promise<void> {
    try {
      const account = await this.findByEmail(email);

      if (account) {
        await this.emailService.sendRefactorCodeMail(email, account);
      }
    } catch (error) {
      this.logger.error(error);
      throw new HttpException('Account not Found', HttpStatus.BAD_REQUEST);
    }
  }

  async changePassword(
    newPassword: string,
    email: string,
    refactorCode: number,
  ): Promise<void> {
    const account = await this.findByEmail(email);
    if (!account) {
      throw new HttpException('Account not Found', HttpStatus.BAD_REQUEST);
    }

    const verifiedCode = await this.emailService.verifyCode(
      account,
      refactorCode,
    );

    if (verifiedCode) {
      const passwordChanged = await account.update({
        password: Md5.hashStr(newPassword),
      });

      if (passwordChanged) {
        await this.emailService.deprecateCode(account.id);
        return;
      }
    }
    throw new HttpException(
      'Refactor code does not match in database',
      HttpStatus.BAD_REQUEST,
    );
  }
}
