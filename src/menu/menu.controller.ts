import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuModel } from './menu.model';
import { CreateMenuDTO } from './dto/CreateMenuDTO';
import { UpdateMenuDTO } from './dto/UpdateMenuDTO';
import { DeleteMenuDTO } from './dto/DeleteMenuDTO';

@Controller('menu')
export class MenuController {

  constructor(private readonly menuService: MenuService) {}

  @Get("allMeal")
  async allMeal(): Promise<MenuModel[]> {
    return this.menuService.getAllMeals()
  }

  @Get(':foodIdentifier')
  async getMealInformation(@Param('foodIdentifier') foodIdentifier: string): Promise<MenuModel> {
    const meal = await this.menuService.getMealInformation(foodIdentifier)

    if (!meal) {
      throw new HttpException('Meal not found', HttpStatus.NOT_FOUND);
    }

    return meal;
  }

  @Post('createMeal')
  async createMeal(@Body() createMenuDto: CreateMenuDTO):Promise <void>{
    const { name, description, image, price, available, userId } = createMenuDto;
    await this.menuService.createMeal(name, description, image, price, available, userId);
  }

  @Put('updateMeal')
  async updateMeal(@Body() updateMenuDto: UpdateMenuDTO):Promise<void> {
    const { foodIdentifier, name ,description, image, price, available, userId } = updateMenuDto;
    await this.menuService.updateMeal(foodIdentifier, name, description, image, price, available, userId)
  }

  @Delete('deleteMeal')
  async deleteMeal(@Body() deleteMenuDto: DeleteMenuDTO):Promise<HttpStatus.NO_CONTENT> {
    const { foodIdentifier, userId } = deleteMenuDto;
    await this.menuService.removeMeal(foodIdentifier, userId);
    return HttpStatus.NO_CONTENT
  }
}


