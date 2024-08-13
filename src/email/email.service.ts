import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';
import { InjectModel } from '@nestjs/sequelize';
import { EmailModel } from './email.model';
import { AccountAuthModel } from '../account-auth/account-auth.model';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private configService: ConfigService, @InjectModel(EmailModel) private emailModel: typeof EmailModel) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  logger = new Logger(EmailService.name);

  private getMailHtml(recoveryKey: number): string {
    const templatePath = path.join(__dirname, '.', 'template', 'email-template.html');    let html = fs.readFileSync(templatePath, 'utf8');
    html = html.replace('{{recoveryKey}}', recoveryKey.toString());
    return html;
  }

  async sendRefactorCodeMail(to: string, accountAuth: AccountAuthModel): Promise<void> {
    const recoveryKey = this.generateVerificationCode()

    const mailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to: to,
      subject: "Código para trocar sua senha",
      html: this.getMailHtml(recoveryKey),
    };



    try {
      const info = await this.transporter.sendMail(mailOptions)

      if(info){
        const emailCode = await this.emailModel.findOne({ rejectOnEmpty: undefined, where: {accountAuthId: accountAuth.id}});
        if(!emailCode){
          await this.emailModel.create({
            recovery_key: recoveryKey,
            accountAuthId: accountAuth.id
          })
          return
        }
        await emailCode.update({
          recovery_key: recoveryKey,
        })
        return
      }
    } catch (error) {
      console.error('Error sending email: ' + error);
    }

  }

  async verifyCode(accountAuth: AccountAuthModel, refactorCode): Promise<boolean> {
    const code = await this.emailModel.findOne({
      rejectOnEmpty: undefined,
      where: { recovery_key: refactorCode, accountAuthId: accountAuth.id },
    });
    if(code){
      return true;
    }
  }

  async deprecateCode(accountAuthId: number): Promise<void> {
    const recoveryCode = await this.emailModel.findOne({rejectOnEmpty: undefined,where: {accountAuthId: accountAuthId}});

    if(recoveryCode){
      await recoveryCode.update({
        recovery_key: null,
      })
    }

  }

  //creates a code of 6 random numbers
  generateVerificationCode(): number {
    const randomBytes = crypto.randomBytes(2);
    return  randomBytes.readUIntBE(0, 2)
  }
}
