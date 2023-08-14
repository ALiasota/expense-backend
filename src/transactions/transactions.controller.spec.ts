import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  const mockTransactionsService = {
    createTransaction: jest.fn(),
    getUserTransactions: jest.fn(),
    getUserTransactionsByCategoryId: jest.fn(),
    getAllTransactions: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [TransactionsService, JwtService],
    })
      .overrideProvider(TransactionsService)
      .useValue(mockTransactionsService)
      .compile();

    controller = module.get<TransactionsController>(TransactionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create transaction', async () => {
    const dto = {
      category: '64d60b27aade028cd15e2d35',
      amount: -500,
      date: '2022-09-08T17:39:56.323+00:00',
    };

    const req: Partial<Request> = {
      user: { sub: 'testUserId' },
    };

    const createdTransaction = {
      id: expect.any(String),
      category: expect.any(String),
      amount: dto.amount,
      date: dto.date,
    };

    mockTransactionsService.createTransaction.mockResolvedValue(
      createdTransaction,
    );

    const result = await controller.createTransaction(dto, req as Request);
    expect(result).toEqual(createdTransaction);

    expect(mockTransactionsService.createTransaction).toHaveBeenCalledWith(
      req.user['sub'],
      dto,
    );
  });

  it('should return user transactions', async () => {
    const req: Partial<Request> = {
      user: { sub: 'testUserId' },
    };

    const transactions = [
      {
        id: expect.any(String),
        category: expect.any(String),
        amount: expect.any(Number),
        date: expect.any(String),
      },
    ];

    mockTransactionsService.getUserTransactions.mockResolvedValue(transactions);

    const result = await controller.getTransactions(req as Request);
    expect(result).toEqual(transactions);

    expect(mockTransactionsService.getUserTransactions).toHaveBeenCalledWith(
      req.user['sub'],
    );
  });

  it('should return user transactions by category id', async () => {
    const id = 'sdfsdfsdfs';

    const transactions = [
      {
        id: expect.any(String),
        category: expect.any(String),
        amount: expect.any(Number),
        date: expect.any(String),
      },
    ];

    mockTransactionsService.getUserTransactionsByCategoryId.mockResolvedValue(
      transactions,
    );

    const result = await controller.getUserTransactionsByCategoryId(id);
    expect(result).toEqual(transactions);

    expect(
      mockTransactionsService.getUserTransactionsByCategoryId,
    ).toHaveBeenCalledWith(id);
  });

  it('should return all transactions in DB', async () => {
    const transactions = [
      {
        id: expect.any(String),
        category: expect.any(String),
        amount: expect.any(Number),
        date: expect.any(String),
      },
    ];

    mockTransactionsService.getAllTransactions.mockResolvedValue(transactions);

    const result = await controller.getAllTransactions();
    expect(result).toEqual(transactions);

    expect(mockTransactionsService.getAllTransactions).toHaveBeenCalled();
  });

  it('should return user transactions Admin', async () => {
    const id = 'fdgdfsgsdgs';

    const transactions = [
      {
        id: expect.any(String),
        category: expect.any(String),
        amount: expect.any(Number),
        date: expect.any(String),
      },
    ];

    mockTransactionsService.getUserTransactions.mockResolvedValue(transactions);

    const result = await controller.getUserTransactionsAdmin(id);
    expect(result).toEqual(transactions);

    expect(mockTransactionsService.getUserTransactions).toHaveBeenCalledWith(
      id,
    );
  });
});
