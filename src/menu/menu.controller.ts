import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, Post, Put } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuModel } from './menu.model';
import { CreateMenuDto } from './dto/createMenuDto';
import { UpdateMenuDto } from './dto/updateMenuDto';
import { DeleteMenuDto } from './dto/deleteMenuDto';

@Controller('menu')
export class MenuController {

  constructor(private readonly menuService: MenuService) {}

  logger = new Logger(MenuController.name);

  @Get("allMeal")
  async allMeal(): Promise<MenuModel[]> {
    return this.menuService.getAllMeals()
  }

  @Get(':foodIdentifier')
  async getMealInformation(@Param('foodIdentifier') foodIdentifier: string): Promise<MenuModel> {
    try {
      const meal = await this.menuService.getMealInformation(foodIdentifier)

      if (!meal) {
        throw new HttpException('Meal not found', HttpStatus.NOT_FOUND);
      }

      return meal;

    } catch (error) {
      throw new HttpException('Failed to retrieve meal information', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('createMeal')
  async createMeal(@Body() createMenuDto: CreateMenuDto):Promise <string>{
    try {
      const { name, description, image, price, available, userId } = createMenuDto;
      await this.menuService.createMeal(name, description, image, price, available, userId);
      return "ok"
    } catch (e) {
      this.logger.error(e)
      throw new HttpException('Failed to create meal', HttpStatus.BAD_REQUEST);
    }
  }

  @Put('updateMeal')
  async updateMeal(@Body() updateMenuDto: UpdateMenuDto):Promise<string> {
    const { foodIdentifier, name ,description, image, price, available, userId } = updateMenuDto;
    await this.menuService.updateMeal(foodIdentifier, name, description, image, price, available, userId)
    return 'ok'
  }

  @Delete('deleteMeal')
  async deleteMeal(@Body() deleteMenuDto: DeleteMenuDto):Promise<string> {
    try {
      const { foodIdentifier, userId } = deleteMenuDto;
      await this.menuService.removeMeal(foodIdentifier, userId);
      return 'ok'
    } catch (e) {
      this.logger.error(e)
      throw new HttpException('Failed to delete meal', HttpStatus.BAD_REQUEST);
    }
  }

}


