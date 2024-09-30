import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuModel } from './menu.model';
import { CreateMenuDTO } from './dto/CreateMenuDTO';
import { UpdateMenuDTO } from './dto/UpdateMenuDTO';
import { DeleteMenuDTO } from './dto/DeleteMenuDTO';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('menu')
export class MenuController {

  constructor(private readonly menuService: MenuService) {}

  @ApiOperation({ summary: 'Endpoint to get all meals cadastred' })
  @ApiResponse({ status: 201, description: 'Success.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @Get("allMeal")
  async allMeal(): Promise<MenuModel[]> {
    return this.menuService.getAllMeals()
  }

  @ApiOperation({ summary: 'Endpoint to get food details' })
  @ApiResponse({ status: 201, description: 'Success.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @Get(':foodIdentifier')
  async getMealInformation(@Param('foodIdentifier') foodIdentifier: string): Promise<MenuModel> {
    const meal = await this.menuService.getMealInformation(foodIdentifier)

    if (!meal) {
      throw new HttpException('Meal not found', HttpStatus.NOT_FOUND);
    }

    return meal;
  }

  @ApiOperation({ summary: 'Endpoint to create meals' })
  @ApiResponse({ status: 201, description: 'Success.' })
  @ApiResponse({ status: 400, description: 'Error creating meal with this name' })
  @ApiResponse({ status: 401, description: 'User does not have privilege' })
  @Post('createMeal')
  async createMeal(@Body() createMenuDto: CreateMenuDTO):Promise <void>{
    const { name, description, image, price, available, userId } = createMenuDto;
    await this.menuService.createMeal(name, description, image, price, available, userId);
  }

  @ApiOperation({ summary: 'Endpoint to update cadastred meal, like unavailable' })
  @ApiResponse({ status: 201, description: 'Success.' })
  @ApiResponse({ status: 401, description: 'User does not have privilege' })
  @Put('updateMeal')
  async updateMeal(@Body() updateMenuDto: UpdateMenuDTO):Promise<void> {
    const { foodIdentifier, name ,description, image, price, available, userId } = updateMenuDto;
    await this.menuService.updateMeal(foodIdentifier, name, description, image, price, available, userId)
  }

  @ApiResponse({ status: 204, description: 'Success.' })
  @ApiResponse({ status: 401, description: 'User does not have privilege' })
  @ApiOperation({ summary: 'Endpoint to remove cadastred meal' })
  @Delete('deleteMeal')
  async deleteMeal(@Body() deleteMenuDto: DeleteMenuDTO):Promise<HttpStatus.NO_CONTENT> {
    const { foodIdentifier, userId } = deleteMenuDto;
    await this.menuService.removeMeal(foodIdentifier, userId);
    return HttpStatus.NO_CONTENT
  }
}


