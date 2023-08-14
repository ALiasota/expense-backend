import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { UserRoles } from '../users/users.schema';
import { RefreshTokenGuard } from '../guards/refreshToken.guard';
import { AccessTokenGuard } from '../guards/accessToken.guard';
import { Roles } from './roles-auth.decorator';
import { RolesGuard } from '../guards/roles.guard';

const authResponse = {
  status: 200,
  schema: {
    properties: {
      user: {
        type: 'object',
        properties: {
          username: { type: 'string' },
          id: { type: 'string' },
          displayName: { type: 'string' },
          role: { type: 'string' },
        },
      },
      accessToken: { type: 'string' },
      refreshToken: { type: 'string' },
    },
  },
};

const setAdminResponse = {
  status: 200,
  schema: {
    properties: {
      user: {
        type: 'object',
        properties: {
          username: { type: 'string' },
          id: { type: 'string' },
          displayName: { type: 'string' },
          role: { type: 'string' },
        },
      },
    },
  },
};

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Signup' })
  @ApiResponse(authResponse)
  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp({ ...createUserDto, role: UserRoles.USER });
  }

  @ApiOperation({ summary: 'Signin' })
  @ApiResponse(authResponse)
  @Post('signin')
  signin(@Body() data: AuthDto) {
    return this.authService.signIn(data);
  }

  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({ status: 200 })
  @Get('logout')
  logout(@Req() req: Request) {
    this.authService.logout(req.user['sub']);
    return 'You have successfully logged out';
  }

  @UseGuards(RefreshTokenGuard)
  @ApiOperation({ summary: 'Refresh tokens' })
  @ApiResponse(authResponse)
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Set Admin' })
  @ApiResponse(setAdminResponse)
  @Post('admin/:id')
  setAdmin(@Param('id') id: string) {
    return this.authService.setAdmin(id);
  }
}
