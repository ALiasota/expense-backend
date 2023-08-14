import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { config } from 'dotenv';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { UserRoles } from 'src/users/users.schema';
import { CategoriesService } from '../categories/categories.service';

config();

interface CreateUserDtoWithRole extends CreateUserDto {
  role: UserRoles;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private categoriesService: CategoriesService,
    private jwtService: JwtService,
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
    const tokens = await this.getTokens(user._id, user.username);
    await this.updateRefreshToken(user._id, tokens.refreshToken);
    await this.categoriesService.createDefaultCategories(user._id);
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
    const tokens = await this.getTokens(user._id, user.username);
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

  async getTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
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
    const tokens = await this.getTokens(user.id, user.username);
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
}
