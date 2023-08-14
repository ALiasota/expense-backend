import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../guards/accessToken.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

const categoryResponse = {
  status: 200,
  schema: {
    properties: {
      id: { type: 'string' },
      label: { type: 'string' },
    },
  },
};

const getCategoriesResponse = {
  status: 200,
  schema: {
    properties: {
      categories: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            label: { type: 'string' },
          },
        },
      },
    },
  },
};

@ApiTags('Categories')
@Controller('category')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Create category' })
  @ApiResponse(categoryResponse)
  @Post('/')
  createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() req: Request,
  ) {
    return this.categoriesService.createCategory(
      req.user['sub'],
      createCategoryDto,
    );
  }

  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Rename category' })
  @ApiResponse(categoryResponse)
  @Put('/:id')
  renameCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @Param('id') id: string,
  ) {
    return this.categoriesService.renameCategory(id, createCategoryDto.label);
  }

  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Remove category' })
  @ApiResponse(categoryResponse)
  @Delete('/:id')
  removeCategory(@Param('id') id: string) {
    return this.categoriesService.removeCategory(id);
  }

  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Get categories' })
  @ApiResponse(getCategoriesResponse)
  @Get()
  getCategories(@Req() req: Request) {
    return this.categoriesService.getUserCategories(req.user['sub']);
  }
}
