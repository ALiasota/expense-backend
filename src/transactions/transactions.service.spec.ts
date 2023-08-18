import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { JwtService } from '@nestjs/jwt';
import { Transaction } from './transactions.schema';
import { getModelToken } from '@nestjs/mongoose';
import { CategoriesService } from '../categories/categories.service';
import { ConfigService } from '@nestjs/config';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let transactionModel;
  const mockedCategoriesService = {
    getCategoryById: jest.fn(),
  };

  beforeEach(async () => {
    transactionModel = {
      create: jest.fn(),
      find: jest.fn(),
      updateMany: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        CategoriesService,
        ConfigService,
        JwtService,
        {
          provide: getModelToken(Transaction.name),
          useValue: transactionModel,
        },
      ],
    })
      .overrideProvider(CategoriesService)
      .useValue(mockedCategoriesService)
      .compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new transaction', async () => {
    const userId = 'fhghfdhfghfhf';
    const dto = {
      category: '64d60b27aade028cd15e2d35',
      amount: -500,
      date: '2022-09-08T17:39:56.323+00:00',
    };
    const createdTransaction = {
      id: expect.any(String),
      category: expect.any(String),
      amount: dto.amount,
      date: dto.date,
    };

    const mockedCategory = {
      _id: 'dssssdsdfdv',
      label: 'label',
      user: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockedCategoriesService.getCategoryById.mockResolvedValue(mockedCategory);

    transactionModel.create.mockResolvedValue({
      _id: 'dssssdsdfdv',
      category: expect.any(String),
      date: dto.date,
      amount: dto.amount,
      user: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      populate: jest.fn(() => ({
        _id: 'dssssdsdfdv',
        category: mockedCategory,
        date: dto.date,
        amount: dto.amount,
        user: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    });

    const result = await service.createTransaction(userId, dto);

    expect(result).toEqual(createdTransaction);
    expect(transactionModel.create).toHaveBeenCalledWith({
      ...dto,
      user: userId,
    });
  });

  it('should return user transactions', async () => {
    const userId = 'fhghfdhfghfhf';
    const transactions = [
      {
        id: expect.any(String),
        category: expect.any(String),
        amount: expect.any(Number),
        date: expect.any(String),
      },
    ];

    const mockedCategory = {
      _id: 'dssssdsdfdv',
      label: 'label',
      user: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    transactionModel.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue([
        {
          _id: 'dssssdsdfdv',
          category: mockedCategory,
          date: '2022-09-08T17:39:56.323+00:00',
          amount: 500,
          user: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
    });

    const result = await service.getUserTransactions(userId);

    expect(result).toEqual(transactions);
    expect(transactionModel.find).toHaveBeenCalledWith({
      user: userId,
    });
  });

  it('should return user transactions by category id', async () => {
    const categoryId = 'fhghfdhfghfhf';
    const transactions = [
      {
        id: expect.any(String),
        category: expect.any(String),
        amount: expect.any(Number),
        date: expect.any(String),
      },
    ];

    const mockedCategory = {
      _id: 'dssssdsdfdv',
      label: 'label',
      user: 'gfgfdgfdgd',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    transactionModel.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue([
        {
          _id: 'dssssdsdfdv',
          category: mockedCategory,
          date: '2022-09-08T17:39:56.323+00:00',
          amount: 500,
          user: 'gfgfdgfdgd',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
    });

    const result = await service.getUserTransactionsByCategoryId(categoryId);

    expect(result).toEqual(transactions);
    expect(transactionModel.find).toHaveBeenCalledWith({
      category: categoryId,
    });
  });

  it('should return all transactions', async () => {
    const transactions = [
      {
        id: expect.any(String),
        category: expect.any(String),
        amount: expect.any(Number),
        date: expect.any(String),
      },
    ];

    const mockedCategory = {
      _id: 'dssssdsdfdv',
      label: 'label',
      user: 'gfgfdgfdgd',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    transactionModel.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue([
        {
          _id: 'dssssdsdfdv',
          category: mockedCategory,
          date: '2022-09-08T17:39:56.323+00:00',
          amount: 500,
          user: 'gfgfdgfdgd',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
    });

    const result = await service.getAllTransactions();

    expect(result).toEqual(transactions);
    expect(transactionModel.find).toHaveBeenCalledWith();
  });

  it('should return updated transactions', async () => {
    const categoryId = 'hgfhghjgjh';
    const newCategoryId = 'gfcgfghfhgfh';

    const transactions = [
      {
        _id: 'dssssdsdfdv',
        category: newCategoryId,
        date: '2022-09-08T17:39:56.323+00:00',
        amount: 500,
        user: 'hgfhgfhgfhg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    transactionModel.updateMany.mockResolvedValue([
      {
        _id: 'dssssdsdfdv',
        category: newCategoryId,
        date: '2022-09-08T17:39:56.323+00:00',
        amount: 500,
        user: 'hgfhgfhgfhg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const result = await service.updateUserTransactionsByCategoryId(
      categoryId,
      newCategoryId,
    );

    expect(result).toEqual(transactions);
    expect(transactionModel.updateMany).toHaveBeenCalledWith(
      {
        category: categoryId,
      },
      { $set: { category: newCategoryId } },
    );
  });
});
