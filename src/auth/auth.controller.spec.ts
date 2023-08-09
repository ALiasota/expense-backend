import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
describe('AuthController', () => {
  let authController: AuthController;
  const mockAuthService = {};
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();
    authController = moduleRef.get<AuthController>(AuthController);
  });
  it('should be defined', () => {
    expect(authController).toBeDefined();
  });
});
