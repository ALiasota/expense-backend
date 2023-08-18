import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../guards/accessToken.guard';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Roles } from '../guards/roles-auth.decorator';
import { UserRoles } from '../users/users.schema';
import { RolesGuard } from '../guards/roles.guard';

const transactionResponse = {
  status: 200,
  schema: {
    properties: {
      id: { type: 'string' },
      label: { type: 'string' },
      amount: { type: 'number' },
      date: { type: 'string' },
    },
  },
};

const getTransactionsResponse = {
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
            amount: { type: 'number' },
            date: { type: 'string' },
          },
        },
      },
    },
  },
};

@ApiTags('Transactions')
@Controller('transaction')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Create transaction' })
  @ApiResponse(transactionResponse)
  @Post('/')
  createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
    @Req() req: Request,
  ) {
    return this.transactionsService.createTransaction(
      req.user['sub'],
      createTransactionDto,
    );
  }

  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Get transactions' })
  @ApiResponse(getTransactionsResponse)
  @Get()
  getTransactions(@Req() req: Request) {
    return this.transactionsService.getUserTransactions(req.user['sub']);
  }

  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Get transactions by category' })
  @ApiResponse(getTransactionsResponse)
  @Get('category/:id')
  getUserTransactionsByCategoryId(@Param('id') id: string) {
    return this.transactionsService.getUserTransactionsByCategoryId(id);
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get all DB transactions' })
  @ApiResponse(getTransactionsResponse)
  @Get('/all')
  getAllTransactions() {
    return this.transactionsService.getAllTransactions();
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get all user transactions by Admin' })
  @ApiResponse(getTransactionsResponse)
  @Get('/all/:id')
  getUserTransactionsAdmin(@Param('id') id: string) {
    return this.transactionsService.getUserTransactions(id);
  }
}
