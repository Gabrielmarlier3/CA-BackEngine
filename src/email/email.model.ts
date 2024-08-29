import { DataTypes } from 'sequelize';
import { Column, Model, Table, PrimaryKey, AllowNull, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { AccountAuthModel } from '../account-auth/account-auth.model';

@Table({
  tableName: 'email',
})

export class EmailModel extends Model{
  @PrimaryKey
  @Column({
    type: DataTypes.INTEGER,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataTypes.INTEGER,
  })
  recovery_key: number;

  @ForeignKey(() => AccountAuthModel)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  accountAuthId: number;

  @BelongsTo(() => AccountAuthModel)
  accountAuth: AccountAuthModel;
}
