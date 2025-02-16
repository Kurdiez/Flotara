import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/config';
import { IS_PUBLIC_KEY } from '~/commons/decorators/public.decorator';

@Injectable()
export class SystemGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    if (!request.path.startsWith('/system')) {
      return true;
    }

    const secretHeader = request.headers['x-system-secret'];

    if (secretHeader !== this.configService.get('SYSTEM_SECRET')) {
      throw new UnauthorizedException('Invalid system secret');
    }

    return true;
  }
}
