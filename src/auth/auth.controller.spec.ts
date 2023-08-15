import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRoles } from '../users/users.schema';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthController', () => {
  let authController: AuthController;
  const mockAuthService = {
    signUp: jest.fn((dto) => {
      return {
        user: {
          id: '64d3784293a40415d700b0cb',
          username: dto.username,
          displayName: dto.displayName,
          role: 'USER',
        },
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGQzNzg0MjkzYTQwNDE1ZDcwMGIwY2IiLCJ1c2VybmFtZSI6InVzZXJuYW1lIiwiaWF0IjoxNjkxNjAzMjExLCJleHAiOjE2OTE2MDQxMTF9.O5KM4C0ohZtfYPP4nkHm3ZqN8dtCDguBO-o6SNkwm7w',
        refreshToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGQzNzg0MjkzYTQwNDE1ZDcwMGIwY2IiLCJ1c2VybmFtZSI6InVzZXJuYW1lIiwiaWF0IjoxNjkxNjAzMjExLCJleHAiOjE2OTIyMDgwMTF9.yDXtTpI1XvAuArcK4gapjqtNFAZeGR_XiD1mnkyCE0o',
      };
    }),
    signIn: jest.fn((dto) => {
      return {
        user: {
          id: '64d3784293a40415d700b0cb',
          username: dto.username,
          displayName: 'displayName',
          role: 'USER',
        },
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGQzNzg0MjkzYTQwNDE1ZDcwMGIwY2IiLCJ1c2VybmFtZSI6InVzZXJuYW1lIiwiaWF0IjoxNjkxNjAzMjExLCJleHAiOjE2OTE2MDQxMTF9.O5KM4C0ohZtfYPP4nkHm3ZqN8dtCDguBO-o6SNkwm7w',
        refreshToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGQzNzg0MjkzYTQwNDE1ZDcwMGIwY2IiLCJ1c2VybmFtZSI6InVzZXJuYW1lIiwiaWF0IjoxNjkxNjAzMjExLCJleHAiOjE2OTIyMDgwMTF9.yDXtTpI1XvAuArcK4gapjqtNFAZeGR_XiD1mnkyCE0o',
      };
    }),
    refreshTokens: jest.fn(() => {
      return {
        user: {
          id: '64d3784293a40415d700b0cb',
          username: 'username',
          displayName: 'displayName',
          role: 'USER',
        },
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGQzNzg0MjkzYTQwNDE1ZDcwMGIwY2IiLCJ1c2VybmFtZSI6InVzZXJuYW1lIiwiaWF0IjoxNjkxNjAzMjExLCJleHAiOjE2OTE2MDQxMTF9.O5KM4C0ohZtfYPP4nkHm3ZqN8dtCDguBO-o6SNkwm7w',
        refreshToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGQzNzg0MjkzYTQwNDE1ZDcwMGIwY2IiLCJ1c2VybmFtZSI6InVzZXJuYW1lIiwiaWF0IjoxNjkxNjAzMjExLCJleHAiOjE2OTIyMDgwMTF9.yDXtTpI1XvAuArcK4gapjqtNFAZeGR_XiD1mnkyCE0o',
      };
    }),
    logout: jest.fn((userId) => {
      return userId;
    }),
    setAdmin: jest.fn((userId) => {
      return {
        user: {
          id: userId,
          username: 'username',
          displayName: 'displayName',
          role: 'ADMIN',
        },
      };
    }),
  };
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, JwtService, ConfigService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();
    authController = moduleRef.get<AuthController>(AuthController);
  });
  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should create user and tokens', () => {
    const dto = {
      username: 'username',
      displayName: 'displayName',
      password: 'password',
    };
    expect(authController.signup(dto)).toEqual({
      user: {
        id: expect.any(String),
        username: dto.username,
        displayName: dto.displayName,
        role: expect.any(String),
      },
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });

    expect(mockAuthService.signUp).toHaveBeenCalledWith({
      ...dto,
      role: UserRoles.USER,
    });
  });

  it('should return user and tokens', () => {
    const dto = {
      username: 'username',
      password: 'password',
    };
    expect(authController.signin(dto)).toEqual({
      user: {
        id: expect.any(String),
        username: dto.username,
        displayName: expect.any(String),
        role: expect.any(String),
      },
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });

    expect(mockAuthService.signIn).toHaveBeenCalledWith(dto);
  });

  it('should return user and reset tokens', () => {
    const request: any = {
      user: {
        sub: '64d3784293a40415d700b0cb',
        refreshToken: 'fdsafadsfads',
      },
    };
    expect(authController.refreshTokens(request)).toEqual({
      user: {
        id: expect.any(String),
        username: expect.any(String),
        displayName: expect.any(String),
        role: expect.any(String),
      },
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });

    expect(mockAuthService.refreshTokens).toHaveBeenCalled();
  });

  it('should logout', () => {
    const request: any = {
      user: {
        sub: '64d3784293a40415d700b0cb',
      },
    };
    expect(authController.logout(request)).toEqual(expect.any(String));
  });

  it('should return user with role ADMIN', async () => {
    const id = 'dsvfdsfdsfdsf';
    const result = await authController.setAdmin(id);
    expect(result).toEqual({
      user: {
        id,
        username: expect.any(String),
        displayName: expect.any(String),
        role: 'ADMIN',
      },
    });
    expect(mockAuthService.setAdmin).toHaveBeenCalledWith(id);
  });
});
