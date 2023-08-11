import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Request } from 'express';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  const mockCategoriesService = {
    createCategory: jest.fn(),
    renameCategory: jest.fn(),
    removeCategory: jest.fn(),
    getUserCategories: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [CategoriesService],
    })
      .overrideProvider(CategoriesService)
      .useValue(mockCategoriesService)
      .compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create category', async () => {
    const dto = {
      label: 'label',
    };
    const req: Partial<Request> = {
      user: { sub: 'testUserId' },
    };

    mockCategoriesService.createCategory.mockResolvedValue({
      id: expect.any(String),
      label: dto.label,
    });

    const result = await controller.createCategory(dto, req as Request);
    expect(result).toEqual({
      id: expect.any(String),
      label: dto.label,
    });

    expect(mockCategoriesService.createCategory).toHaveBeenCalledWith(
      req.user['sub'],
      dto,
    );
  });

  it('should rename category', async () => {
    const dto = {
      label: 'label',
    };

    const id = 'dsvfdsfdsfdsf';

    mockCategoriesService.renameCategory.mockResolvedValue({
      id,
      label: dto.label,
    });

    const result = await controller.renameCategory(dto, id);
    expect(result).toEqual({
      id: expect.any(String),
      label: dto.label,
    });

    expect(mockCategoriesService.renameCategory).toHaveBeenCalledWith(
      id,
      dto.label,
    );
  });

  it('should remove category', async () => {
    const id = 'dsvfdsfdsfdsf';

    mockCategoriesService.removeCategory.mockResolvedValue({
      id,
      label: expect.any(String),
    });

    const result = await controller.removeCategory(id);
    expect(result).toEqual({
      id,
      label: expect.any(String),
    });

    expect(mockCategoriesService.removeCategory).toHaveBeenCalledWith(id);
  });

  it('should return user categories', async () => {
    const req: Partial<Request> = {
      user: { sub: 'testUserId' },
    };

    const mockedCategories = [
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

    mockCategoriesService.getUserCategories.mockResolvedValue(mockedCategories);

    const result = await controller.getCategories(req as Request);
    expect(result).toEqual(mockedCategories);

    expect(mockCategoriesService.getUserCategories).toHaveBeenCalledWith(
      req.user['sub'],
    );
  });
});
