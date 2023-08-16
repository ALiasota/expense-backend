import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserRoles } from '../users/users.schema';
import { CategoriesService } from '../categories/categories.service';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let authService: AuthService;
  const mockUserService = {
    getUserByName: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
  };

  const mockCategoriesService = {
    createDefaultCategories: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        UsersService,
        CategoriesService,
        ConfigService,
      ],
    })
      .overrideProvider(UsersService)
      .useValue(mockUserService)
      .overrideProvider(CategoriesService)
      .useValue(mockCategoriesService)
      .overrideProvider(ConfigService)
      .useValue(mockConfigService)
      .overrideProvider(JwtService)
      .useValue(mockJwtService)
      .compile();
    authService = moduleRef.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should create a new user', async () => {
    const dto = {
      username: 'username',
      displayName: 'displayName',
      password: 'password',
      role: UserRoles.USER,
    };

    const mockResponse = {
      user: {
        username: dto.username,
        id: expect.any(String),
        displayName: dto.displayName,
        role: UserRoles.USER,
      },
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    };

    const mockUser: any = {
      username: dto.username,
      displayName: dto.displayName,
      role: UserRoles.USER,
      _id: expect.any(String),
      refreshToken:
        '$argon2id$v=19$m=65536,t=3,p=4$BYqclplllcfkZoB1um5qzg$/csYuzHENGiP5nzNJUlxmcSNRGEFKFkmPZaE3FJAtBE',
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0,
      password:
        '$argon2id$v=19$m=65536,t=3,p=4$E2EQ54td84DT/UjVylLkzg$gkKqPZrkNVt4tfuC3njVeqgC4PxyOcjaIVeBKkUVGvo',
    };
    mockJwtService.signAsync.mockResolvedValue('dsfdasfdasfa');
    mockUserService.getUserByName.mockResolvedValue(null);
    mockUserService.createUser.mockResolvedValue(mockUser);
    mockCategoriesService.createDefaultCategories.mockResolvedValue([
      { id: 'sdasdasd', label: 'Інше' },
    ]);

    const saveMock = jest
      .fn()
      .mockResolvedValue({ ...mockUser, defaultCategory: 'sdasdasd' });
    mockUser.save = saveMock;
    const result = await authService.signUp(dto);

    expect(result).toEqual(mockResponse);
    expect(mockUserService.getUserByName).toHaveBeenCalledWith(dto.username);
    expect(mockUserService.createUser).toHaveBeenCalledWith({
      ...dto,
      password: expect.any(String),
    });
  });

  it('should sign in', async () => {
    const dto = {
      username: 'username',
      password: 'password',
    };

    const mockResponse = {
      user: {
        username: dto.username,
        id: expect.any(String),
        displayName: expect.any(String),
        role: UserRoles.USER,
      },
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    };

    const mockUser = {
      username: dto.username,
      displayName: expect.any(String),
      role: UserRoles.USER,
      _id: expect.any(String),
      refreshToken: expect.any(String),
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0,
      password: '$2a$05$uD/AO2JSbr5foKty7WvFHex9Ma1DfO2YBcf9Fdst20PJmBIX2qFN.',
    };

    mockUserService.getUserByName.mockResolvedValue(mockUser);

    const result = await authService.signIn(dto);

    expect(result).toEqual(mockResponse);
    expect(mockUserService.getUserByName).toHaveBeenCalledWith(dto.username);
  });

  it('should log out', async () => {
    const userId = 'jhjhghjghgj';

    const mockUser = {
      username: expect.any(String),
      displayName: expect.any(String),
      role: UserRoles.USER,
      _id: userId,
      refreshToken: expect.any(String),
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0,
      password: expect.any(String),
    };

    mockUserService.updateUser.mockResolvedValue(mockUser);

    const result = await authService.logout(userId);

    expect(result).toEqual(mockUser);
  });

  it('should return tokens', async () => {
    const userId = 'jhjhghjghgj';
    const username = 'username';
    const role = UserRoles.USER;

    const mockTokens = {
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    };

    mockJwtService.signAsync.mockResolvedValue('dsfdasfdasfa');

    const result = await authService.getTokens(userId, username, role);

    expect(result).toEqual(mockTokens);
  });

  it('should refresh tokens', async () => {
    const userId = 'jhjhghjghgj';
    const refreshToken = '435fgfdgsdfgsdfgfsdg';
    const role = UserRoles.USER;

    const mockTokens = {
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    };

    mockJwtService.signAsync.mockResolvedValue('dsfdasfdasfa');

    const result = await authService.getTokens(userId, refreshToken, role);

    expect(result).toEqual(mockTokens);
  });
});
