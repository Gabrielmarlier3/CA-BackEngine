import { Module } from '@nestjs/common';
import { AccountAuthService } from './account-auth.service';
import { AccountAuthController } from './account-auth.controller';
import { AccountAuthModel } from './account-auth.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { EmailModule } from '../email/email.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../middleware/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
    }),
    SequelizeModule.forFeature([AccountAuthModel]),
    EmailModule,
  ],
  providers: [AccountAuthService, JwtStrategy],
  controllers: [AccountAuthController],
  exports: [AccountAuthService],
})
export class AccountAuthModule {}
