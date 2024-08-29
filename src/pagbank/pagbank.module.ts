import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PagbankService } from './pagbank.service';
import { MenuModule } from '../menu/menu.module';
import { AccountUserModule } from '../account-user/account-user.module';
import { PagBankModel } from './pagbank.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forFeature([PagBankModel]),
    ConfigModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          baseURL: configService.get<string>('pagBank.baseUrl'),
          validateStatus: (status: number) => status < 500,
          headers: {
            Authorization: configService.get<string>('pagBank.apiKey'),
          }
        }
      }
    }),
    MenuModule,
    AccountUserModule
  ],
  providers: [PagbankService],
  exports: [PagbankService]
})
export class PagbankModule {}
