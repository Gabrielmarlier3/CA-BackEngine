import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailModel } from './email.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    SequelizeModule.forFeature([EmailModel]),
  ],
  providers: [EmailService],
  exports: [EmailService]
})
export class EmailModule {}
