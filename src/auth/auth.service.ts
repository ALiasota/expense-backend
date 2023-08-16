import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { UserRoles } from '../users/users.schema';
import { CategoriesService } from '../categories/categories.service';
import { ConfigService } from '@nestjs/config';

interface CreateUserDtoWithRole extends CreateUserDto {
  role: UserRoles;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private categoriesService: CategoriesService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(createUserDto: CreateUserDtoWithRole) {
    const userExists = await this.usersService.getUserByName(
      createUserDto.username,
    );
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const hash = await this.hashData(createUserDto.password);
    const user = await this.usersService.createUser({
      ...createUserDto,
      password: hash,
    });
    const tokens = await this.getTokens(user._id, user.username, user.role);
    await this.updateRefreshToken(user._id, tokens.refreshToken);
    const categories = await this.categoriesService.createDefaultCategories(
      user._id,
    );
    const defaultCategory = categories.find((c) => c.label === 'Інше');
    if (defaultCategory) {
      user.defaultCategory = defaultCategory.id;
      await user.save();
    }
    return {
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
      },
      ...tokens,
    };
  }

  async signIn(data: AuthDto) {
    const user = await this.usersService.getUserByName(data.username);
    if (!user) throw new BadRequestException('User does not exist');
    const passwordMatches = await bcrypt.compare(data.password, user.password);
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');
    const tokens = await this.getTokens(user._id, user.username, user.role);
    await this.updateRefreshToken(user._id, tokens.refreshToken);
    return {
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
      },
      ...tokens,
    };
  }

  async logout(userId: string) {
    const user = await this.usersService.updateUser(userId, {
      refreshToken: null,
    });
    if (!user) throw new BadRequestException('Something went wrong');
    return user;
  }

  async hashData(data: string) {
    return await bcrypt.hash(data, 5);
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken: string = await this.hashData(refreshToken);
    await this.usersService.updateUser(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(userId: string, username: string, role: UserRoles) {
    const JWT_ACCESS_SECRET =
      this.configService.get<string>('JWT_ACCESS_SECRET');
    const JWT_REFRESH_SECRET =
      this.configService.get<string>('JWT_REFRESH_SECRET');
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          role,
        },
        {
          secret: JWT_ACCESS_SECRET,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: JWT_REFRESH_SECRET,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.getUserById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.username, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return {
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
      },
      ...tokens,
    };
  }

  async setAdmin(userId: string) {
    const user = await this.usersService.updateUser(userId, {
      role: UserRoles.ADMIN,
    });
    if (!user) throw new BadRequestException('Something went wrong');
    return {
      id: user._id,
      username: user.username,
      displayName: user.displayName,
      role: user.role,
    };
  }
}
