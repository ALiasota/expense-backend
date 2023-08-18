import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UserRoles } from 'src/users/users.schema';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly reflector: Reflector,
    private configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      const JWT_ACCESS_SECRET =
        this.configService.get<string>('JWT_ACCESS_SECRET');
      const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(
        'roles',
        [context.getHandler(), context.getClass()],
      );

      if (!requiredRoles) {
        return true;
      }

      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({
          status: 401,
          message: 'Not authorized',
        });
      }
      const user = this.jwtService.verify(token, {
        secret: JWT_ACCESS_SECRET,
      });

      if (!user)
        throw new UnauthorizedException({
          status: 401,
          message: 'Not authorized',
        });
      const hasRequiredRole =
        user && requiredRoles.some((role) => role === user.role);

      return hasRequiredRole;
    } catch (e: any) {
      throw new UnauthorizedException({
        status: 401,
        message: 'Not authorized',
      });
    }
  }
}
