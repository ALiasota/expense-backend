import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User, UserRoles } from './users.schema';
import { getModelToken } from '@nestjs/mongoose';
import { CategoriesService } from '../categories/categories.service';

describe('UsersService', () => {
  let userService: UsersService;
  let userModel;
  let mockCategoriesService;
  beforeEach(async () => {
    userModel = {
      create: jest.fn(),
      findOne: jest.fn(),
      findById: jest.fn(),
      find: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    };
    mockCategoriesService = {
      getCategoryByNameAndUserId: jest.fn(),
      createCategory: jest.fn(),
    };
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        CategoriesService,
        {
          provide: getModelToken(User.name),
          useValue: userModel,
        },
      ],
    })
      .overrideProvider(CategoriesService)
      .useValue(mockCategoriesService)
      .compile();
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should create a new user', async () => {
    const dto = {
      username: 'username',
      displayName: 'displayName',
      password: 'password',
    };
    const createdUser = {
      ...dto,
      _id: '64d3784293a40415d700b0cb',
      role: UserRoles.USER,
      refreshToken:
        '$argon2id$v=19$m=65536,t=3,p=4$BYqclplllcfkZoB1um5qzg$/csYuzHENGiP5nzNJUlxmcSNRGEFKFkmPZaE3FJAtBE',
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0,
      password:
        '$argon2id$v=19$m=65536,t=3,p=4$E2EQ54td84DT/UjVylLkzg$gkKqPZrkNVt4tfuC3njVeqgC4PxyOcjaIVeBKkUVGvo',
    };

    userModel.create.mockResolvedValue(createdUser);

    const result = await userService.createUser(dto);

    expect(result).toEqual(createdUser);
    expect(userModel.create).toHaveBeenCalledWith(dto);
  });

  it('should get user by name', async () => {
    const username = 'username';
    const user = {
      username,
      displayName: 'displayName',
      role: UserRoles.USER,
      _id: '64d3784293a40415d700b0cb',
      refreshToken:
        '$argon2id$v=19$m=65536,t=3,p=4$BYqclplllcfkZoB1um5qzg$/csYuzHENGiP5nzNJUlxmcSNRGEFKFkmPZaE3FJAtBE',
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0,
      password:
        '$argon2id$v=19$m=65536,t=3,p=4$E2EQ54td84DT/UjVylLkzg$gkKqPZrkNVt4tfuC3njVeqgC4PxyOcjaIVeBKkUVGvo',
    };

    userModel.findOne.mockResolvedValue(user);

    const result = await userService.getUserByName(username);

    expect(result).toEqual(user);
    expect(userModel.findOne).toHaveBeenCalledWith({ username });
  });

  it('should get user by id', async () => {
    const id = '64d3784293a40415d700b0cb';
    const user = {
      username: 'username',
      displayName: 'displayName',
      role: UserRoles.USER,
      _id: id,
      refreshToken:
        '$argon2id$v=19$m=65536,t=3,p=4$BYqclplllcfkZoB1um5qzg$/csYuzHENGiP5nzNJUlxmcSNRGEFKFkmPZaE3FJAtBE',
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0,
      password:
        '$argon2id$v=19$m=65536,t=3,p=4$E2EQ54td84DT/UjVylLkzg$gkKqPZrkNVt4tfuC3njVeqgC4PxyOcjaIVeBKkUVGvo',
    };

    userModel.findById.mockResolvedValue(user);

    const result = await userService.getUserById(id);

    expect(result).toEqual(user);
    expect(userModel.findById).toHaveBeenCalledWith(id);
  });

  it('should update user', async () => {
    const id = '64d3784293a40415d700b0cb';
    const refreshToken =
      '$argon2id$v=19$m=65536,t=3,p=4$BYqclplllcfkZoB1um5qzg$/csYuzHENGiP5nzNJUlxmcSNRGEFKFkmPZaE3FJAtBE';
    const user = {
      username: 'username',
      displayName: 'displayName',
      role: UserRoles.USER,
      _id: id,
      refreshToken,
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0,
      password:
        '$argon2id$v=19$m=65536,t=3,p=4$E2EQ54td84DT/UjVylLkzg$gkKqPZrkNVt4tfuC3njVeqgC4PxyOcjaIVeBKkUVGvo',
    };

    userModel.findByIdAndUpdate.mockResolvedValue(user);

    const result = await userService.updateUser(id, { refreshToken });

    expect(result).toEqual(user);
    expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
      id,
      {
        refreshToken,
      },
      { new: true },
    );
  });

  it('should check default category in users when server starts', async () => {
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
      save: jest.fn(),
    };
    const users = [user];

    const category: any = {
      _id: user.defaultCategory,
      label: 'інше',
      user: expect.any(String),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    userModel.find.mockResolvedValue(users);

    mockCategoriesService.getCategoryByNameAndUserId.mockResolvedValue(
      category,
    );

    mockCategoriesService.createCategory.mockResolvedValue(category);

    const saveMock = jest.fn().mockResolvedValue(user);
    user.save = saveMock;

    const result = await userService.checkUsers();

    expect(result).toBeUndefined();
  });
});
