import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { Category } from './categories.schema';
import { getModelToken } from '@nestjs/mongoose';
import { TransactionsService } from '../transactions/transactions.service';
import { UserRoles } from '../users/users.schema';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let categoryModel;
  let mockTransactionsService;

  beforeEach(async () => {
    categoryModel = {
      create: jest.fn(),
      insertMany: jest.fn(),
      findById: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    };
    mockTransactionsService = {
      updateUserTransactionsByCategoryId: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getModelToken(Category.name),
          useValue: categoryModel,
        },
        TransactionsService,
      ],
    })
      .overrideProvider(TransactionsService)
      .useValue(mockTransactionsService)
      .compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new category', async () => {
    const label = 'label';
    const userId = 'fdgdfgfdgdfg';
    const createdCategory = {
      id: expect.any(String),
      label,
    };

    categoryModel.create.mockResolvedValue({
      _id: 'dssssdsdfdv',
      label,
      user: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await service.createCategory(userId, { label });
    expect(result).toEqual(createdCategory);
    expect(categoryModel.create).toHaveBeenCalledWith({ label, user: userId });
  });

  it('should return category by id', async () => {
    const categoryId = 'fdgdfgfdgdfg';

    const createdCategory = {
      _id: 'dssssdsdfdv',
      label: 'label',
      user: 'dfdsfdsafas',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    categoryModel.findById.mockResolvedValue(createdCategory);

    const result = await service.getCategoryById(categoryId);
    expect(result).toEqual(createdCategory);
    expect(categoryModel.findById).toHaveBeenCalledWith(categoryId);
  });

  it('should return category by user id and label', async () => {
    const userId = 'fdgdfgfdgdfg';
    const label = 'Інше';

    const createdCategory = {
      _id: 'dssssdsdfdv',
      label: 'label',
      user: 'dfdsfdsafas',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    categoryModel.findOne.mockResolvedValue(createdCategory);

    const result = await service.getCategoryByNameAndUserId(userId, label);
    expect(result).toEqual(createdCategory);
    expect(categoryModel.findOne).toHaveBeenCalledWith({ user: userId, label });
  });

  it('should create default categories', async () => {
    const userId = 'fdgdfgfdgdfg';
    const defaultCategories = [
      { user: userId, label: 'Зарплата' },
      { user: userId, label: 'Подарунки' },
      { user: userId, label: 'Їжа' },
      { user: userId, label: 'Подорож' },
      { user: userId, label: 'Інше' },
    ];
    const createdCategories = [
      {
        id: 'dssssdsdfdv',
        label: 'Зарплата',
      },
      {
        id: 'dssssdsdfdv1',
        label: 'Подарунки',
      },
      {
        id: 'dssssdsdfdv2',
        label: 'Їжа',
      },
      {
        id: 'dssssdsdfdv3',
        label: 'Подорож',
      },
      {
        id: 'dssssdsdfdv4',
        label: 'Інше',
      },
    ];

    categoryModel.insertMany.mockResolvedValue([
      {
        _id: 'dssssdsdfdv',
        label: 'Зарплата',
        user: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: 'dssssdsdfdv1',
        label: 'Подарунки',
        user: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: 'dssssdsdfdv2',
        label: 'Їжа',
        user: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: 'dssssdsdfdv3',
        label: 'Подорож',
        user: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: 'dssssdsdfdv4',
        label: 'Інше',
        user: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const result = await service.createDefaultCategories(userId);
    expect(result).toEqual(createdCategories);
    expect(categoryModel.insertMany).toHaveBeenCalledWith(defaultCategories);
  });

  it('should return user categories', async () => {
    const userId = 'fdgdfgfdgdfg';

    categoryModel.find.mockResolvedValue([
      {
        _id: 'dssssdsdfdv',
        label: 'Зарплата',
        user: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: 'dssssdsdfdv1',
        label: 'Подарунки',
        user: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: 'dssssdsdfdv2',
        label: 'Їжа',
        user: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: 'dssssdsdfdv3',
        label: 'Подорож',
        user: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: 'dssssdsdfdv4',
        label: 'Інше',
        user: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    const createdCategories = [
      {
        id: 'dssssdsdfdv',
        label: 'Зарплата',
      },
      {
        id: 'dssssdsdfdv1',
        label: 'Подарунки',
      },
      {
        id: 'dssssdsdfdv2',
        label: 'Їжа',
      },
      {
        id: 'dssssdsdfdv3',
        label: 'Подорож',
      },
      {
        id: 'dssssdsdfdv4',
        label: 'Інше',
      },
    ];
    const result = await service.getUserCategories(userId);

    expect(result).toEqual(createdCategories);
    expect(categoryModel.find).toHaveBeenCalledWith({ user: userId });
  });

  it('should change name of the category', async () => {
    const label = 'label';
    const id = '609c1c211c0d6e001c14e24a';
    const updatedCategory = {
      id: expect.any(String),
      label,
    };
    const user = {
      username: 'username',
      displayName: 'displayName',
      role: UserRoles.USER,
      _id: 'dsfdsfsdfsdf',
      refreshToken: 'gdfgfdgdf',
      defaultCategory: 'fdsfdsfsdfsdf',
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0,
      password:
        '$argon2id$v=19$m=65536,t=3,p=4$E2EQ54td84DT/UjVylLkzg$gkKqPZrkNVt4tfuC3njVeqgC4PxyOcjaIVeBKkUVGvo',
    };
    const existingCategory: any = {
      _id: id,
      label: 'sdcdscsdcvsd',
      user: expect.any(String),
      createdAt: new Date(),
      updatedAt: new Date(),
      populate: jest.fn(() => ({
        _id: id,
        label: 'sdcdscsdcvsd',
        user,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    };
    categoryModel.findById = jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue(existingCategory),
    });
    const saveMock = jest
      .fn()
      .mockResolvedValue({ ...existingCategory, label });
    existingCategory.save = saveMock;

    const result = await service.renameCategory(id, label);
    expect(result).toEqual(updatedCategory);
    expect(categoryModel.findById).toHaveBeenCalledWith(id);
  });

  it('should remove category', async () => {
    const id = '609c1c211c0d6e001c14e24a';
    const deletedCategory = {
      id,
      label: expect.any(String),
    };
    const user = {
      username: 'username',
      displayName: 'displayName',
      role: UserRoles.USER,
      _id: 'dsfdsfsdfsdf',
      refreshToken: 'gdfgfdgdf',
      defaultCategory: 'fdsfdsfsdfsdf',
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0,
      password:
        '$argon2id$v=19$m=65536,t=3,p=4$E2EQ54td84DT/UjVylLkzg$gkKqPZrkNVt4tfuC3njVeqgC4PxyOcjaIVeBKkUVGvo',
    };
    const existingCategory: any = {
      _id: id,
      label: 'sdcdscsdcvsd',
      user: expect.any(String),
      createdAt: new Date(),
      updatedAt: new Date(),
      populate: jest.fn(() => ({
        _id: id,
        label: 'sdcdscsdcvsd',
        user,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    };

    categoryModel.findById = jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue(existingCategory),
    });

    categoryModel.findByIdAndDelete.mockResolvedValue(existingCategory);

    const result = await service.removeCategory(id);

    expect(result).toEqual(deletedCategory);
    expect(categoryModel.findById).toHaveBeenCalledWith(id);
    expect(categoryModel.findByIdAndDelete).toHaveBeenCalledWith(id);
  });
});
