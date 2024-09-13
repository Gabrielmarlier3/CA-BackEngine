import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountAuthModule } from './account-auth/account-auth.module';
import { AccountUserModule } from './account-user/account-user.module';
import { MenuModule } from './menu/menu.module';
import { EmailModule } from './email/email.module';
import { PagbankModule } from './pagbank/pagbank.module';
import * as process from 'process'
import Joi from 'joi'


const customLogger = (msg: string) => {
  // Ignore logs containing specific SQL statements
  if (!msg.includes('SELECT table_name FROM information_schema.tables') &&
    !msg.includes('SELECT i.relname AS name, ix.indisprimary AS primary')) {
    console.log(`Sequelize: ${msg}`);
  }
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        EMAIL_USER: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),
        PAGBANK_TOKEN: Joi.string().required(),
      })
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.PG_HOST,
      port: parseInt(process.env.PG_PORT, 10),
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      autoLoadModels: true,
      synchronize: true,
      models: [],
      logging: customLogger,
    }),
    EmailModule,
    AccountAuthModule,
    AccountUserModule,
    MenuModule,
    PagbankModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {
}
