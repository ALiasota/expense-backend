import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { Category } from './categories.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let categoryModel;

  beforeEach(async () => {
    categoryModel = {
      create: jest.fn(),
      insertMany: jest.fn(),
      findById: jest.fn(),
      find: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getModelToken(Category.name),
          useValue: categoryModel,
        },
      ],
    }).compile();

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
    const existingCategory: any = {
      _id: id,
      label: 'sdcdscsdcvsd',
      user: expect.any(String),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    categoryModel.findById.mockResolvedValue(existingCategory);
    const saveMock = jest
      .fn()
      .mockResolvedValue({ ...existingCategory, label });
    existingCategory.save = saveMock;

    const result = await service.renameCategory(id, label);
    expect(result).toEqual(updatedCategory);
    expect(categoryModel.findById).toHaveBeenCalledWith(id);
  });

  it('should change remove category', async () => {
    const id = '609c1c211c0d6e001c14e24a';
    const deletedCategory = {
      id,
      label: expect.any(String),
    };
    const existingCategory = {
      _id: id,
      label: 'sdcdscsdcvsd',
      user: expect.any(String),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    categoryModel.findById.mockResolvedValue(existingCategory);
    categoryModel.findByIdAndDelete.mockResolvedValue(existingCategory);

    const result = await service.removeCategory(id);

    expect(result).toEqual(deletedCategory);
    expect(categoryModel.findById).toHaveBeenCalledWith(id);
    expect(categoryModel.findByIdAndDelete).toHaveBeenCalledWith(id);
  });
});
