import { DataTypes } from 'sequelize';
import { Column, Model, Table, PrimaryKey, AutoIncrement, HasOne, HasMany } from 'sequelize-typescript';
import { AccountAuthModel } from '../account-auth/account-auth.model';
import { Address } from './interface/address';
import { PagBankModel } from '../pagbank/pagbank.model';

interface savedCard {
  pagBankToken: string,
  lastFourDigits: number,
  expMonth: number,
  expYear: number
}
@Table({
  tableName: 'account_user',
})
export class AccountUserModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataTypes.INTEGER,
  })
  id: number

  @Column({
    allowNull: false,
    type: DataTypes.STRING,
  })
  name: string

  @Column({
    allowNull: false,
    type: DataTypes.STRING,
    unique: true
  })
  email: string

  @Column({
    allowNull: false,
    type: DataTypes.STRING,
    unique: true
  })
  telephoneNumber: string

  @Column({
    allowNull: false,
    type: DataTypes.STRING,
    unique: true
  })
  cpfCnpj: string

  @Column({
    allowNull: false,
    type: DataTypes.JSONB,
  })
  address: Address

  @Column({
    allowNull: false,
    type: DataTypes.BOOLEAN,
  })
  isLegalPerson: boolean

  @Column({
    type: DataTypes.INTEGER,
    allowNull: true,
  })
  card: savedCard

  @Column({
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  })
  isAdmin: boolean

  @Column({
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  })
  isDeleted: boolean


  @HasOne(() => AccountAuthModel, {
    foreignKey: 'accountUserId',
  })
  accountAuth: AccountAuthModel;

  @HasMany(() => PagBankModel, {
    foreignKey: 'accountUserId',
    as: 'pagbankTransactions'
  })
  pagbankTransactions: PagBankModel[];
}
