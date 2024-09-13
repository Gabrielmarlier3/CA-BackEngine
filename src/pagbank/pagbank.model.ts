import { DataTypes } from 'sequelize';
import { Column, Model, Table, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { AccountUserModel } from '../account-user/account-user.model';

interface OrderInfo {
  totalAmount: number;
  foodIdentifiers: string;
}

@Table({
  tableName: 'pagbank',
})

export class PagBankModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataTypes.INTEGER,
  })
  id: number

  //pagbank code that can be used for get the details of buy
  @Column({
    allowNull: false,
    type: DataTypes.STRING,
  })
  pagbankId: string

  @Column({
    allowNull: false,
    type: DataTypes.JSONB,
  })
  orderInfo: OrderInfo

  //us unique identifier for  "vai que precisa né"
  @Column({
    allowNull: false,
    type: DataTypes.STRING,
  })
  identifier: string

  @ForeignKey(() => AccountUserModel)
  @Column({
    type: DataTypes.INTEGER,
  })
  accountUserId: number;

  @BelongsTo(() => AccountUserModel)
  user: AccountUserModel;



}
