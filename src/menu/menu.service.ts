import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MenuModel } from './menu.model';
import { AccountUserService } from '../account-user/account-user.service';

@Injectable()
export class MenuService {

  constructor(
    @InjectModel(MenuModel) private menuModel: typeof MenuModel,
    private readonly accountUserService: AccountUserService,
  ) {}

  logger = new Logger(MenuService.name);

  async userVerification(UserId: number):Promise <boolean>{
    const account = await this.accountUserService.getAccountUserById(UserId)

    if(account){
    return account.isAdmin !== false;
    }
    throw new HttpException('User verification failed, account dont exist', HttpStatus.NOT_FOUND);
  }

  async getMealInformation(foodIdentifier: string):Promise <MenuModel> {
    return this.menuModel.findOne({
      where:{
        identifier: foodIdentifier
      }
    })
  }

  async getAllMeals():Promise <MenuModel[]> {
    return this.menuModel.findAll()
  }

  async generateUniqueIdentifier(): Promise<string> {
    const lastItem = await this.menuModel.findOne({
      order: [['id', 'DESC']],
    });

    let nextId = 1;

    if (lastItem) {
      const lastIdentifier = lastItem.identifier;
      const numericPart = parseInt(lastIdentifier.split('-')[1], 10);
      nextId = numericPart + 1;
    }

    const paddedId = nextId.toString().padStart(4, '0');
    return `MNU-${paddedId}`;
  }

  async createMeal(name:string, description:string ,image:string ,price:number , available: boolean, userId: number){
    const valid = await this.userVerification(userId)

    if(valid){
      const existingMenu = await this.menuModel.findOne({

        where: {name: name}
      })

      if (existingMenu) {
        throw new HttpException("already exist a meal with this name", HttpStatus.BAD_REQUEST);
      }

      try {
        await this.menuModel.create({
          name,
          description,
          image,
          price,
          available,
          identifier: await this.generateUniqueIdentifier(),
        });
      } catch (e) {
        this.logger.error('error creating meal with this name: ', e);
        throw new HttpException('Error creating meal with this name', HttpStatus.BAD_REQUEST);
      }
      return
    }

    throw new HttpException('User dont have privilege', HttpStatus.UNAUTHORIZED)
  }

  //TODO: testar isso aqui
  async updateMeal(foodIdentifier:string, name: string, description:string, image:string, price:number, available:boolean, userId:number ){
    const transaction = await this.menuModel.sequelize.transaction();

    try {
      const valid = await this.userVerification(userId);

      if(!valid){
        throw new HttpException('User does not have privilege', HttpStatus.UNAUTHORIZED);
      }

      const existingMenu = await this.menuModel.findOne({
        where: { identifier: foodIdentifier },
        transaction
      });

      if (existingMenu) {
        if (name !== undefined) {
          existingMenu.name = name;
        }

        if (description !== undefined) {
          existingMenu.description = description;
        }

        if (image !== undefined) {
          existingMenu.image = image;
        }

        if (price !== undefined) {
          existingMenu.price = price;
        }

        existingMenu.available = available;

        await existingMenu.save({ transaction });
      }

      await transaction.commit();
      return;


    } catch (error) {
      await transaction.rollback();
      throw new HttpException('Failed to update meal', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeMeal(foodIdentifier: string, userId: number){
    const valid = await this.userVerification(userId)
    if(valid) {
      const existingMenu = await this.menuModel.findOne({

        where: { identifier: foodIdentifier },
      })

      if (existingMenu) {
        await existingMenu.destroy()
      }
      return
    }
    throw new HttpException('User dont have privilege', HttpStatus.UNAUTHORIZED)
  }
}
