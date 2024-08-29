import { DataTypes } from 'sequelize';
import { Column, Model, Table, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

@Table({
  tableName: 'menu',
})

export class MenuModel extends Model {
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
  })
  description: string

  @Column({
    allowNull: false,
    type: DataTypes.STRING,
  })
  image: string


  @Column({
    allowNull: false,
    type: DataTypes.INTEGER,
  })
  price: number

  @Column({
    allowNull: false,
    defaultValue: true,
    type: DataTypes.BOOLEAN,
  })
  available: boolean

  @Column({
    allowNull: false,
    type: DataTypes.STRING,
  })
  identifier: string
}
